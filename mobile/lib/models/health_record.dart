class HealthRecord {
  final int id;
  final int animalId;
  final String? animalTag;
  final String? animalSpecies;
  final String date;
  final String? diagnosis;
  final String? treatmentApplied;
  final String? medications;
  final String? veterinarianInfo;
  final String? notes;

  HealthRecord({
    required this.id,
    required this.animalId,
    this.animalTag,
    this.animalSpecies,
    required this.date,
    this.diagnosis,
    this.treatmentApplied,
    this.medications,
    this.veterinarianInfo,
    this.notes,
  });

  factory HealthRecord.fromJson(Map<String, dynamic> json) {
    return HealthRecord(
      id: json['health_record_id'] ?? 0,
      animalId: json['animal_id'] ?? 0,
      animalTag: json['tag_number'],
      animalSpecies: json['species'],
      date: json['date'] ?? '',
      diagnosis: json['diagnosis'],
      treatmentApplied: json['treatment_applied'],
      medications: json['medications'],
      veterinarianInfo: json['veterinarian_info'],
      notes: json['notes'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'health_record_id': id,
      'animal_id': animalId,
      'date': date,
      'diagnosis': diagnosis,
      'treatment_applied': treatmentApplied,
      'medications': medications,
      'veterinarian_info': veterinarianInfo,
      'notes': notes,
    };
  }
}
