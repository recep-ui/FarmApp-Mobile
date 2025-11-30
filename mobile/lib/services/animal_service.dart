import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../constants/api_constants.dart';
import '../models/animal.dart';

class AnimalService {
  Future<List<Animal>> getAnimals() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('token');
      if (token == null) return [];

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.animalsEndpoint}'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          final List<dynamic> animalsJson = data['data'];
          return animalsJson.map((json) => Animal.fromJson(json)).toList();
        }
      }
      return [];
    } catch (e) {
      print('Error fetching animals: $e');
      return [];
    }
  }

  Future<Animal?> getAnimalById(int id) async {
    try {
      final token = await _getToken();
      if (token == null) return null;

      final response = await http.get(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.animalsEndpoint}/$id'),
        headers: _getHeaders(token),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['success'] == true) {
          return Animal.fromJson(data['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error fetching animal details: $e');
      return null;
    }
  }

  Future<bool> createAnimal(Map<String, dynamic> animalData) async {
    try {
      final token = await _getToken();
      if (token == null) return false;

      final response = await http.post(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.animalsEndpoint}'),
        headers: _getHeaders(token),
        body: jsonEncode(animalData),
      );

      return response.statusCode == 201;
    } catch (e) {
      print('Error creating animal: $e');
      return false;
    }
  }

  Future<bool> updateAnimal(int id, Map<String, dynamic> animalData) async {
    try {
      final token = await _getToken();
      if (token == null) return false;

      final response = await http.put(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.animalsEndpoint}/$id'),
        headers: _getHeaders(token),
        body: jsonEncode(animalData),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error updating animal: $e');
      return false;
    }
  }

  Future<bool> deleteAnimal(int id) async {
    try {
      final token = await _getToken();
      if (token == null) return false;

      final response = await http.delete(
        Uri.parse('${ApiConstants.baseUrl}${ApiConstants.animalsEndpoint}/$id'),
        headers: _getHeaders(token),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error deleting animal: $e');
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
