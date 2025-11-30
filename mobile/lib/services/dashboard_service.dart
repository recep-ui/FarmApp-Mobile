import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';
import '../models/dashboard_stats.dart';

class DashboardService {
  Future<DashboardStats?> getStats() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');

      if (token == null) return null;

      final response = await http.get(
        Uri.parse(
          '${ApiConstants.baseUrl}${ApiConstants.dashboardEndpoint}/stats',
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return DashboardStats.fromJson(data['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error fetching dashboard stats: $e');
      return null;
    }
  }
}
