class Employee {
  final int id;
  final String firstName;
  final String lastName;
  final String? position;
  final String? contactInfo;
  final String? hireDate;
  final String status;

  Employee({
    required this.id,
    required this.firstName,
    required this.lastName,
    this.position,
    this.contactInfo,
    this.hireDate,
    required this.status,
  });

  factory Employee.fromJson(Map<String, dynamic> json) {
    return Employee(
      id: json['employee_id'] ?? 0,
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'] ?? '',
      position: json['position'],
      contactInfo: json['contact_info'],
      hireDate: json['hire_date'],
      status: json['status'] ?? 'active',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'employee_id': id,
      'first_name': firstName,
      'last_name': lastName,
      'position': position,
      'contact_info': contactInfo,
      'hire_date': hireDate,
      'status': status,
    };
  }

  String get fullName => '$firstName $lastName';
}
