import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../../models/animal.dart';
import '../../services/animal_service.dart';
import '../../constants/app_colors.dart';

class AnimalFormScreen extends StatefulWidget {
  final Animal? animal;

  const AnimalFormScreen({super.key, this.animal});

  @override
  State<AnimalFormScreen> createState() => _AnimalFormScreenState();
}

class _AnimalFormScreenState extends State<AnimalFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _animalService = AnimalService();
  bool _isLoading = false;

  late TextEditingController _tagNumberController;
  late TextEditingController _speciesController;
  late TextEditingController _breedController;
  late TextEditingController _birthDateController;
  String _gender = 'Female';
  String _status = 'active';

  @override
  void initState() {
    super.initState();
    _tagNumberController = TextEditingController(
      text: widget.animal?.tagNumber ?? '',
    );
    _speciesController = TextEditingController(
      text: widget.animal?.species ?? '',
    );
    _breedController = TextEditingController(text: widget.animal?.breed ?? '');
    _birthDateController = TextEditingController(
      text: widget.animal?.birthDate != null
          ? widget.animal!.birthDate.split('T')[0]
          : DateFormat('yyyy-MM-dd').format(DateTime.now()),
    );
    _gender = widget.animal?.gender ?? 'Female';
    _status = widget.animal?.status ?? 'active';
  }

  @override
  void dispose() {
    _tagNumberController.dispose();
    _speciesController.dispose();
    _breedController.dispose();
    _birthDateController.dispose();
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
        _birthDateController.text = DateFormat('yyyy-MM-dd').format(picked);
      });
    }
  }

  Future<void> _saveAnimal() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final animalData = {
      'tag_number': _tagNumberController.text,
      'species': _speciesController.text,
      'breed': _breedController.text,
      'birth_date': _birthDateController.text,
      'gender': _gender,
      'status': _status,
      // 'barn_id': null, // TODO: Implement Barn selection
    };

    bool success;
    if (widget.animal != null) {
      success = await _animalService.updateAnimal(
        widget.animal!.id,
        animalData,
      );
    } else {
      success = await _animalService.createAnimal(animalData);
    }

    setState(() => _isLoading = false);

    if (success && mounted) {
      Navigator.pop(context, true);
    } else if (mounted) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Failed to save animal')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.animal != null ? 'Edit Animal' : 'Add Animal'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                controller: _tagNumberController,
                decoration: const InputDecoration(
                  labelText: 'Tag Number',
                  border: OutlineInputBorder(),
                ),
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _speciesController,
                decoration: const InputDecoration(
                  labelText: 'Species (e.g. Cow, Sheep)',
                  border: OutlineInputBorder(),
                ),
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _breedController,
                decoration: const InputDecoration(
                  labelText: 'Breed',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _birthDateController,
                decoration: const InputDecoration(
                  labelText: 'Birth Date',
                  border: OutlineInputBorder(),
                  suffixIcon: Icon(Icons.calendar_today),
                ),
                readOnly: true,
                onTap: _selectDate,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _gender,
                decoration: const InputDecoration(
                  labelText: 'Gender',
                  border: OutlineInputBorder(),
                ),
                items: ['Female', 'Male']
                    .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                    .toList(),
                onChanged: (val) => setState(() => _gender = val!),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _status,
                decoration: const InputDecoration(
                  labelText: 'Status',
                  border: OutlineInputBorder(),
                ),
                items: ['active', 'sold', 'deceased', 'sick']
                    .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                    .toList(),
                onChanged: (val) => setState(() => _status = val!),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _saveAnimal,
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
