import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';
import '../models/user.dart';

class UserService with ChangeNotifier {
  List<User> _users = [];
  bool _isLoading = false;

  List<User> get users => _users;
  bool get isLoading => _isLoading;

  Future<String?> _getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('token');
  }

  Future<void> fetchUsers() async {
    _isLoading = true;
    notifyListeners();

    try {
      final token = await _getToken();
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/users'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          final List<dynamic> usersJson = data['data'];
          _users = usersJson.map((json) => User.fromJson(json)).toList();
        }
      } else {
        print('Failed to load users: ${response.statusCode}');
      }
    } catch (e) {
      print('Error fetching users: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> updateUser(int id, Map<String, dynamic> updates) async {
    try {
      final token = await _getToken();
      final response = await http.put(
        Uri.parse('${ApiConstants.baseUrl}/users/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: jsonEncode(updates),
      );

      if (response.statusCode == 200) {
        await fetchUsers(); // Refresh list
        return true;
      }
      return false;
    } catch (e) {
      print('Error updating user: $e');
      return false;
    }
  }

  Future<bool> toggleUserStatus(int id) async {
    try {
      final token = await _getToken();
      final response = await http.patch(
        Uri.parse('${ApiConstants.baseUrl}/users/$id/toggle-status'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        await fetchUsers(); // Refresh list
        return true;
      }
      return false;
    } catch (e) {
      print('Error toggling user status: $e');
      return false;
    }
  }

  Future<bool> deleteUser(int id) async {
    try {
      final token = await _getToken();
      final response = await http.delete(
        Uri.parse('${ApiConstants.baseUrl}/users/$id'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        _users.removeWhere((user) => user.id == id);
        notifyListeners();
        return true;
      }
      return false;
    } catch (e) {
      print('Error deleting user: $e');
      return false;
    }
  }

  Future<Map<String, dynamic>> getSystemStats() async {
    try {
      final token = await _getToken();
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/users/stats'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data']};
      }
      return {
        'success': false,
        'message': data['message'] ?? 'Failed to load system stats',
      };
    } catch (e) {
      print('Error fetching system stats: $e');
      return {'success': false, 'message': 'Connection error'};
    }
  }

  Future<Map<String, dynamic>> getActivityLogs(int limit) async {
    try {
      final token = await _getToken();
      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}/users/activity-logs?limit=$limit'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200 && data['success'] == true) {
        return {'success': true, 'data': data['data']};
      }
      return {
        'success': false,
        'message': data['message'] ?? 'Failed to load activity logs',
      };
    } catch (e) {
      print('Error fetching activity logs: $e');
      return {'success': false, 'message': 'Connection error'};
    }
  }
}
