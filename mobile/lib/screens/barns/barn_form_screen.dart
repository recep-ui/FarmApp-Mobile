import 'package:flutter/material.dart';
import '../../models/barn.dart';
import '../../services/barn_service.dart';
import '../../constants/app_colors.dart';

class BarnFormScreen extends StatefulWidget {
  final Barn? barn;

  const BarnFormScreen({super.key, this.barn});

  @override
  State<BarnFormScreen> createState() => _BarnFormScreenState();
}

class _BarnFormScreenState extends State<BarnFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _barnService = BarnService();
  bool _isLoading = false;

  late TextEditingController _nameController;
  late TextEditingController _capacityController;
  late TextEditingController _locationController;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(text: widget.barn?.name ?? '');
    _capacityController = TextEditingController(
      text: widget.barn?.capacity.toString() ?? '',
    );
    _locationController = TextEditingController(
      text: widget.barn?.location ?? '',
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _capacityController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _saveBarn() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final barnData = {
      'name': _nameController.text,
      'capacity': int.tryParse(_capacityController.text) ?? 0,
      'location': _locationController.text,
    };

    bool success;
    if (widget.barn != null) {
      success = await _barnService.updateBarn(widget.barn!.id, barnData);
    } else {
      success = await _barnService.createBarn(barnData);
    }

    setState(() => _isLoading = false);

    if (success && mounted) {
      Navigator.pop(context, true);
    } else if (mounted) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Failed to save barn')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.barn != null ? 'Edit Barn' : 'Add Barn'),
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
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Barn Name',
                  border: OutlineInputBorder(),
                ),
                validator: (value) => value!.isEmpty ? 'Required' : null,
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _capacityController,
                decoration: const InputDecoration(
                  labelText: 'Capacity',
                  border: OutlineInputBorder(),
                ),
                keyboardType: TextInputType.number,
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Required';
                  if (int.tryParse(value) == null) return 'Invalid number';
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(
                  labelText: 'Location (Optional)',
                  border: OutlineInputBorder(),
                ),
              ),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _saveBarn,
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
