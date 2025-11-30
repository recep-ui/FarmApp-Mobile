const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Ortam değişkenlerini yükle
dotenv.config();

// Express uygulamasını oluştur
const app = express();

// CORS için izin verilen origin'ler (environment'tan da alınabilir)
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://farmapp.site',
    'https://www.farmapp.site',
    'http://www.farmapp.site',
    'https://farmapp-frontend.onrender.com',
    'http://localhost:3000',  // geliştirirken React dev server
    'http://localhost:5173'   // Vite kullanıyorsan
].filter(Boolean); // undefined/null değerleri filtrele

// Middleware'ler
app.use(cors({
    origin: function (origin, callback) {
        // Postman gibi origin göndermeyen istekler için:
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // İzin verilmeyen origin
        console.log(`CORS blocked origin: ${origin}`);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route'ları import et
const authRoutes = require('./routes/auth');
const animalRoutes = require('./routes/animals');
const barnRoutes = require('./routes/barns');
const healthRecordRoutes = require('./routes/healthRecords');
const feedingRecordRoutes = require('./routes/feedingRecords');
const productionRecordRoutes = require('./routes/productionRecords');
const employeeRoutes = require('./routes/employees');
const taskRoutes = require('./routes/tasks');
const userRoutes = require('./routes/users');

// API Route'ları
app.use('/api/auth', authRoutes);
app.use('/api/animals', animalRoutes);
app.use('/api/barns', barnRoutes);
app.use('/api/health-records', healthRecordRoutes);
app.use('/api/feeding-records', feedingRecordRoutes);
app.use('/api/production-records', productionRecordRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', require('./routes/dashboard'));

// Health check endpoint (Render.com için)
app.get('/', (req, res) => {
    res.json({
        message: 'Farm Management System API',
        version: '1.0.0',
        status: 'running',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// API health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route bulunamadı'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Sunucu hatası',
        error: err.message,
        stack: err.stack
    });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`Server ${HOST}:${PORT} adresinde çalışıyor...`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(`Database: ${process.env.DATABASE_URL ? 'External Database' : 'Local Database'}`);
});

module.exports = app;
