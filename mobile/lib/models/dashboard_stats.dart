class DashboardStats {
  final AnimalStats animals;
  final TaskStats tasks;
  final List<ProductionStat> production;

  DashboardStats({
    required this.animals,
    required this.tasks,
    required this.production,
  });

  factory DashboardStats.fromJson(Map<String, dynamic> json) {
    return DashboardStats(
      animals: AnimalStats.fromJson(json['animals'] ?? {}),
      tasks: TaskStats.fromJson(json['tasks'] ?? {}),
      production: (json['production'] as List? ?? [])
          .map((e) => ProductionStat.fromJson(e))
          .toList(),
    );
  }
}

class AnimalStats {
  final int totalAnimals;
  final int totalCows;
  final int totalSheep;
  final int totalChickens;
  final int totalGoats;
  final int activeAnimals;

  AnimalStats({
    required this.totalAnimals,
    required this.totalCows,
    required this.totalSheep,
    required this.totalChickens,
    required this.totalGoats,
    required this.activeAnimals,
  });

  factory AnimalStats.fromJson(Map<String, dynamic> json) {
    return AnimalStats(
      totalAnimals: json['total_animals'] ?? 0,
      totalCows: json['total_cows'] ?? 0,
      totalSheep: json['total_sheep'] ?? 0,
      totalChickens: json['total_chickens'] ?? 0,
      totalGoats: json['total_goats'] ?? 0,
      activeAnimals: json['active_animals'] ?? 0,
    );
  }
}

class TaskStats {
  final int totalTasks;
  final int pendingTasks;
  final int inProgressTasks;
  final int completedTasks;
  final int overdueTasks;

  TaskStats({
    required this.totalTasks,
    required this.pendingTasks,
    required this.inProgressTasks,
    required this.completedTasks,
    required this.overdueTasks,
  });

  factory TaskStats.fromJson(Map<String, dynamic> json) {
    return TaskStats(
      totalTasks: json['total_tasks'] ?? 0,
      pendingTasks: json['pending_tasks'] ?? 0,
      inProgressTasks: json['in_progress_tasks'] ?? 0,
      completedTasks: json['completed_tasks'] ?? 0,
      overdueTasks: json['overdue_tasks'] ?? 0,
    );
  }
}

class ProductionStat {
  final String productType;
  final double totalQuantity;
  final double avgQuantity;
  final int recordCount;
  final String unit;

  ProductionStat({
    required this.productType,
    required this.totalQuantity,
    required this.avgQuantity,
    required this.recordCount,
    required this.unit,
  });

  factory ProductionStat.fromJson(Map<String, dynamic> json) {
    return ProductionStat(
      productType: json['product_type'] ?? '',
      totalQuantity: double.tryParse(json['total_quantity'].toString()) ?? 0.0,
      avgQuantity: double.tryParse(json['avg_quantity'].toString()) ?? 0.0,
      recordCount: int.tryParse(json['record_count'].toString()) ?? 0,
      unit: json['unit'] ?? '',
    );
  }
}
