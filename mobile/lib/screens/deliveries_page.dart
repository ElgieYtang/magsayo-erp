import 'package:flutter/material.dart';

import '../services/api_client.dart';
import '../services/api_errors.dart';
import '../services/offline_cache.dart';
import '../navigation/mobile_modules.dart';
import '../navigation/transaction_detail_host.dart';
import '../navigation/transaction_navigation.dart';
import '../services/transaction_actions.dart';
import '../services/transaction_lists.dart';
import '../theme/app_theme.dart';
import '../widgets/delivery_receipt_scan_panel.dart';
import '../widgets/field_ui.dart';
import '../widgets/print_document_button.dart';
import '../widgets/transaction_workflows.dart';

class DeliveriesPage extends StatefulWidget {
  const DeliveriesPage({super.key, required this.api});

  final ApiClient api;

  @override
  State<DeliveriesPage> createState() => _DeliveriesPageState();
}

class _DeliveriesPageState extends State<DeliveriesPage> {
  bool _loading = true;
  bool _fromCache = false;
  String? _busyId;
  String? _error;
  String? _offlineLabel;
  String _filter = 'active';
  List<Map<String, dynamic>> _rows = [];
  TransactionLists _lists = const TransactionLists();

  @override
  void initState() {
    super.initState();
    _load();
  }

