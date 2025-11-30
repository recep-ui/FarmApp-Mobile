import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';
import '../models/production_record.dart';

class ProductionService {
  static const String _endpoint = '/production-records';

  Future<List<ProductionRecord>> getProductionRecords() async {
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
          final List<dynamic> recordsJson = data['data'];
          return recordsJson
              .map((json) => ProductionRecord.fromJson(json))
              .toList();
        }
      }
      return [];
    } catch (e) {
      print('Error fetching production records: $e');
      return [];
    }
  }

  Future<bool> createProductionRecord(Map<String, dynamic> recordData) async {
    try {
      final token = await _getToken();
      if (token == null) return false;

      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}$_endpoint'),
        headers: _getHeaders(token),
        body: jsonEncode(recordData),
      );

      return response.statusCode == 201;
    } catch (e) {
      print('Error creating production record: $e');
      return false;
    }
  }

  Future<bool> updateProductionRecord(
    int id,
    Map<String, dynamic> recordData,
  ) async {
    try {
      final token = await _getToken();
      if (token == null) return false;

      final response = await http.put(
        Uri.parse('${ApiConstants.baseUrl}$_endpoint/$id'),
        headers: _getHeaders(token),
        body: jsonEncode(recordData),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error updating production record: $e');
      return false;
    }
  }

  Future<bool> deleteProductionRecord(int id) async {
    try {
      final token = await _getToken();
      if (token == null) return false;

      final response = await http.delete(
        Uri.parse('${ApiConstants.baseUrl}$_endpoint/$id'),
        headers: _getHeaders(token),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error deleting production record: $e');
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
