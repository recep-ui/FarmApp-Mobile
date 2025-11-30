# Farm Management System - Kurulum Rehberi

Bu rehber, Farm Management System'i sıfırdan kurmak için gerekli tüm adımları içerir.

## Gereksinimler

- **Node.js** (v14 veya üzeri) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 veya üzeri) - [Download](https://dev.mysql.com/downloads/)
- **npm** (Node.js ile gelir)
- **Git** (opsiyonel)

## Kurulum Adımları

### 1. Projeyi İndirin

Projeyi bilgisayarınıza indirin veya klonlayın.

### 2. MySQL Veritabanı Kurulumu

#### a) MySQL'e Giriş Yapın
```bash
mysql -u root -p
```

#### b) Veritabanı Oluşturun
```sql
CREATE DATABASE farm_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

#### c) Schema'yı Yükleyin
PowerShell'de:
```powershell
cd backend
Get-Content database\schema.sql | mysql -u root -p farm_management
```

Veya MySQL Workbench kullanarak `backend/database/schema.sql` dosyasını çalıştırın.

### 3. Backend Kurulumu

```powershell
# Backend klasörüne gidin
cd backend

# Bağımlılıkları yükleyin
npm install

# .env dosyası oluşturun
copy .env.example .env
```

#### .env Dosyasını Düzenleyin
`.env` dosyasını bir metin editörü ile açın ve aşağıdaki bilgileri güncelleyin:

```env
PORT=5000
NODE_ENV=development

# MySQL Bilgileriniz
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=farm_management
DB_PORT=3306

# Güvenlik - Değiştirin!
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
JWT_EXPIRE=7d

FRONTEND_URL=http://localhost:3000
```

**ÖNEMLİ:** `DB_PASSWORD` kısmına kendi MySQL şifrenizi yazın!

#### Backend'i Başlatın
```powershell
# Development mode (otomatik yeniden başlatma)
npm run dev

# Veya normal mode
npm start
```

Backend `http://localhost:5000` adresinde çalışacak.

### 4. Frontend Kurulumu

Yeni bir PowerShell penceresi açın:

```powershell
# Frontend klasörüne gidin
cd frontend

# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npm start
```

Frontend `http://localhost:3000` adresinde otomatik açılacak.

## İlk Kullanım

1. **Kayıt Ol**: `http://localhost:3000/register` adresine giderek yeni bir hesap oluşturun
2. **Giriş Yap**: Oluşturduğunuz hesapla giriş yapın
3. **Dashboard**: Otomatik olarak dashboard'a yönlendirileceksiniz
4. **Veri Girin**: Sol menüden istediğiniz modülü seçip veri girmeye başlayın

## Test Verileri (Opsiyonel)

Sistemi test etmek için örnek veriler ekleyebilirsiniz:

### Örnek Kullanıcı Oluştur
Register sayfasından:
- Username: admin
- Email: admin@farm.com
- Password: admin123

### Örnek Ahır Ekle
Barns sayfasından:
- Ahır Adı: A Blok
- Kapasite: 50
- Konum: Kuzey Bölge

### Örnek Hayvan Ekle
Animals sayfasından:
- Tür: Cow (İnek)
- Irk: Holstein
- Kulak No: 2024-001
- Ahır: A Blok

## Sorun Giderme

### Backend Başlamıyor
- MySQL çalışıyor mu? Kontrol edin: `mysql --version`
- `.env` dosyası doğru mu? DB_PASSWORD kontrolü yapın
- Port 5000 kullanımda mı? Başka bir uygulama kapatın

### Frontend Başlamıyor
- Backend çalışıyor mu? `http://localhost:5000` adresini kontrol edin
- Node modülleri yüklü mü? `npm install` tekrar çalıştırın
- Port 3000 kullanımda mı? Başka bir React uygulaması kapatın

### Bağlantı Hatası
- Firewall ayarlarını kontrol edin
- CORS hatası alıyorsanız, backend `.env` dosyasında `FRONTEND_URL` doğru mu kontrol edin

### MySQL Bağlantı Hatası
```
Error: Access denied for user 'root'@'localhost'
```
**Çözüm:** `.env` dosyasında `DB_PASSWORD` doğru mu kontrol edin

```
Error: Unknown database 'farm_management'
```
**Çözüm:** Veritabanını oluşturun: `CREATE DATABASE farm_management;`

## Geliştirme İpuçları

### Backend Log'ları
Backend terminalde tüm istekleri görebilirsiniz. Hata ayıklama için kullanışlıdır.

### Frontend DevTools
Tarayıcıda F12 ile Developer Tools açın. Console ve Network sekmelerini kullanın.

### Veritabanı Kontrolü
MySQL Workbench veya phpMyAdmin ile veritabanınızı görsel olarak yönetebilirsiniz.

## Üretim Ortamına Alma (Production)

### Backend
```powershell
cd backend
$env:NODE_ENV="production"
npm start
```

### Frontend
```powershell
cd frontend
npm run build
# build/ klasörünü web sunucunuza yükleyin
```

## Destek

Sorunlarınız için:
1. README dosyalarını okuyun
2. Console log'larını kontrol edin
3. GitHub Issues bölümünde sorun açın

## Lisans

MIT License - Kullanmakta özgürsünüz!
