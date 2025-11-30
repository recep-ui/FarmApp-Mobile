import 'package:flutter/material.dart';
import '../../services/health_service.dart';
import '../../models/health_record.dart';
import '../../constants/app_colors.dart';
import 'health_form_screen.dart';

class HealthListScreen extends StatefulWidget {
  const HealthListScreen({super.key});

  @override
  State<HealthListScreen> createState() => _HealthListScreenState();
}

class _HealthListScreenState extends State<HealthListScreen> {
  final HealthService _healthService = HealthService();
  late Future<List<HealthRecord>> _recordsFuture;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _recordsFuture = _healthService.getHealthRecords();
  }

  Future<void> _deleteRecord(int id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Record'),
        content: const Text(
          'Are you sure you want to delete this health record?',
        ),
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
      final success = await _healthService.deleteHealthRecord(id);
      if (success) {
        setState(() {
          _recordsFuture = _healthService.getHealthRecords();
        });
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to delete record')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(title: const Text('Health Records')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search by tag, diagnosis...',
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
            child: FutureBuilder<List<HealthRecord>>(
              future: _recordsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(
                    child: Text(
                      'Error loading records',
                      style: TextStyle(color: theme.colorScheme.error),
                    ),
                  );
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Center(
                    child: Text(
                      'No health records found',
                      style: TextStyle(color: theme.textTheme.bodyLarge?.color),
                    ),
                  );
                }

                final records = snapshot.data!;
                final filteredRecords = records.where((record) {
                  return (record.animalTag?.toLowerCase().contains(
                            _searchQuery,
                          ) ??
                          false) ||
                      (record.diagnosis?.toLowerCase().contains(_searchQuery) ??
                          false) ||
                      (record.animalSpecies?.toLowerCase().contains(
                            _searchQuery,
                          ) ??
                          false);
                }).toList();

                if (filteredRecords.isEmpty) {
                  return Center(
                    child: Text(
                      'No matching records found',
                      style: TextStyle(color: theme.textTheme.bodyLarge?.color),
                    ),
                  );
                }

                return ListView.builder(
                  itemCount: filteredRecords.length,
                  itemBuilder: (context, index) {
                    final record = filteredRecords[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: Colors.red.shade100,
                          child: const Icon(
                            Icons.medical_services,
                            color: Colors.red,
                          ),
                        ),
                        title: Text(record.diagnosis ?? 'No Diagnosis'),
                        subtitle: Text(
                          '${record.animalTag} (${record.animalSpecies}) | ${record.date.split('T')[0]}',
                        ),
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.edit, color: Colors.blue),
                              onPressed: () async {
                                final result = await Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder: (context) =>
                                        HealthFormScreen(record: record),
                                  ),
                                );
                                if (result == true) {
                                  setState(() {
                                    _recordsFuture = _healthService
                                        .getHealthRecords();
                                  });
                                }
                              },
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete, color: Colors.red),
                              onPressed: () => _deleteRecord(record.id),
                            ),
                          ],
                        ),
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
            MaterialPageRoute(builder: (context) => const HealthFormScreen()),
          );
          if (result == true) {
            setState(() {
              _recordsFuture = _healthService.getHealthRecords();
            });
          }
        },
        backgroundColor: AppColors.primary,
        child: const Icon(Icons.add),
      ),
    );
  }
}
