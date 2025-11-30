const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');

const { authMiddleware } = require('../middleware/auth');

// Kayıt route'u
router.post('/register', [
    body('username').trim().isLength({ min: 3 }).withMessage('Kullanıcı adı en az 3 karakter olmalı'),
    body('email').isEmail().withMessage('Geçerli bir email adresi girin'),
    body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı'),
    body('first_name').optional().trim(),
    body('last_name').optional().trim(),
    body('role').optional().isIn(['user', 'admin']).withMessage('Geçersiz rol')
], authController.register);

// Giriş route'u
router.post('/login', [
    body('username').trim().notEmpty().withMessage('Kullanıcı adı gerekli'),
    body('password').notEmpty().withMessage('Şifre gerekli')
], authController.login);

// Kullanıcı profili (korumalı route)
router.get('/profile', authMiddleware, authController.getProfile);

// Şifre değiştir (korumalı route)
router.put('/change-password', [
    authMiddleware,
    body('currentPassword').notEmpty().withMessage('Mevcut şifre gerekli'),
    body('newPassword').isLength({ min: 6 }).withMessage('Yeni şifre en az 6 karakter olmalı')
], authController.changePassword);



module.exports = router;
