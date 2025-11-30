class Task {
  final int id;
  final String title;
  final String description;
  final int? assignedEmployeeId;
  final String? employeeName;
  final String? dueDate;
  final String status;
  final String priority;

  Task({
    required this.id,
    required this.title,
    required this.description,
    this.assignedEmployeeId,
    this.employeeName,
    this.dueDate,
    required this.status,
    required this.priority,
  });

  factory Task.fromJson(Map<String, dynamic> json) {
    return Task(
      id: json['task_id'] ?? 0,
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      assignedEmployeeId: json['assigned_employee_id'],
      employeeName: json['employee_name'],
      dueDate: json['due_date'],
      status: json['status'] ?? 'pending',
      priority: json['priority'] ?? 'medium',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'task_id': id,
      'title': title,
      'description': description,
      'assigned_employee_id': assignedEmployeeId,
      'due_date': dueDate,
      'status': status,
      'priority': priority,
    };
  }
}
