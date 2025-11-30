class Animal {
  final int id;
  final String species;
  final String breed;
  final String birthDate;
  final String gender;
  final String tagNumber;
  final int? barnId;
  final String? barnName;
  final String status;
  final double totalProduction;

  Animal({
    required this.id,
    required this.species,
    required this.breed,
    required this.birthDate,
    required this.gender,
    required this.tagNumber,
    this.barnId,
    this.barnName,
    required this.status,
    required this.totalProduction,
  });

  factory Animal.fromJson(Map<String, dynamic> json) {
    return Animal(
      id: json['animal_id'] ?? 0,
      species: json['species'] ?? '',
      breed: json['breed'] ?? '',
      birthDate: json['birth_date'] ?? '',
      gender: json['gender'] ?? '',
      tagNumber: json['tag_number'] ?? '',
      barnId: json['barn_id'],
      barnName: json['barn_name'],
      status: json['status'] ?? 'active',
      totalProduction:
          double.tryParse(json['total_production'].toString()) ?? 0.0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'animal_id': id,
      'species': species,
      'breed': breed,
      'birth_date': birthDate,
      'gender': gender,
      'tag_number': tagNumber,
      'barn_id': barnId,
      'status': status,
      'total_production': totalProduction,
    };
  }
}
