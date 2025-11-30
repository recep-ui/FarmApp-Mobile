const jwt = require('jsonwebtoken');

// JWT token doğrulama middleware'i
const authMiddleware = async (req, res, next) => {
    try {
        // Header'dan token al
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Yetkilendirme token\'ı bulunamadı'
            });
        }

        // Bearer kelimesini çıkar, sadece token'ı al
        const token = authHeader.split(' ')[1];

        // Token'ı doğrula
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Kullanıcı bilgisini request'e ekle
        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token süresi dolmuş'
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Sunucu hatası (Auth)',
            error: error.message,
            stack: error.stack
        });
    }
};

// Admin yetkisi kontrolü
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Bu işlem için admin yetkisi gerekli'
        });
    }
    next();
};

module.exports = { authMiddleware, adminMiddleware };
