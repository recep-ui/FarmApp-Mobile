import 'package:flutter/material.dart';
import '../../models/animal.dart';
import '../../services/animal_service.dart';
import '../../constants/app_colors.dart';
import 'animal_form_screen.dart';

class AnimalDetailScreen extends StatefulWidget {
  final int animalId;

  const AnimalDetailScreen({super.key, required this.animalId});

  @override
  State<AnimalDetailScreen> createState() => _AnimalDetailScreenState();
}

class _AnimalDetailScreenState extends State<AnimalDetailScreen> {
  final AnimalService _animalService = AnimalService();
  late Future<Animal?> _animalFuture;

  @override
  void initState() {
    super.initState();
    _loadAnimal();
  }

  void _loadAnimal() {
    setState(() {
      _animalFuture = _animalService.getAnimalById(widget.animalId);
    });
  }

  Future<void> _deleteAnimal() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Animal'),
        content: const Text('Are you sure you want to delete this animal?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Delete'),
          ),
        ],
      ),
    );

    if (confirm == true) {
      final success = await _animalService.deleteAnimal(widget.animalId);
      if (success && mounted) {
        Navigator.pop(context, true); // Return true to refresh list
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to delete animal')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Animal Details'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.edit),
            onPressed: () async {
              final animal = await _animalFuture;
              if (animal != null && mounted) {
                final result = await Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => AnimalFormScreen(animal: animal),
                  ),
                );
                if (result == true) {
                  _loadAnimal();
                }
              }
            },
          ),
          IconButton(icon: const Icon(Icons.delete), onPressed: _deleteAnimal),
        ],
      ),
      body: FutureBuilder<Animal?>(
        future: _animalFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return const Center(child: Text('Error loading details'));
          } else if (!snapshot.hasData || snapshot.data == null) {
            return const Center(child: Text('Animal not found'));
          }

          final animal = snapshot.data!;
          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [_buildDetailCard(animal)],
            ),
          );
        },
      ),
    );
  }

  Widget _buildDetailCard(Animal animal) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            const CircleAvatar(
              radius: 40,
              backgroundColor: AppColors.secondary,
              child: Icon(Icons.pets, size: 40, color: Colors.white),
            ),
            const SizedBox(height: 16),
            Text(
              animal.tagNumber,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            Text(
              animal.species,
              style: const TextStyle(
                fontSize: 18,
                color: AppColors.textSecondary,
              ),
            ),
            const Divider(height: 32),
            _buildDetailRow('Breed', animal.breed),
            _buildDetailRow('Gender', animal.gender),
            _buildDetailRow('Birth Date', animal.birthDate.split('T')[0]),
            _buildDetailRow('Status', animal.status),
            _buildDetailRow('Barn', animal.barnName ?? 'Not Assigned'),
            _buildDetailRow('Total Production', '${animal.totalProduction}'),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: AppColors.textSecondary,
            ),
          ),
          Text(value, style: const TextStyle(fontSize: 16)),
        ],
      ),
    );
  }
}
