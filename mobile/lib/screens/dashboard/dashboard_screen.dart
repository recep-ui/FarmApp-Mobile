import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../services/auth_service.dart';
import '../../services/dashboard_service.dart';
import '../../models/dashboard_stats.dart';
import '../../widgets/app_drawer.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  late Future<DashboardStats?> _statsFuture;
  final DashboardService _dashboardService = DashboardService();

  @override
  void initState() {
    super.initState();
    _statsFuture = _dashboardService.getStats();
  }

  Future<void> _refreshStats() async {
    setState(() {
      _statsFuture = _dashboardService.getStats();
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = Provider.of<AuthService>(context).user;
    final theme = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
        actions: [
          IconButton(icon: const Icon(Icons.refresh), onPressed: _refreshStats),
        ],
      ),
      drawer: const AppDrawer(),
      body: RefreshIndicator(
        onRefresh: _refreshStats,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Welcome, ${user?.firstName ?? "User"}!',
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 20),
              FutureBuilder<DashboardStats?>(
                future: _statsFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return const Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(
                      child: Text(
                        'Error loading stats',
                        style: TextStyle(color: theme.colorScheme.error),
                      ),
                    );
                  } else if (!snapshot.hasData || snapshot.data == null) {
                    return Center(
                      child: Text(
                        'No data available',
                        style: TextStyle(
                          color: theme.textTheme.bodyLarge?.color,
                        ),
                      ),
                    );
                  }

                  final stats = snapshot.data!;
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildSummaryCards(stats, theme),
                      const SizedBox(height: 20),
                      _buildAnimalDistributionChart(stats.animals, theme),
                      const SizedBox(height: 20),
                      Text(
                        "Production Overview",
                        style: theme.textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 10),
                      _buildProductionOverview(stats.production, theme),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSummaryCards(DashboardStats stats, ThemeData theme) {
    return Row(
      children: [
        Expanded(
          child: _buildStatCard(
            'Animals',
            stats.animals.totalAnimals.toString(),
            Icons.pets,
            Colors.blue,
            theme,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _buildStatCard(
            'Tasks',
            stats.tasks.pendingTasks.toString(),
            Icons.assignment,
            Colors.orange,
            theme,
            label: 'Pending',
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _buildStatCard(
            'Production',
            stats.production.length.toString(),
            Icons.eco,
            Colors.green,
            theme,
            label: 'Types',
          ),
        ),
      ],
    );
  }

  Widget _buildStatCard(
    String title,
    String value,
    IconData icon,
    Color color,
    ThemeData theme, {
    String? label,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.cardTheme.color ?? theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 30),
          const SizedBox(height: 10),
          Text(
            value,
            style: theme.textTheme.headlineSmall?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          Text(
            label ?? title,
            style: theme.textTheme.bodyMedium?.copyWith(
              color: theme.textTheme.bodySmall?.color ?? Colors.grey,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAnimalDistributionChart(AnimalStats stats, ThemeData theme) {
    final Map<String, double> dataMap = {
      "Cows": stats.totalCows.toDouble(),
      "Sheep": stats.totalSheep.toDouble(),
      "Chickens": stats.totalChickens.toDouble(),
      "Goats": stats.totalGoats.toDouble(),
    };

    final validData = Map.fromEntries(
      dataMap.entries.where((e) => e.value > 0),
    );

    if (validData.isEmpty) {
      return _buildEmptyChartCard(
        "Animal Distribution",
        "No animal data available",
        theme,
      );
    }

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: theme.cardTheme.color ?? theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Animal Distribution",
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 200,
            child: PieChart(
              PieChartData(
                sectionsSpace: 0,
                centerSpaceRadius: 40,
                sections: validData.entries.map((entry) {
                  final color = _getColorForAnimal(entry.key);
                  return PieChartSectionData(
                    color: color,
                    value: entry.value,
                    title: '${entry.value.toInt()}',
                    radius: 50,
                    titleStyle: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  );
                }).toList(),
              ),
            ),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 16,
            runSpacing: 8,
            children: validData.keys.map((key) {
              return Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _getColorForAnimal(key),
                    ),
                  ),
                  const SizedBox(width: 4),
                  Text(key, style: theme.textTheme.bodyMedium),
                ],
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Color _getColorForAnimal(String animal) {
    switch (animal) {
      case "Cows":
        return Colors.brown;
      case "Sheep":
        return Colors.grey;
      case "Chickens":
        return Colors.orange;
      case "Goats":
        return Colors.amber;
      default:
        return Colors.blue;
    }
  }

  Widget _buildProductionOverview(
    List<ProductionStat> production,
    ThemeData theme,
  ) {
    if (production.isEmpty) {
      return _buildEmptyChartCard(
        "Production Overview",
        "No production data available",
        theme,
      );
    }

    return Column(
      children: production.map((stat) {
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: theme.cardTheme.color ?? theme.colorScheme.surface,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: theme.colorScheme.primary.withOpacity(0.1),
                  shape: BoxShape.circle,
                ),
                child: Icon(Icons.eco, color: theme.colorScheme.primary),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      stat.productType,
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text('Total Production', style: theme.textTheme.bodySmall),
                  ],
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '${stat.totalQuantity}',
                    style: theme.textTheme.titleLarge?.copyWith(
                      fontWeight: FontWeight.bold,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                  Text(stat.unit, style: theme.textTheme.bodyMedium),
                ],
              ),
            ],
          ),
        );
      }).toList(),
    );
  }

  Widget _buildEmptyChartCard(String title, String message, ThemeData theme) {
    return Container(
      padding: const EdgeInsets.all(16),
      width: double.infinity,
      decoration: BoxDecoration(
        color: theme.cardTheme.color ?? theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          Center(child: Text(message, style: theme.textTheme.bodyMedium)),
        ],
      ),
    );
  }
}
