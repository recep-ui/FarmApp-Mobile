class ProductionRecord {
  final int id;
  final int animalId;
  final String? animalTag;
  final String? animalSpecies;
  final String date;
  final String productType;
  final double quantity;
  final String unit;
  final String? quality;
  final String? notes;

  ProductionRecord({
    required this.id,
    required this.animalId,
    this.animalTag,
    this.animalSpecies,
    required this.date,
    required this.productType,
    required this.quantity,
    required this.unit,
    this.quality,
    this.notes,
  });

  factory ProductionRecord.fromJson(Map<String, dynamic> json) {
    return ProductionRecord(
      id: json['production_record_id'] ?? 0,
      animalId: json['animal_id'] ?? 0,
      animalTag: json['tag_number'],
      animalSpecies: json['species'],
      date: json['date'] ?? '',
      productType: json['product_type'] ?? '',
      quantity: double.tryParse(json['quantity']?.toString() ?? '') ?? 0.0,
      unit: json['unit'] ?? '',
      quality: json['quality'],
      notes: json['notes'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'production_record_id': id,
      'animal_id': animalId,
      'date': date,
      'product_type': productType,
      'quantity': quantity,
      'unit': unit,
      'quality': quality,
      'notes': notes,
    };
  }
}
