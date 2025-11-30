const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const barnController = require('../controllers/barnController');
const { authMiddleware } = require('../middleware/auth');

// Tüm route'lar korumalı (JWT gerekli)
router.use(authMiddleware);

// Tüm ahırları listele
router.get('/', barnController.getAllBarns);

// ID'ye göre ahır getir
router.get('/:id', barnController.getBarnById);

// Yeni ahır ekle
router.post('/', [
    body('name').notEmpty().withMessage('Ahır adı gerekli'),
    body('capacity').isInt({ min: 1 }).withMessage('Kapasite en az 1 olmalı'),
    body('location').optional().trim()
], barnController.createBarn);

// Ahır güncelle
router.put('/:id', barnController.updateBarn);

// Ahır sil
router.delete('/:id', barnController.deleteBarn);

module.exports = router;