  List<Map<String, dynamic>> get _visible {
    switch (_filter) {
      case 'active':
        return _rows
            .where((r) => r['status'] == 'active' || r['status'] == 'out_for_delivery')
            .toList();
      case 'delivered':
        return _rows.where((r) => r['status'] == 'delivered').toList();
      default:
        return _rows;
    }
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
      _fromCache = false;
      _offlineLabel = null;
    });
    try {
      final results = await Future.wait([
        widget.api.getList('/delivery-receipts'),
        TransactionLists.load(widget.api),
      ]);
      final data = results[0] as List<dynamic>;
      final lists = results[1] as TransactionLists;
      await OfflineCache.saveList(OfflineCache.deliveries, data);
      if (!mounted) return;
      setState(() {
        _rows = data.cast<Map<String, dynamic>>();
        _lists = lists;
        _loading = false;
      });
    } catch (error) {
      final cached = await OfflineCache.loadList(OfflineCache.deliveries);
      final lists = await TransactionLists.fromCache();
      if (!mounted) return;
      if (cached.rows.isNotEmpty) {
        setState(() {
          _rows = cached.rows;
          _lists = lists;
          _fromCache = true;
          _offlineLabel = OfflineCache.staleLabel(cached.savedAt);
          _error = friendlyApiError(error);
          _loading = false;
        });
      } else {
        setState(() {
          _error = friendlyApiError(error);
          _loading = false;
        });
      }
    }
  }

  Future<void> _setStatus(Map<String, dynamic> row, String status) async {
    if (_fromCache) {
      fieldShowOfflineBlocked(context);
      return;
    }

    final id = row['dbId']?.toString() ?? row['id']?.toString();
    if (id == null || _busyId != null) return;
    if (!canUpdateDeliveryStatus(row, status)) return;

    setState(() => _busyId = id);
    try {
      final updated = await updateDeliveryStatus(context, widget.api, row, status);
      if (updated != null) await _load();
    } finally {
      if (mounted) setState(() => _busyId = null);
    }
  }

  Future<void> _createBilling(Map<String, dynamic> row, {bool popCurrentRoute = false}) async {
    if (_fromCache) {
    fieldShowOfflineBlocked(context);
      return;
    }
    final id = fieldDbId(row);
    if (id.isEmpty || _busyId != null) return;
    if (!canCreateBillingFromDelivery(row, _lists)) return;
    setState(() => _busyId = id);
    try {
      final created = await confirmCreateBilling(context, widget.api, row);
      if (created != null) {
        await _load();
        if (!mounted) return;
        await openCreatedTransaction(
          context,
          widget.api,
          MobileModule.billing,
          created,
          popCurrentRoute: popCurrentRoute,
          offline: _fromCache,
        );
      }
    } finally {
      if (mounted) setState(() => _busyId = null);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading && _rows.isEmpty && _error == null) {
      return const Center(child: CircularProgressIndicator());
    }

    final visible = _visible;

    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(12),
        children: [
          FieldFilterBar(
            value: _filter,
            options: const [
              (id: 'active', label: 'Active'),
              (id: 'delivered', label: 'Delivered'),
              (id: 'all', label: 'All'),
            ],
            onChanged: (value) => setState(() => _filter = value),
          ),
          if (_fromCache && _offlineLabel != null)
            FieldOfflineBanner(
              label: _offlineLabel!,
              hint: OfflineCache.offlineReconnectHint,
            ),
          if (!_lists.crossModuleRulesReliable && !_loading)
            const FieldPartialCacheBanner(),
          if (_error != null && !_fromCache) FieldErrorBanner(message: _error!, onRetry: _load),
          if (visible.isEmpty && (_error == null || _fromCache))
            FieldEmptyState(
              icon: Icons.local_shipping_outlined,
              title: _filter == 'active' ? 'No active deliveries' : 'No deliveries',
            ),
          ...visible.map((row) {
            final id = row['dbId']?.toString() ?? row['id']?.toString() ?? '';
            final status = row['status']?.toString() ?? '';
            final itemCount = (row['items'] as List<dynamic>? ?? const []).length;
            final busy = _busyId == id;
            final showOut = canMarkDeliveryOut(row);
            final showDelivered = canMarkDeliveryDeliveredWithSerials(row);
            final showBilling =
                _lists.crossModuleRulesReliable && canCreateBillingFromDelivery(row, _lists);

            return Card(
              child: InkWell(
                onTap: () async {
                  await pushTransactionDetail(
                    context,
                    widget.api,
                    MobileModule.deliveries,
                    row,
                    offline: _fromCache,
                  );
                  await _load();
                },
                child: Padding(
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              row['id']?.toString() ?? 'DR',
                              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
                            ),
                          ),
                          FieldStatusChip(status),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(row['customerName']?.toString().isNotEmpty == true
                          ? row['customerName'].toString()
                          : 'Customer —'),
                      Text(
                        '${row['displayDate'] ?? row['date'] ?? '—'} · '
                        'Outslip: ${row['referenceOutslipId'] ?? '—'} · '
                        '$itemCount item(s)',
                      ),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          if (showOut)
                            FilledButton(
                              onPressed: busy || _fromCache
                                  ? null
                                  : () => _setStatus(row, 'out_for_delivery'),
                              child: Text(busy ? 'Updating…' : 'Out for delivery'),
                            ),
                          if (showDelivered)
                            FilledButton.tonal(
                              onPressed:
                                  busy || _fromCache ? null : () => _setStatus(row, 'delivered'),
                              child: const Text('Mark delivered'),
                            ),
                          if (showBilling)
                            FilledButton(
                              onPressed: busy || _fromCache ? null : () => _createBilling(row),
                              child: Text(busy ? 'Working…' : 'Create billing'),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }
}

class DeliveryDetailPage extends StatefulWidget {
  const DeliveryDetailPage({
    super.key,
    required this.api,
    required this.delivery,
    this.popAfterMutations = true,
    this.onSetStatus,
    this.onCreateBilling,
    this.onDeliveryUpdated,
    this.workflowNotice,
    this.workflowNoticeLoading = false,
    this.offline = false,
  });

  final ApiClient api;
  final Map<String, dynamic> delivery;
  final bool popAfterMutations;
  final Future<void> Function(String status)? onSetStatus;
  final Future<void> Function()? onCreateBilling;
  final ValueChanged<Map<String, dynamic>>? onDeliveryUpdated;
  final String? workflowNotice;
  final bool workflowNoticeLoading;
  final bool offline;

  @override
  State<DeliveryDetailPage> createState() => _DeliveryDetailPageState();
}

class _DeliveryDetailPageState extends State<DeliveryDetailPage> {
  late Map<String, dynamic> _delivery;

  @override
  void initState() {
    super.initState();
    _delivery = Map<String, dynamic>.from(widget.delivery);
  }

  @override
  void didUpdateWidget(covariant DeliveryDetailPage oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.delivery != widget.delivery) {
      _delivery = Map<String, dynamic>.from(widget.delivery);
    }
  }

  void _handleDeliveryUpdated(Map<String, dynamic> updated) {
    setState(() => _delivery = Map<String, dynamic>.from(updated));
    widget.onDeliveryUpdated?.call(updated);
  }

  @override
  Widget build(BuildContext context) {
    final status = _delivery['status']?.toString() ?? '';
    final items = (_delivery['items'] as List<dynamic>? ?? const [])
        .whereType<Map>()
        .map((e) => Map<String, dynamic>.from(e))
        .toList();
    final customer = _delivery['customerName']?.toString().isNotEmpty == true
        ? _delivery['customerName'].toString()
        : 'Customer —';
    final showScanPanel = canScanDeliverySerials(_delivery, offline: widget.offline);
    final serialsPending = deliverySerialsPending(_delivery);

    if (showScanPanel) {
      return DeliveryScanDetailView(
        api: widget.api,
        delivery: _delivery,
        popAfterMutations: widget.popAfterMutations,
        onSetStatus: widget.onSetStatus,
        onCreateBilling: widget.onCreateBilling,
        onSaved: _handleDeliveryUpdated,
        workflowNotice: widget.workflowNotice,
        workflowNoticeLoading: widget.workflowNoticeLoading,
        offline: widget.offline,
      );
    }

    return FieldDetailScaffold(
      title: _delivery['id']?.toString() ?? 'Delivery',
      subtitle: customer,
      status: status,
      workflowNotice: widget.workflowNotice,
      workflowNoticeLoading: widget.workflowNoticeLoading,
      secondaryActions: [
        PrintDocumentButton(
          onPrint: () => printDeliveryReceipt(context, widget.api, _delivery),
          label: 'Print PDF',
          enabled: !widget.offline,
        ),
      ],
      primaryActions: [
        if (widget.onSetStatus != null && canMarkDeliveryOut(_delivery))
          FilledButton(
            onPressed: () async {
              await widget.onSetStatus!('out_for_delivery');
              if (widget.popAfterMutations && context.mounted) Navigator.pop(context);
            },
            child: const Text('Out for delivery'),
          ),
        if (widget.onSetStatus != null && canMarkDeliveryDeliveredWithSerials(_delivery))
          FilledButton.tonal(
            onPressed: () async {
              await widget.onSetStatus!('delivered');
              if (widget.popAfterMutations && context.mounted) Navigator.pop(context);
            },
            child: const Text('Mark delivered'),
          ),
        if (widget.onCreateBilling != null)
          FilledButton(
            onPressed: () async => widget.onCreateBilling!(),
            child: const Text('Create billing'),
          ),
      ],
      children: [
        FieldDetailMeta(
          rows: [
            (label: 'Date', value: '${_delivery['displayDate'] ?? _delivery['date'] ?? '—'}'),
            (label: 'Outslip', value: '${_delivery['referenceOutslipId'] ?? '—'}'),
            if (_delivery['total'] != null)
              (label: 'Total', value: '${_delivery['total']}'),
          ],
        ),
        const SizedBox(height: 16),
        const FieldSectionTitle('Line items'),
        FieldLineItems(items: items, showSerialProgress: true),
        if (serialsPending) ...[
          const SizedBox(height: 12),
          Text(
            deliverySerialsBlockedMessage(),
            style: const TextStyle(color: AppTheme.warningText, height: 1.35),
          ),
        ],
      ],
    );
  }
}
