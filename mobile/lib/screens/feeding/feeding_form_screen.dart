import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/feeding_record.dart';
import '../../models/animal.dart';
import '../../services/feeding_service.dart';
import '../../services/animal_service.dart';
import '../../constants/app_colors.dart';

class FeedingFormScreen extends StatefulWidget {
  final FeedingRecord? record;

  const FeedingFormScreen({super.key, this.record});

  @override
  State<FeedingFormScreen> createState() => _FeedingFormScreenState();
}

class _FeedingFormScreenState extends State<FeedingFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _feedingService = FeedingService();
  final _animalService = AnimalService();

  bool _isLoading = false;
  List<Animal> _animals = [];
  int? _selectedAnimalId;

  late TextEditingController _dateController;
  late TextEditingController _feedTypeController;
  late TextEditingController _quantityController;
  late TextEditingController _unitController;
  late TextEditingController _notesController;

  @override
  void initState() {
    super.initState();
    _loadAnimals();

    _dateController = TextEditingController(
      text: widget.record?.date != null
          ? widget.record!.date.split('T')[0]
          : DateFormat('yyyy-MM-dd').format(DateTime.now()),
    );
    _feedTypeController = TextEditingController(
      text: widget.record?.feedType ?? '',
    );
    _quantityController = TextEditingController(
      text: widget.record?.quantity.toString() ?? '',
    );
    _unitController = TextEditingController(text: widget.record?.unit ?? '');
    _notesController = TextEditingController(text: widget.record?.notes ?? '');

    if (widget.record != null) {
      _selectedAnimalId = widget.record!.animalId;
    }
  }

  Future<void> _loadAnimals() async {
    final animals = await _animalService.getAnimals();
    setState(() {
      _animals = animals;
    });
  }

  @override
  void dispose() {
    _dateController.dispose();
    _feedTypeController.dispose();
    _quantityController.dispose();
    _unitController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _selectDate() async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2000),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      setState(() {
        _dateController.text = DateFormat('yyyy-MM-dd').format(picked);
      });
    }
  }

  Future<void> _saveRecord() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedAnimalId == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Please select an animal')));
      return;
    }

    setState(() => _isLoading = true);

    final recordData = {
      'animal_id': _selectedAnimalId,
      'date': _dateController.text,
      'feed_type': _feedTypeController.text,
      'quantity': double.tryParse(_quantityController.text) ?? 0,
      'unit': _unitController.text,
      'notes': _notesController.text,
    };

    bool success;
    if (widget.record != null) {
      success = await _feedingService.updateFeedingRecord(
        widget.record!.id,
        recordData,
      );
    } else {
      success = await _feedingService.createFeedingRecord(recordData);
    }

    setState(() => _isLoading = false);

    if (success && mounted) {
      Navigator.pop(context, true);
    } else if (mounted) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Failed to save record')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.record != null ? 'Edit Feeding Record' : 'Add Feeding Record',
        ),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              DropdownButtonFormField<int>(
                value: _selectedAnimalId,
                decoration: const InputDecoration(
                  labelText: 'Animal',
                  border: OutlineInputBorder(),
                ),
                items: _animals.map((animal) {
                  return DropdownMenuItem<int>(
                    value: animal.id,
                    child: Text('${animal.tagNumber} (${animal.species})'),
                  );
                }).toList(),
                onChanged: (val) => setState(() => _selectedAnimalId = val),
                validator: (val) => val == null ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _dateController,
                decoration: const InputDecoration(
                  labelText: 'Date',
                  border: OutlineInputBorder(),
                  suffixIcon: Icon(Icons.calendar_today),
                ),
                readOnly: true,
                onTap: _selectDate,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _feedTypeController,
                decoration: const InputDecoration(
                  labelText: 'Feed Type',
                  border: OutlineInputBorder(),
                ),
                validator: (val) => val!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      controller: _quantityController,
                      decoration: const InputDecoration(
                        labelText: 'Quantity',
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (val) => val!.isEmpty ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      controller: _unitController,
                      decoration: const InputDecoration(
                        labelText: 'Unit',
                        border: OutlineInputBorder(),
                      ),
                      validator: (val) => val!.isEmpty ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _notesController,
                decoration: const InputDecoration(
                  labelText: 'Notes',
                  border: OutlineInputBorder(),
                ),
                maxLines: 2,
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _saveRecord,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: Colors.white,
                  ),
                  child: _isLoading
                      ? const CircularProgressIndicator(color: Colors.white)
                      : const Text('SAVE'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
