<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Billing;
use App\Models\BillingPayment;
use App\Models\InventoryMovement;
use App\Models\PurchaseOrder;
use App\Models\SetupCustomer;
use App\Models\SetupItem;
use App\Models\SetupSupplier;
use App\Models\SupplierLedger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function customerLedger(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $this->buildCustomerAccount($request),
        ]);
    }

    public function soa(Request $request): JsonResponse
    {
        $account = $this->buildCustomerAccount($request);

        return response()->json([
            'data' => [
                ...$account,
                'documentTitle' => 'STATEMENT OF ACCOUNT',
                'generatedAt' => now()->toIso8601String(),
            ],
        ]);
    }

    public function supplierLedger(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'supplierId' => ['required', 'integer', 'exists:setup_supplier,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
        ]);

        $supplier = SetupSupplier::query()->findOrFail($payload['supplierId']);
        $from = $payload['from'] ?? null;
        $to = $payload['to'] ?? null;

        $pos = PurchaseOrder::query()
            ->where('supplier_id', $supplier->id)
            ->when($from, fn ($q) => $q->whereDate('po_date', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('po_date', '<=', $to))
            ->orderBy('po_date')
            ->get();

        $ledgerCredits = SupplierLedger::query()
            ->where('supplier_id', $supplier->id)
            ->where('credit', '>', 0)
            ->orderBy('id')
            ->get();

        $entries = [];

        foreach ($pos as $po) {
            $date = optional($po->po_date)->format('Y-m-d');
            $entries[] = [
                'date' => $date,
                'displayDate' => optional($po->po_date)->format('F j, Y'),
                'ref' => $po->po_no ?: ('PO-'.str_pad((string) $po->id, 5, '0', STR_PAD_LEFT)),
                'description' => $po->quotation_id
                    ? 'Purchase Order — QTN#'.$po->quotation_id
                    : 'Purchase Order',
                'debit' => (float) $po->po_total,
                'credit' => 0.0,
                'sortKey' => $date.'-PO-'.$po->id,
            ];
        }

        foreach ($ledgerCredits as $row) {
            $rawDate = $row->getAttribute('date_created');
            $date = $rawDate
                ? \Illuminate\Support\Carbon::parse($rawDate)->format('Y-m-d')
                : now()->toDateString();
            if ($from && $date < $from) {
                continue;
            }
            if ($to && $date > $to) {
                continue;
            }
            $entries[] = [
                'date' => $date,
                'displayDate' => $date,
                'ref' => $row->po_id ? 'PO#'.$row->po_id : 'PAY-'.$row->id,
                'description' => 'Supplier payment',
                'debit' => 0.0,
                'credit' => (float) $row->credit,
                'sortKey' => $date.'-CR-'.$row->id,
            ];
        }

        usort($entries, fn ($a, $b) => strcmp($a['sortKey'], $b['sortKey']));

        $balance = 0.0;
        $rows = [];
        foreach ($entries as $entry) {
            $balance += $entry['debit'] - $entry['credit'];
            $rows[] = [
                'date' => $entry['displayDate'] ?? $entry['date'],
                'ref' => $entry['ref'],
                'description' => $entry['description'],
                'debit' => $entry['debit'],
                'credit' => $entry['credit'],
                'balance' => $balance,
            ];
        }

        $totalDebit = collect($rows)->sum('debit');
        $totalCredit = collect($rows)->sum('credit');

        return response()->json([
            'data' => [
                'supplierId' => (string) $supplier->id,
                'supplierName' => $supplier->name,
                'from' => $from,
                'to' => $to,
                'rows' => $rows,
                'totals' => [
                    'totalDebit' => (float) $totalDebit,
                    'totalCredit' => (float) $totalCredit,
                    'outstanding' => (float) ($totalDebit - $totalCredit),
                ],
            ],
        ]);
    }

    public function inventory(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'branchId' => ['nullable', 'integer'],
            'q' => ['nullable', 'string', 'max:100'],
        ]);

        $branchId = isset($payload['branchId']) ? (int) $payload['branchId'] : null;
        $q = strtolower(trim((string) ($payload['q'] ?? '')));

        $stockQuery = InventoryMovement::query()
            ->select(
                'item_id',
                DB::raw('SUM(`in`) as qty_in'),
                DB::raw('SUM(`out`) as qty_out'),
            )
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->where('item_id', '>', 0)
            ->groupBy('item_id');

        $stockRows = $stockQuery->get();
        $itemIds = $stockRows->pluck('item_id')->filter()->unique()->values();
        $items = SetupItem::query()
            ->with(['brand', 'unitMeasure'])
            ->whereIn('id', $itemIds)
            ->get()
            ->keyBy('id');

        $stock = $stockRows->map(function ($row) use ($items) {
            $item = $items->get($row->item_id);
            $qty = (float) $row->qty_in - (float) $row->qty_out;

            return [
                'itemId' => (string) $row->item_id,
                'itemCode' => 'ITM-'.str_pad((string) $row->item_id, 5, '0', STR_PAD_LEFT),
                'itemName' => $item?->item_name ?? 'Item '.$row->item_id,
                'brand' => $item?->brand?->name ?? '',
                'unit' => $item?->unitMeasure?->name ?? 'UNITS',
                'quantity' => $qty,
                'status' => $qty <= 0 ? 'Out of Stock' : ($qty <= 5 ? 'Low Stock' : 'In Stock'),
            ];
        })->values();

        if ($q !== '') {
            $stock = $stock->filter(function ($row) use ($q) {
                return str_contains(strtolower($row['itemName'].' '.$row['itemCode'].' '.$row['brand']), $q);
            })->values();
        }

        $movements = InventoryMovement::query()
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->orderByDesc('id')
            ->limit(200)
            ->get()
            ->map(function (InventoryMovement $row) use ($items) {
                $item = $items->get($row->item_id) ?? SetupItem::query()->find($row->item_id);

                return [
                    'id' => (string) $row->id,
                    'itemId' => (string) $row->item_id,
                    'itemName' => $item?->item_name ?? 'Item '.$row->item_id,
                    'itemCode' => 'ITM-'.str_pad((string) $row->item_id, 5, '0', STR_PAD_LEFT),
                    'date' => optional($row->trans_date)->format('Y-m-d'),
                    'displayDate' => optional($row->trans_date)->format('F j, Y'),
                    'transType' => $row->trans_type,
                    'transId' => (string) $row->trans_id,
                    'branchId' => (string) $row->branch_id,
                    'in' => (float) $row->in,
                    'out' => (float) $row->out,
                    'change' => (float) $row->in - (float) $row->out,
                ];
            });

        if ($q !== '') {
            $movements = $movements->filter(function ($row) use ($q) {
                return str_contains(
                    strtolower($row['itemName'].' '.$row['itemCode'].' '.$row['transType'].' '.$row['transId']),
                    $q,
                );
            })->values();
        }

        return response()->json([
            'data' => [
                'summary' => [
                    'itemCount' => $stock->count(),
                    'totalQuantity' => (float) $stock->sum('quantity'),
                    'movementCount' => $movements->count(),
                    'lowStock' => $stock->where('status', 'Low Stock')->count(),
                    'outOfStock' => $stock->where('status', 'Out of Stock')->count(),
                ],
                'stock' => $stock,
                'movements' => $movements,
            ],
        ]);
    }

    private function buildCustomerAccount(Request $request): array
    {
        $payload = $request->validate([
            'customerId' => ['required', 'integer', 'exists:setup_customer,id'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date'],
        ]);

        $customer = SetupCustomer::query()->findOrFail($payload['customerId']);
        $from = $payload['from'] ?? null;
        $to = $payload['to'] ?? null;

        $bills = Billing::query()
            ->with('delivery')
            ->where('customer_id', $customer->id)
            ->when($from, fn ($q) => $q->whereDate('billing_date', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('billing_date', '<=', $to))
            ->orderBy('billing_date')
            ->get();

        $billIds = $bills->pluck('id');

        $payments = BillingPayment::query()
            ->whereIn('billing_id', $billIds)
            ->when($from, fn ($q) => $q->whereDate('payment_date', '>=', $from))
            ->when($to, fn ($q) => $q->whereDate('payment_date', '<=', $to))
            ->orderBy('payment_date')
            ->get();

        $entries = [];

        foreach ($bills as $bill) {
            $date = optional($bill->billing_date)->format('Y-m-d');
            $ref = $bill->billing_no ?: ('BS-'.str_pad((string) $bill->id, 5, '0', STR_PAD_LEFT));
            $drNo = $bill->delivery?->dr_no;
            $entries[] = [
                'date' => $date,
                'displayDate' => optional($bill->billing_date)->format('F j, Y'),
                'ref' => $ref,
                'description' => $drNo ? 'Billing — '.$drNo : 'Billing — '.$customer->name,
                'debit' => (float) $bill->billing_total,
                'credit' => 0.0,
                'sortKey' => $date.'-B-'.$bill->id,
            ];
        }

        foreach ($payments as $payment) {
            $date = optional($payment->payment_date)->format('Y-m-d');
            $ref = $payment->payment_no
                ?: ($payment->reference ?: ('PAY-'.str_pad((string) $payment->id, 5, '0', STR_PAD_LEFT)));
            $entries[] = [
                'date' => $date,
                'displayDate' => optional($payment->payment_date)->format('F j, Y'),
                'ref' => $ref,
                'description' => $payment->remarks ?: 'Payment',
                'debit' => 0.0,
                'credit' => (float) $payment->amount,
                'sortKey' => $date.'-P-'.$payment->id,
            ];
        }

        usort($entries, fn ($a, $b) => strcmp($a['sortKey'], $b['sortKey']));

        $balance = 0.0;
        $rows = [];
        foreach ($entries as $entry) {
            $balance += $entry['debit'] - $entry['credit'];
            $rows[] = [
                'date' => $entry['displayDate'] ?? $entry['date'],
                'ref' => $entry['ref'],
                'description' => $entry['description'],
                'debit' => $entry['debit'],
                'credit' => $entry['credit'],
                'balance' => $balance,
            ];
        }

        $totalDebit = collect($rows)->sum('debit');
        $totalCredit = collect($rows)->sum('credit');

        return [
            'customerId' => (string) $customer->id,
            'customerName' => $customer->name,
            'customerAddress' => $customer->address,
            'from' => $from,
            'to' => $to,
            'periodLabel' => $this->periodLabel($from, $to),
            'rows' => $rows,
            'totals' => [
                'totalDebit' => (float) $totalDebit,
                'totalCredit' => (float) $totalCredit,
                'outstanding' => (float) ($totalDebit - $totalCredit),
            ],
        ];
    }

    private function periodLabel(?string $from, ?string $to): string
    {
        if ($from && $to) {
            return $from.' to '.$to;
        }
        if ($from) {
            return 'From '.$from;
        }
        if ($to) {
            return 'Through '.$to;
        }

        return 'All dates';
    }
}
