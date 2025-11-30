import 'package:flutter/material.dart';
import '../../services/feeding_service.dart';
import '../../models/feeding_record.dart';
import '../../constants/app_colors.dart';
import 'feeding_form_screen.dart';

class FeedingListScreen extends StatefulWidget {
  const FeedingListScreen({super.key});

  @override
  State<FeedingListScreen> createState() => _FeedingListScreenState();
}

class _FeedingListScreenState extends State<FeedingListScreen> {
  final FeedingService _feedingService = FeedingService();
  late Future<List<FeedingRecord>> _recordsFuture;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _recordsFuture = _feedingService.getFeedingRecords();
  }

  Future<void> _deleteRecord(int id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Record'),
        content: const Text(
          'Are you sure you want to delete this feeding record?',
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
      final success = await _feedingService.deleteFeedingRecord(id);
      if (success) {
        setState(() {
          _recordsFuture = _feedingService.getFeedingRecords();
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
      appBar: AppBar(title: const Text('Feeding Records')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Search by tag, feed type...',
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
            child: FutureBuilder<List<FeedingRecord>>(
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
                      'No feeding records found',
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
                      (record.feedType.toLowerCase().contains(_searchQuery)) ||
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
                          backgroundColor: Colors.green.shade100,
                          child: const Icon(
                            Icons.restaurant,
                            color: Colors.green,
                          ),
                        ),
                        title: Text(
                          '${record.feedType} - ${record.quantity} ${record.unit}',
                        ),
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
                                        FeedingFormScreen(record: record),
                                  ),
                                );
                                if (result == true) {
                                  setState(() {
                                    _recordsFuture = _feedingService
                                        .getFeedingRecords();
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
            MaterialPageRoute(builder: (context) => const FeedingFormScreen()),
          );
          if (result == true) {
            setState(() {
              _recordsFuture = _feedingService.getFeedingRecords();
            });
          }
        },
        backgroundColor: AppColors.primary,
        child: const Icon(Icons.add),
      ),
    );
  }
}
