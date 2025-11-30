import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';
import '../models/barn.dart';

class BarnService {
  static const String _endpoint = '/barns';

  Future<List<Barn>> getBarns() async {
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
          final List<dynamic> barnsJson = data['data'];
          return barnsJson.map((json) => Barn.fromJson(json)).toList();
        }
      }
      return [];
    } catch (e) {
      print('Error fetching barns: $e');
      return [];
    }
  }

  Future<Barn?> getBarnById(int id) async {
    try {
      final token = await _getToken();
      if (token == null) return null;

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}$_endpoint/$id'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return Barn.fromJson(data['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error fetching barn details: $e');
      return null;
    }
  }

  Future<bool> createBarn(Map<String, dynamic> barnData) async {
    try {
      final token = await _getToken();
      if (token == null) return false;

      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}$_endpoint'),
        headers: _getHeaders(token),
        body: jsonEncode(barnData),
      );

      return response.statusCode == 201;
    } catch (e) {
      print('Error creating barn: $e');
      return false;
    }
  }

  Future<bool> updateBarn(int id, Map<String, dynamic> barnData) async {
    try {
      final token = await _getToken();
      if (token == null) return false;

      final response = await http.put(
        Uri.parse('${ApiConstants.baseUrl}$_endpoint/$id'),
        headers: _getHeaders(token),
        body: jsonEncode(barnData),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error updating barn: $e');
      return false;
    }
  }

  Future<bool> deleteBarn(int id) async {
    try {
      final token = await _getToken();
      if (token == null) return false;

      final response = await http.delete(
        Uri.parse('${ApiConstants.baseUrl}$_endpoint/$id'),
        headers: _getHeaders(token),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error deleting barn: $e');
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
