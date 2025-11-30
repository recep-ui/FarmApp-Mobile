const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const { body } = require('express-validator');

// Tüm route'lar sadece admin için
router.use(authMiddleware, adminMiddleware);

// Sistem istatistikleri
router.get('/stats', userController.getSystemStats);

// Aktivite logları
router.get('/activity-logs', userController.getActivityLogs);

// Kullanıcı listesi
router.get('/', userController.getAllUsers);

// Kullanıcı detayı
router.get('/:id', userController.getUserById);

// Kullanıcı güncelle
router.put('/:id', [
    body('username').optional().trim().isLength({ min: 3 }).withMessage('Kullanıcı adı en az 3 karakter olmalı'),
    body('email').optional().isEmail().withMessage('Geçerli bir email adresi giriniz'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Geçersiz rol'),
    body('is_active').optional().isBoolean().withMessage('Durum boolean olmalı')
], userController.updateUser);

// Kullanıcı şifre sıfırlama
router.post('/:id/reset-password', [
    body('new_password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı')
], userController.resetUserPassword);

// Kullanıcı durumu değiştir (aktif/pasif)
router.patch('/:id/toggle-status', userController.toggleUserStatus);

// Kullanıcı sil
router.delete('/:id', userController.deleteUser);

module.exports = router;
