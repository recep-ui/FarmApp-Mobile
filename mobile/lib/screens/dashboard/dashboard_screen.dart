import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../services/auth_service.dart';
import '../../services/dashboard_service.dart';
import '../../models/dashboard_stats.dart';
import '../../widgets/app_drawer.dart';
import '../../widgets/background_animation.dart';
import '../../constants/app_colors.dart';

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
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('Dashboard', style: TextStyle(color: Colors.white)),
        backgroundColor: Colors.black.withOpacity(0.3),
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        flexibleSpace: ClipRect(
          child: BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
            child: Container(color: Colors.transparent),
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.white),
            onPressed: _refreshStats,
          ),
        ],
      ),
      drawer: const AppDrawer(),
      body: BackgroundAnimation(
        child: SafeArea(
          child: RefreshIndicator(
            onRefresh: _refreshStats,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              physics: const AlwaysScrollableScrollPhysics(),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildGlassContainer(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Welcome back,',
                          style: theme.textTheme.titleMedium?.copyWith(
                            color: Colors.white70,
                          ),
                        ),
                        Text(
                          '${user?.firstName ?? "User"}!',
                          style: theme.textTheme.headlineMedium?.copyWith(
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  FutureBuilder<DashboardStats?>(
                    future: _statsFuture,
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const Center(
                          child: CircularProgressIndicator(color: Colors.white),
                        );
                      } else if (snapshot.hasError) {
                        return _buildGlassContainer(
                          child: Center(
                            child: Text(
                              'Error loading stats',
                              style: TextStyle(color: theme.colorScheme.error),
                            ),
                          ),
                        );
                      } else if (!snapshot.hasData || snapshot.data == null) {
                        return _buildGlassContainer(
                          child: const Center(
                            child: Text(
                              'No data available',
                              style: TextStyle(color: Colors.white),
                            ),
                          ),
                        );
                      }

                      final stats = snapshot.data!;
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _buildSummaryCards(stats),
                          const SizedBox(height: 20),
                          _buildAnimalDistributionChart(stats.animals, theme),
                          const SizedBox(height: 20),
                          _buildTaskStatusChart(stats.tasks, theme),
                          const SizedBox(height: 20),
                          Text(
                            "Production Overview",
                            style: theme.textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              shadows: [
                                Shadow(
                                  blurRadius: 2,
                                  color: Colors.black.withOpacity(0.5),
                                  offset: const Offset(1, 1),
                                ),
                              ],
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
        ),
      ),
    );
  }

  Widget _buildGlassContainer({
    required Widget child,
    EdgeInsetsGeometry? padding,
  }) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: padding ?? const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.black.withOpacity(0.4), // Dark Glass
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.2),
                blurRadius: 10,
                spreadRadius: 2,
              ),
            ],
          ),
          child: child,
        ),
      ),
    );
  }

  Widget _buildSummaryCards(DashboardStats stats) {
    return Row(
      children: [
        Expanded(
          child: _buildSummaryItem(
            'Animals',
            stats.animals.totalAnimals.toString(),
            Icons.pets,
            Colors.lightBlueAccent,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _buildSummaryItem(
            'Pending Tasks',
            stats.tasks.pendingTasks.toString(),
            Icons.assignment,
            Colors.orangeAccent,
            isWarning: stats.tasks.pendingTasks > 0,
          ),
        ),
      ],
    );
  }

  Widget _buildSummaryItem(
    String title,
    String value,
    IconData icon,
    Color color, {
    bool isWarning = false,
  }) {
    return _buildGlassContainer(
      child: Column(
        children: [
          Icon(icon, color: color, size: 30),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: isWarning ? Colors.orangeAccent : Colors.white,
            ),
          ),
          Text(
            title,
            style: const TextStyle(fontSize: 12, color: Colors.white70),
            textAlign: TextAlign.center,
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
      return _buildGlassContainer(
        child: const Center(
          child: Text("No animal data", style: TextStyle(color: Colors.white)),
        ),
      );
    }

    return _buildGlassContainer(
      child: Column(
        children: [
          Text(
            "Animal Distribution",
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 200,
            child: PieChart(
              PieChartData(
                sectionsSpace: 2,
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
            alignment: WrapAlignment.center,
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
                  Text(
                    key,
                    style: const TextStyle(fontSize: 12, color: Colors.white),
                  ),
                ],
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildTaskStatusChart(TaskStats stats, ThemeData theme) {
    final Map<String, double> dataMap = {
      "Pending": stats.pendingTasks.toDouble(),
      "In Progress": stats.inProgressTasks.toDouble(),
      "Completed": stats.completedTasks.toDouble(),
      "Overdue": stats.overdueTasks.toDouble(),
    };

    final validData = Map.fromEntries(
      dataMap.entries.where((e) => e.value > 0),
    );

    if (validData.isEmpty) {
      return const SizedBox.shrink(); // Don't show if empty
    }

    return _buildGlassContainer(
      child: Column(
        children: [
          Text(
            "Task Status",
            style: theme.textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 200,
            child: PieChart(
              PieChartData(
                sectionsSpace: 2,
                centerSpaceRadius: 40,
                sections: validData.entries.map((entry) {
                  final color = _getColorForTaskStatus(entry.key);
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
            alignment: WrapAlignment.center,
            children: validData.keys.map((key) {
              return Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    width: 12,
                    height: 12,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _getColorForTaskStatus(key),
                    ),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    key,
                    style: const TextStyle(fontSize: 12, color: Colors.white),
                  ),
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
        return Colors.brown[400]!;
      case "Sheep":
        return Colors.grey;
      case "Chickens":
        return Colors.orangeAccent;
      case "Goats":
        return Colors.amber;
      default:
        return Colors.blue;
    }
  }

  Color _getColorForTaskStatus(String status) {
    switch (status) {
      case "Pending":
        return Colors.orangeAccent;
      case "In Progress":
        return Colors.lightBlueAccent;
      case "Completed":
        return Colors.greenAccent;
      case "Overdue":
        return Colors.redAccent;
      default:
        return Colors.grey;
    }
  }

  Widget _buildProductionOverview(
    List<ProductionStat> production,
    ThemeData theme,
  ) {
    if (production.isEmpty) {
      return _buildGlassContainer(
        child: const Center(
          child: Text(
            "No production data",
            style: TextStyle(color: Colors.white),
          ),
        ),
      );
    }

    return Column(
      children: production.map((stat) {
        return Padding(
          padding: const EdgeInsets.only(bottom: 12.0),
          child: _buildGlassContainer(
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Text(
                    _getProductIcon(stat.productType),
                    style: const TextStyle(fontSize: 24),
                  ),
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
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Total: ${stat.totalQuantity} ${stat.unit}',
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        'Avg: ${stat.avgQuantity.toStringAsFixed(1)} | Records: ${stat.recordCount}',
                        style: const TextStyle(
                          fontSize: 12,
                          color: Colors.white70,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  String _getProductIcon(String type) {
    switch (type) {
      case 'Milk':
        return '🥛';
      case 'Egg':
        return '🥚';
      case 'Wool':
        return '🧶';
      case 'Meat':
        return '🥩';
      case 'Honey':
        return '🍯';
      default:
        return '📦';
    }
  }
}
