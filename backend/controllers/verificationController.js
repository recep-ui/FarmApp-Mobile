const db = require('../config/database');

// Email doğrulama kodu kontrolü
exports.verifyEmail = async (req, res) => {
    try {
        const { userId, verificationCode } = req.body;

        if (!userId || !verificationCode) {
            return res.status(400).json({
                success: false,
                message: 'Kullanıcı ID ve doğrulama kodu gerekli'
            });
        }

        // Kullanıcıyı bul
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

        // Zaten doğrulanmış mı?
        if (user.email_verified === 1) {
            return res.status(400).json({
                success: false,
                message: 'Email zaten doğrulanmış'
            });
        }

        // Token süresi dolmuş mu?
        if (new Date() > new Date(user.verification_token_expires)) {
            return res.status(400).json({
                success: false,
                message: 'Doğrulama kodu süresi dolmuş. Yeni kod talep edin.'
            });
        }

        // Kod eşleşiyor mu?
        if (user.verification_token !== verificationCode) {
            return res.status(400).json({
                success: false,
                message: 'Doğrulama kodu hatalı'
            });
        }

        // Email'i doğrula
        await db.query(
            'UPDATE users SET email_verified = 1, verification_token = NULL, verification_token_expires = NULL WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            message: 'Email başarıyla doğrulandı'
        });

    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Yeni doğrulama kodu gönder
exports.resendVerificationCode = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'Kullanıcı ID gerekli'
            });
        }

        // Kullanıcıyı bul
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

        // Zaten doğrulanmış mı?
        if (user.email_verified === 1) {
            return res.status(400).json({
                success: false,
                message: 'Email zaten doğrulanmış'
            });
        }

        // Yeni token oluştur
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 saat

        // Token'ı güncelle
        await db.query(
            'UPDATE users SET verification_token = ?, verification_token_expires = ? WHERE user_id = ?',
            [verificationToken, tokenExpires, userId]
        );

        res.json({
            success: true,
            message: 'Yeni doğrulama kodu gönderildi',
            data: {
                verificationToken: verificationToken // Gerçek uygulamada bunu email ile gönderin
            }
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

// Email doğrulama durumunu kontrol et
exports.checkVerificationStatus = async (req, res) => {
    try {
        const { userId } = req.params;

        const [users] = await db.query(
            'SELECT email_verified FROM users WHERE user_id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        res.json({
            success: true,
            data: {
                emailVerified: users[0].email_verified === 1
            }
        });

    } catch (error) {
        console.error('Check verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};
