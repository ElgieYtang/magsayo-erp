/// API base URL for the Laravel backend.
///
/// Android emulator → host machine is 10.0.2.2
/// Physical device → use your PC LAN IP (ipconfig)
class ApiConfig {
  static const String baseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:8000/api',
  );
}
