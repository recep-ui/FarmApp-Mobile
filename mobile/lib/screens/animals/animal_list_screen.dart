import 'package:flutter/material.dart';
import '../../services/animal_service.dart';
import '../../models/animal.dart';
import '../../constants/app_colors.dart';
import 'animal_detail_screen.dart';
import 'animal_form_screen.dart';

class AnimalListScreen extends StatefulWidget {
  const AnimalListScreen({super.key});

  @override
  State<AnimalListScreen> createState() => _AnimalListScreenState();
}

class _AnimalListScreenState extends State<AnimalListScreen> {
  final AnimalService _animalService = AnimalService();
  late Future<List<Animal>> _animalsFuture;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _animalsFuture = _animalService.getAnimals();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Animals')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search by tag, species, or breed...',
                prefixIcon: const Icon(Icons.search),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                filled: true,
                fillColor: theme.cardTheme.color ?? theme.colorScheme.surface,
              ),
              onChanged: (value) {
                setState(() {
                  _searchQuery = value.toLowerCase();
                });
              },
            ),
          ),
          Expanded(
            child: FutureBuilder<List<Animal>>(
              future: _animalsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(
                    child: Text(
                      'Error loading animals',
                      style: TextStyle(color: theme.colorScheme.error),
                    ),
                  );
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(
                    child: Text(
                      'No animals found',
                      style: TextStyle(color: theme.textTheme.bodyLarge?.color),
                    ),
                  );
                }

                final animals = snapshot.data!;
                final filteredAnimals = animals.where((animal) {
                  return animal.tagNumber.toLowerCase().contains(
                        _searchQuery,
                      ) ||
                      animal.species.toLowerCase().contains(_searchQuery) ||
                      (animal.breed?.toLowerCase().contains(_searchQuery) ??
                          false);
                }).toList();

                if (filteredAnimals.isEmpty) {
                  return Center(
                    child: Text(
                      'No matching animals found',
                      style: TextStyle(color: theme.textTheme.bodyLarge?.color),
                    ),
                  );
                }

                final groupedAnimals = _groupAnimalsBySpecies(filteredAnimals);

                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  itemCount: groupedAnimals.length,
                  itemBuilder: (context, index) {
                    final species = groupedAnimals.keys.elementAt(index);
                    final speciesAnimals = groupedAnimals[species]!;

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ExpansionTile(
                        shape: const Border(),
                        leading: CircleAvatar(
                          backgroundColor: _getColorForSpecies(species),
                          child: Text(
                            species.isNotEmpty ? species[0] : '?',
                            style: const TextStyle(color: Colors.white),
                          ),
                        ),
                        title: Text(
                          species,
                          style: theme.textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        subtitle: Text(
                          '${speciesAnimals.length} Animals',
                          style: theme.textTheme.bodySmall,
                        ),
                        children: speciesAnimals
                            .map((animal) => _buildAnimalItem(animal, theme))
                            .toList(),
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const AnimalFormScreen()),
          );
          if (result == true) {
            setState(() {
              _animalsFuture = _animalService.getAnimals();
            });
          }
        },
        backgroundColor: AppColors.primary,
        child: const Icon(Icons.add),
      ),
    );
  }

  Map<String, List<Animal>> _groupAnimalsBySpecies(List<Animal> animals) {
    final Map<String, List<Animal>> grouped = {};
    for (var animal in animals) {
      if (!grouped.containsKey(animal.species)) {
        grouped[animal.species] = [];
      }
      grouped[animal.species]!.add(animal);
    }
    return grouped;
  }

  Color _getColorForSpecies(String species) {
    switch (species) {
      case "Cows":
        return Colors.brown;
      case "Sheep":
        return Colors.grey;
      case "Chickens":
        return Colors.orange;
      case "Goats":
        return Colors.amber;
      default:
        return AppColors.primary;
    }
  }

  Widget _buildAnimalItem(Animal animal, ThemeData theme) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 4),
      title: Text(
        'Tag: ${animal.tagNumber}',
        style: theme.textTheme.bodyLarge?.copyWith(fontWeight: FontWeight.w500),
      ),
      subtitle: Text(
        '${animal.breed} | ${animal.status}',
        style: theme.textTheme.bodyMedium?.copyWith(color: Colors.grey),
      ),
      trailing: const Icon(Icons.arrow_forward_ios, size: 14),
      onTap: () async {
        await Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => AnimalDetailScreen(animalId: animal.id),
          ),
        );
        setState(() {
          _animalsFuture = _animalService.getAnimals();
        });
      },
    );
  }
}
