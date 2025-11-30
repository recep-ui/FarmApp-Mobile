import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';
import '../models/employee.dart';

class EmployeeService {
  static const String _endpoint = '/employees';

  Future<List<Employee>> getEmployees() async {
    try {
      final token = await _getToken();
      if (token == null) return [];

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}$_endpoint'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          final List<dynamic> employeesJson = data['data'];
          return employeesJson.map((json) => Employee.fromJson(json)).toList();
        }
      }
      return [];
    } catch (e) {
      print('Error fetching employees: $e');
      return [];
    }
  }

  Future<bool> createEmployee(Map<String, dynamic> employeeData) async {
    try {
      final token = await _getToken();
      if (token == null) return false;

      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}$_endpoint'),
        headers: _getHeaders(token),
        body: jsonEncode(employeeData),
      );

      return response.statusCode == 201;
    } catch (e) {
      print('Error creating employee: $e');
      return false;
    }
  }

  Future<bool> updateEmployee(int id, Map<String, dynamic> employeeData) async {
    try {
      final token = await _getToken();
      if (token == null) return false;

      final response = await http.put(
        Uri.parse('${ApiConstants.baseUrl}$_endpoint/$id'),
        headers: _getHeaders(token),
        body: jsonEncode(employeeData),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error updating employee: $e');
      return false;
    }
  }

  Future<bool> deleteEmployee(int id) async {
    try {
      final token = await _getToken();
      if (token == null) return false;

      final response = await http.delete(
        Uri.parse('${ApiConstants.baseUrl}$_endpoint/$id'),
        headers: _getHeaders(token),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error deleting employee: $e');
      return false;
    }
  }

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Map<String, String> _getHeaders(String token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }
}
