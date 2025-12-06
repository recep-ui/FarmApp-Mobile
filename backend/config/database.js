const mysql = require('mysql2');
require('dotenv').config();

// MySQL bağlantı havuzu oluştur
// Render.com, files.io veya diğer harici veritabanları için DATABASE_URL desteği
let poolConfig;

if (process.env.DATABASE_URL) {
    // DATABASE_URL formatı: mysql://user:password@host:port/database
    // Files.io, Render.com veya diğer cloud platformlar için
    try {
        const dbUrl = new URL(process.env.DATABASE_URL);
        poolConfig = {
            host: dbUrl.hostname,
            user: dbUrl.username,
            password: decodeURIComponent(dbUrl.password),
            database: dbUrl.pathname.slice(1),
            port: parseInt(dbUrl.port) || 3306,
            waitForConnections: true,
            connectionLimit: 3, // Reduced to prevent 'max_user_connections' error (limit is usually 5 on free tier)
            queueLimit: 0,
            connectTimeout: 60000,
            ssl: process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production' ? {
                rejectUnauthorized: false
            } : false,
            enableKeepAlive: true,
            keepAliveInitialDelay: 0
        };
        console.log(`Harici veritabanına bağlanılıyor: ${dbUrl.hostname}:${poolConfig.port}`);
    } catch (error) {
        console.error('DATABASE_URL parse hatası:', error.message);
        throw error;
    }
} else if (process.env.DB_HOST && process.env.DB_HOST.includes('filess.io')) {
    // FILES.IO için özel yapılandırma (max_user_connections=5 limiti için optimize)
    poolConfig = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT) || 61002,
        waitForConnections: true,
        connectionLimit: 2,  // FILES.IO limiti 5, güvenli için 2
        maxIdle: 3,  // Maximum idle connections
        idleTimeout: 30000,  // 30 saniye sonra idle bağlantıları kapat
        queueLimit: 0,
        connectTimeout: 30000,  // 30 saniye timeout
        acquireTimeout: 30000,  // Bağlantı alma timeout
        timeout: 30000,  // Query timeout
        ssl: {
            rejectUnauthorized: false
        },
        enableKeepAlive: true,
        keepAliveInitialDelay: 0
    };
    console.log(`FILES.IO veritabanına bağlanılıyor: ${poolConfig.host}:${poolConfig.port} (connection limit: ${poolConfig.connectionLimit})`);
} else {
    // Local development için
    poolConfig = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'farm_management',
        port: parseInt(process.env.DB_PORT) || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    };
    console.log(`Local veritabanına bağlanılıyor: ${poolConfig.host}:${poolConfig.port}`);
}

const pool = mysql.createPool(poolConfig);

// Promise destekli bağlantı havuzu
const promisePool = pool.promise();

// Bağlantıyı test et
pool.getConnection((err, connection) => {
    if (err) {
        console.error('MySQL bağlantı hatası:', err.message);
        return;
    }
    console.log('MySQL veritabanına başarıyla bağlandı!');
    connection.release();
});

module.exports = promisePool;
