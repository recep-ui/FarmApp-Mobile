const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const animalController = require('../controllers/animalController');
const { authMiddleware } = require('../middleware/auth');

// Tüm route'lar korumalı (JWT gerekli)
router.use(authMiddleware);

// Tüm hayvanları listele
router.get('/', animalController.getAllAnimals);

// Hayvan istatistikleri
router.get('/stats', animalController.getAnimalStats);

// ID'ye göre hayvan getir
router.get('/:id', animalController.getAnimalById);

// Yeni hayvan ekle
router.post('/', [
    body('species').notEmpty().withMessage('Hayvan türü gerekli'),
    body('tag_number').optional().trim(),
    body('birth_date').optional().isISO8601().withMessage('Geçerli bir tarih girin')
], animalController.createAnimal);

// Hayvan güncelle
router.put('/:id', animalController.updateAnimal);

// Hayvan sil
router.delete('/:id', animalController.deleteAnimal);

module.exports = router;
