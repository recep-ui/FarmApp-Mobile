const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Kullanıcı kaydı
exports.register = async (req, res) => {
    try {
        // Validasyon kontrolü
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { username, email, password, first_name, last_name, role } = req.body;

        // Email format kontrolü
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Geçerli bir email adresi girin'
            });
        }

        // Yasaklı domainler
        const blockedDomains = ['test.com', 'example.com', 'temp.com', 'fake.com', 'temporary.com'];
        const domain = email.split('@')[1];
        if (blockedDomains.includes(domain)) {
            return res.status(400).json({
                success: false,
                message: 'Bu email domaini kullanılamaz'
            });
        }

        // Username benzersizlik kontrolü
        const [existingUsername] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        if (existingUsername.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Bu kullanıcı adı zaten kullanılıyor'
            });
        }

        // Email benzersizlik kontrolü
        const [existingEmail] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (existingEmail.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Bu email zaten kullanılıyor'
            });
        }

        // Şifreyi hashle
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Kullanıcıyı veritabanına ekle (is_active = 0 olarak)
        const [result] = await db.query(
            'INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?, 0)',
            [username, email, password_hash, first_name, last_name, role || 'user']
        );

        res.status(201).json({
            success: true,
            message: 'Kayıt başarılı. Hesabınız yönetici onayı bekliyor.',
            data: {
                userId: result.insertId,
                username: username,
                email: email,
                role: role || 'user',
                isActive: false
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Kullanıcı girişi
exports.login = async (req, res) => {
    try {
        // Validasyon kontrolü
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { username, password } = req.body;

        console.log('Login attempt for username:', username);

        // Kullanıcıyı bul
        const [users] = await db.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, username]
        );

        console.log('Users found:', users.length);

        if (users.length === 0) {
            console.log('User not found:', username);
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı adı veya şifre hatalı'
            });
        }

        const user = users[0];

        console.log('User found:', user.username, 'Role:', user.role);

        // Şifreyi kontrol et
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({
                success: false,
                message: 'Kullanıcı adı veya şifre hatalı'
            });
        }

        // Hesap aktif mi kontrol et
        if (user.is_active === 0) {
            return res.status(403).json({
                success: false,
                message: 'Hesabınız henüz onaylanmadı. Lütfen yönetici onayı bekleyin.'
            });
        }

        // JWT token oluştur
        const token = jwt.sign(
            {
                userId: user.user_id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({
            success: true,
            message: 'Giriş başarılı',
            data: {
                userId: user.user_id,
                username: user.username,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                token: token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Kullanıcı bilgilerini getir (token ile)
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [users] = await db.query(
            'SELECT user_id, username, email, first_name, last_name, role, created_at FROM users WHERE user_id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        const user = users[0];

        res.json({
            success: true,
            data: {
                userId: user.user_id,
                username: user.username,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                createdAt: user.created_at
            }
        });

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Şifre değiştir
exports.changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        // Mevcut kullanıcıyı bul
        const [users] = await db.query(
            'SELECT * FROM users WHERE user_id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        const user = users[0];

        // Mevcut şifreyi kontrol et
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Mevcut şifre hatalı'
            });
        }

        // Yeni şifreyi hashle
        const saltRounds = 10;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Şifreyi güncelle
        await db.query(
            'UPDATE users SET password_hash = ? WHERE user_id = ?',
            [newPasswordHash, userId]
        );

        res.json({
            success: true,
            message: 'Şifre başarıyla değiştirildi'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};
