import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/production_record.dart';
import '../../models/animal.dart';
import '../../services/production_service.dart';
import '../../services/animal_service.dart';
import '../../constants/app_colors.dart';

class ProductionFormScreen extends StatefulWidget {
  final ProductionRecord? record;

  const ProductionFormScreen({super.key, this.record});

  @override
  State<ProductionFormScreen> createState() => _ProductionFormScreenState();
}

class _ProductionFormScreenState extends State<ProductionFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _productionService = ProductionService();
  final _animalService = AnimalService();

  bool _isLoading = false;
  List<Animal> _animals = [];
  int? _selectedAnimalId;

  late TextEditingController _dateController;
  late TextEditingController _productTypeController;
  late TextEditingController _quantityController;
  late TextEditingController _unitController;
  late TextEditingController _qualityController;
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
    _productTypeController = TextEditingController(
      text: widget.record?.productType ?? 'Milk',
    );
    _quantityController = TextEditingController(
      text: widget.record?.quantity.toString() ?? '',
    );
    _unitController = TextEditingController(
      text: widget.record?.unit ?? 'Liters',
    );
    _qualityController = TextEditingController(
      text: widget.record?.quality ?? '',
    );
    _notesController = TextEditingController(text: widget.record?.notes ?? '');

    if (widget.record != null) {
      _selectedAnimalId = widget.record!.animalId;
    }
  }

  Future<void> _loadAnimals() async {
    final animals = await _animalService.getAnimals();
    setState(() {
      _animals = animals;
      // If editing and animal not in list (unlikely but possible), handle it?
      // For now assume animal exists.
    });
  }

  @override
  void dispose() {
    _dateController.dispose();
    _productTypeController.dispose();
    _quantityController.dispose();
    _unitController.dispose();
    _qualityController.dispose();
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
      'product_type': _productTypeController.text,
      'quantity': double.tryParse(_quantityController.text) ?? 0,
      'unit': _unitController.text,
      'quality': _qualityController.text,
      'notes': _notesController.text,
    };

    bool success;
    if (widget.record != null) {
      success = await _productionService.updateProductionRecord(
        widget.record!.id,
        recordData,
      );
    } else {
      success = await _productionService.createProductionRecord(recordData);
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
          widget.record != null ? 'Edit Production' : 'Add Production',
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
                controller: _productTypeController,
                decoration: const InputDecoration(
                  labelText: 'Product Type (e.g. Milk, Egg)',
                  border: OutlineInputBorder(),
                ),
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: TextFormField(
                      controller: _quantityController,
                      decoration: const InputDecoration(
                        labelText: 'Quantity',
                        border: OutlineInputBorder(),
                      ),
                      keyboardType: TextInputType.number,
                      validator: (value) {
                        if (value == null || value.isEmpty) return 'Required';
                        if (double.tryParse(value) == null)
                          return 'Invalid number';
                        return null;
                      },
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    flex: 1,
                    child: TextFormField(
                      controller: _unitController,
                      decoration: const InputDecoration(
                        labelText: 'Unit',
                        border: OutlineInputBorder(),
                      ),
                      validator: (value) => value!.isEmpty ? 'Required' : null,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _qualityController,
                decoration: const InputDecoration(
                  labelText: 'Quality (Optional)',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _notesController,
                decoration: const InputDecoration(
                  labelText: 'Notes (Optional)',
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
