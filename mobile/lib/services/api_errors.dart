import '../config/api_config.dart';
import 'api_client.dart';

String friendlyApiError(Object error) {
  if (error is ApiException) {
    if (error.statusCode == null ||
        error.message.toLowerCase().contains('socket') ||
        error.message.toLowerCase().contains('failed host') ||
        error.message.toLowerCase().contains('connection')) {
      return _unreachableMessage();
    }
    return error.message;
  }

  final text = error.toString().toLowerCase();
  if (text.contains('socket') ||
      text.contains('connection') ||
      text.contains('failed host') ||
      text.contains('timed out') ||
      text.contains('network')) {
    return _unreachableMessage();
  }
  return 'Something went wrong.';
}

String _unreachableMessage() {
  final base = ApiConfig.baseUrl;
  if (base.contains('10.0.2.2')) {
    return 'Cannot reach API at $base.\n'
        '1) Start WAMP MySQL\n'
        '2) Run: php artisan serve --host=0.0.0.0 --port=8000\n'
        'On a physical phone, set ApiConfig to your PC LAN IP.';
  }
  if (base.contains('127.0.0.1') || base.contains('localhost')) {
    return 'Cannot reach API at $base.\n'
        '1) Open WAMP and start MySQL (green icon)\n'
        '2) In backend folder run:\n'
        '   C:\\wamp64\\bin\\php\\php8.3.28\\php.exe artisan serve --host=0.0.0.0 --port=8000\n'
        '3) Hot restart the app (press R in Flutter terminal)';
  }
  return 'Cannot reach API at $base.\n'
      'Check Wi‑Fi, Laravel is running, and the phone can open that address.';
}
