import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:rts_erp_mobile/main.dart';

void main() {
  testWidgets('app boots to loading or login', (tester) async {
    await tester.pumpWidget(const RtsErpMobileApp());
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });
}
