import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/user_service.dart';
import '../../constants/app_colors.dart';
import '../../widgets/app_drawer.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({super.key});

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  bool _isLoading = true;
  Map<String, dynamic>? _stats;
  List<dynamic> _activityLogs = [];

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final userService = Provider.of<UserService>(context, listen: false);

    try {
      final statsResult = await userService.getSystemStats();
      final logsResult = await userService.getActivityLogs(20);

      if (mounted) {
        setState(() {
          _stats = statsResult['success'] ? statsResult['data'] : null;
          _activityLogs = logsResult['success'] ? logsResult['data'] : [];
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error loading dashboard data: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Admin Dashboard'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _loadData),
        ],
      ),
      drawer: const AppDrawer(),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: _loadData,
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16.0),
                physics: const AlwaysScrollableScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'System Overview',
                      style: Theme.of(context).textTheme.headlineSmall
                          ?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: AppColors.primary,
                          ),
                    ),
                    const SizedBox(height: 16),
                    if (_stats != null) ...[
                      _buildSectionTitle('User Statistics'),
                      _buildUserStatsGrid(),
                      const SizedBox(height: 24),
                      _buildSectionTitle('Farm Statistics'),
                      _buildFarmStatsGrid(),
                      const SizedBox(height: 24),
                      _buildSectionTitle('Recent Activity'),
                      _buildActivityList(),
                    ] else
                      const Center(child: Text('Failed to load statistics')),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Text(
        title,
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
      ),
    );
  }

  Widget _buildUserStatsGrid() {
    final userStats = _stats!['users'];
    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 1.5,
      children: [
        _buildStatCard(
          'Total Users',
          '${userStats['total_users'] ?? 0}',
          Icons.people,
          Colors.blue,
        ),
        _buildStatCard(
          'Active Users',
          '${userStats['active_users'] ?? 0}',
          Icons.check_circle,
          Colors.green,
        ),
        _buildStatCard(
          'Admins',
          '${userStats['admin_count'] ?? 0}',
          Icons.security,
          Colors.purple,
        ),
        _buildStatCard(
          'Normal Users',
          '${userStats['user_count'] ?? 0}',
          Icons.person,
          Colors.orange,
        ),
      ],
    );
  }

  Widget _buildFarmStatsGrid() {
    final animalStats = _stats!['animals'];
    final taskStats = _stats!['tasks'];
    final barnStats = _stats!['barns'];

    return GridView.count(
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      childAspectRatio: 1.5,
      children: [
        _buildStatCard(
          'Total Animals',
          '${animalStats['total_animals'] ?? 0}',
          Icons.pets,
          Colors.brown,
        ),
        _buildStatCard(
          'Tasks',
          '${taskStats['total_tasks'] ?? 0}',
          Icons.assignment,
          Colors.teal,
        ),
        _buildStatCard(
          'Barns',
          '${barnStats['total_barns'] ?? 0}',
          Icons.house,
          Colors.redAccent,
        ),
        _buildStatCard(
          'Total Capacity',
          '${barnStats['total_capacity'] ?? 0}',
          Icons.warehouse,
          Colors.indigo,
        ),
      ],
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
  ) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 5,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: color, size: 28),
          const SizedBox(height: 8),
          Text(
            value,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          Text(
            title,
            style: const TextStyle(fontSize: 12, color: Colors.grey),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildActivityList() {
    if (_activityLogs.isEmpty) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Text('No recent activity'),
        ),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: _activityLogs.length,
      itemBuilder: (context, index) {
        final log = _activityLogs[index];
        return Card(
          elevation: 1,
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: AppColors.primary.withOpacity(0.1),
              child: Text(
                _getActivityIcon(log['type']),
                style: const TextStyle(fontSize: 16),
              ),
            ),
            title: Text(log['name'] ?? 'Unknown Action'),
            subtitle: Text(
              '${log['type']} • ${_formatDate(log['timestamp'])}',
              style: const TextStyle(fontSize: 12),
            ),
          ),
        );
      },
    );
  }

  String _getActivityIcon(String? type) {
    switch (type) {
      case 'animal':
        return '🐄';
      case 'task':
        return '📋';
      case 'employee':
        return '👤';
      case 'barn':
        return '🏠';
      default:
        return '📌';
    }
  }

  String _formatDate(String? dateStr) {
    if (dateStr == null) return '';
    try {
      final date = DateTime.parse(dateStr);
      return '${date.day}/${date.month}/${date.year} ${date.hour}:${date.minute}';
    } catch (e) {
      return dateStr;
    }
  }
}
