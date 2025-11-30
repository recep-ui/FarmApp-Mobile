import 'package:flutter/material.dart';
import '../../services/barn_service.dart';
import '../../models/barn.dart';
import '../../constants/app_colors.dart';
import 'barn_form_screen.dart';

class BarnListScreen extends StatefulWidget {
  const BarnListScreen({super.key});

  @override
  State<BarnListScreen> createState() => _BarnListScreenState();
}

class _BarnListScreenState extends State<BarnListScreen> {
  final BarnService _barnService = BarnService();
  late Future<List<Barn>> _barnsFuture;

  @override
  void initState() {
    super.initState();
    _barnsFuture = _barnService.getBarns();
  }

  Future<void> _deleteBarn(int id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Delete Barn'),
        content: const Text('Are you sure you want to delete this barn?'),
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
      final success = await _barnService.deleteBarn(id);
      if (success) {
        setState(() {
          _barnsFuture = _barnService.getBarns();
        });
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to delete barn. Ensure it is empty.'),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Barns'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: FutureBuilder<List<Barn>>(
        future: _barnsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return const Center(child: Text('Error loading barns'));
          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No barns found'));
          }

          final barns = snapshot.data!;
          return ListView.builder(
            itemCount: barns.length,
            itemBuilder: (context, index) {
              final barn = barns[index];
              return Card(
                margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                child: ListTile(
                  leading: CircleAvatar(
                    backgroundColor: Colors.brown.shade300,
                    child: const Icon(Icons.house, color: Colors.white),
                  ),
                  title: Text(barn.name),
                  subtitle: Text(
                    'Capacity: ${barn.currentOccupancy}/${barn.capacity} | ${barn.location ?? "No Location"}',
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
                              builder: (context) => BarnFormScreen(barn: barn),
                            ),
                          );
                          if (result == true) {
                            setState(() {
                              _barnsFuture = _barnService.getBarns();
                            });
                          }
                        },
                      ),
                      IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red),
                        onPressed: () => _deleteBarn(barn.id),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const BarnFormScreen()),
          );
          if (result == true) {
            setState(() {
              _barnsFuture = _barnService.getBarns();
            });
          }
        },
        backgroundColor: AppColors.primary,
        child: const Icon(Icons.add),
      ),
    );
  }
}
