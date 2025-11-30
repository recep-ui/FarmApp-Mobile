class Barn {
  final int id;
  final String name;
  final int capacity;
  final String? location;
  final int currentOccupancy;
  final int availableSpace;

  Barn({
    required this.id,
    required this.name,
    required this.capacity,
    this.location,
    this.currentOccupancy = 0,
    this.availableSpace = 0,
  });

  factory Barn.fromJson(Map<String, dynamic> json) {
    return Barn(
      id: json['barn_id'] ?? 0,
      name: json['name'] ?? '',
      capacity: json['capacity'] ?? 0,
      location: json['location'],
      currentOccupancy: json['current_occupancy'] ?? 0,
      availableSpace: json['available_space'] ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'barn_id': id,
      'name': name,
      'capacity': capacity,
      'location': location,
      'current_occupancy': currentOccupancy,
      'available_space': availableSpace,
    };
  }
}
