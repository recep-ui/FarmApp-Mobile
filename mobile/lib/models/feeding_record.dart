class FeedingRecord {
  final int id;
  final int animalId;
  final String? animalTag;
  final String? animalSpecies;
  final String date;
  final String feedType;
  final double quantity;
  final String unit;
  final String? notes;

  FeedingRecord({
    required this.id,
    required this.animalId,
    this.animalTag,
    this.animalSpecies,
    required this.date,
    required this.feedType,
    required this.quantity,
    required this.unit,
    this.notes,
  });

  factory FeedingRecord.fromJson(Map<String, dynamic> json) {
    return FeedingRecord(
      id: json['feeding_record_id'] ?? 0,
      animalId: json['animal_id'] ?? 0,
      animalTag: json['tag_number'],
      animalSpecies: json['species'],
      date: json['date'] ?? '',
      feedType: json['feed_type'] ?? '',
      quantity: double.tryParse(json['quantity']?.toString() ?? '') ?? 0.0,
      unit: json['unit'] ?? '',
      notes: json['notes'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'feeding_record_id': id,
      'animal_id': animalId,
      'date': date,
      'feed_type': feedType,
      'quantity': quantity,
      'unit': unit,
      'notes': notes,
    };
  }
}
