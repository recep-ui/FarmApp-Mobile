# Farm Management System - Backend

Çiftlik Yönetim Sistemi için Node.js/Express.js backend API'si.

## Teknolojiler

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Veritabanı
- **JWT** - Kullanıcı kimlik doğrulama
- **Bcrypt** - Şifre hashleme
- **express-validator** - Input validasyonu

## Kurulum

### 1. Bağımlılıkları Yükle

```bash
cd backend
npm install
```

### 2. MySQL Veritabanını Oluştur

MySQL'e bağlanın ve veritabanını oluşturun:

```sql
CREATE DATABASE farm_management;
USE farm_management;
```

Sonra `database/schema.sql` dosyasını çalıştırın:

```bash
mysql -u root -p farm_management < database/schema.sql
```

### 3. Ortam Değişkenlerini Ayarla

`.env.example` dosyasını `.env` olarak kopyalayın ve düzenleyin:

```bash
copy .env.example .env
```

`.env` dosyasını kendi bilgilerinize göre düzenleyin:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=farm_management
DB_PORT=3306
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

### 4. Sunucuyu Başlat

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Sunucu `http://localhost:5000` adresinde çalışacak.

## API Endpoint'leri

### Auth (Kimlik Doğrulama)

- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Kullanıcı girişi
- `GET /api/auth/profile` - Kullanıcı profili (korumalı)
- `PUT /api/auth/change-password` - Şifre değiştir (korumalı)

### Animals (Hayvanlar)

- `GET /api/animals` - Tüm hayvanları listele
- `GET /api/animals/stats` - Hayvan istatistikleri
- `GET /api/animals/:id` - Tek hayvan detayı
- `POST /api/animals` - Yeni hayvan ekle
- `PUT /api/animals/:id` - Hayvan güncelle
- `DELETE /api/animals/:id` - Hayvan sil

### Barns (Ahırlar)

- `GET /api/barns` - Tüm ahırları listele
- `GET /api/barns/:id` - Tek ahır detayı
- `POST /api/barns` - Yeni ahır ekle
- `PUT /api/barns/:id` - Ahır güncelle
- `DELETE /api/barns/:id` - Ahır sil

### Health Records (Sağlık Kayıtları)

- `GET /api/health-records` - Tüm sağlık kayıtlarını listele
- `GET /api/health-records/:id` - Tek kayıt detayı
- `POST /api/health-records` - Yeni kayıt ekle
- `PUT /api/health-records/:id` - Kayıt güncelle
- `DELETE /api/health-records/:id` - Kayıt sil

### Feeding Records (Besleme Kayıtları)

- `GET /api/feeding-records` - Tüm besleme kayıtlarını listele
- `GET /api/feeding-records/:id` - Tek kayıt detayı
- `POST /api/feeding-records` - Yeni kayıt ekle
- `PUT /api/feeding-records/:id` - Kayıt güncelle
- `DELETE /api/feeding-records/:id` - Kayıt sil

### Production Records (Üretim Kayıtları)

- `GET /api/production-records` - Tüm üretim kayıtlarını listele
- `GET /api/production-records/stats` - Üretim istatistikleri
- `GET /api/production-records/:id` - Tek kayıt detayı
- `POST /api/production-records` - Yeni kayıt ekle
- `PUT /api/production-records/:id` - Kayıt güncelle
- `DELETE /api/production-records/:id` - Kayıt sil

### Employees (Çalışanlar)

- `GET /api/employees` - Tüm çalışanları listele
- `GET /api/employees/:id` - Tek çalışan detayı
- `POST /api/employees` - Yeni çalışan ekle
- `PUT /api/employees/:id` - Çalışan güncelle
- `DELETE /api/employees/:id` - Çalışan sil

### Tasks (Görevler)

- `GET /api/tasks` - Tüm görevleri listele
- `GET /api/tasks/stats` - Görev istatistikleri
- `GET /api/tasks/:id` - Tek görev detayı
- `POST /api/tasks` - Yeni görev ekle
- `PUT /api/tasks/:id` - Görev güncelle
- `DELETE /api/tasks/:id` - Görev sil

## Kimlik Doğrulama

Korumalı endpoint'lere erişmek için JWT token gereklidir. Token'ı Authorization header'ında gönderin:

```
Authorization: Bearer <your_jwt_token>
```

## Proje Yapısı

```
backend/
├── config/
│   └── database.js          # MySQL bağlantı ayarları
├── controllers/
│   ├── authController.js    # Auth işlemleri
│   ├── animalController.js  # Hayvan işlemleri
│   ├── barnController.js    # Ahır işlemleri
│   └── ...                  # Diğer controller'lar
├── middleware/
│   └── auth.js              # JWT middleware
├── routes/
│   ├── auth.js              # Auth route'ları
│   ├── animals.js           # Hayvan route'ları
│   └── ...                  # Diğer route'lar
├── database/
│   └── schema.sql           # Veritabanı şeması
├── .env                     # Ortam değişkenleri
├── .gitignore
├── package.json
└── server.js                # Ana sunucu dosyası
```

## Lisans

MIT
