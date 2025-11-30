# 🚀 Render.com Deployment Guide - FarmApp

## 📋 Genel Bakış

Bu kılavuz, Farm Management System projesini Render.com'a nasıl deploy edeceğinizi adım adım gösterir.

## 🎯 Render.com Nedir?

- **Ücretsiz Plan**: 750 saat/ay ücretsiz kullanım
- **Otomatik Deploy**: Git push sonrası otomatik deployment
- **SSL Sertifikası**: Ücretsiz HTTPS
- **PostgreSQL/MySQL**: Ücretsiz veritabanı
- **Kolay Yönetim**: Web arayüzü ile kolay yapılandırma

## 📦 Hazırlık

### 1. Gereksinimler
- ✅ GitHub hesabı
- ✅ Render.com hesabı (https://render.com)
- ✅ Projeniz GitHub'da yüklü olmalı

### 2. Proje Yapısı
```
FarmApp/
├── backend/              # Node.js API
│   ├── Dockerfile       # Docker yapılandırması
│   ├── build.sh         # Build script
│   └── package.json
├── frontend/            # React App
│   ├── build.sh         # Build script
│   └── package.json
└── render.yaml          # Render Blueprint (opsiyonel)
```

## 🔧 Adım 1: GitHub'a Yükleme

Eğer henüz yüklemediyseniz:

```powershell
cd C:\Users\recep\Desktop\FarmApp

# Render dosyalarını commit et
git add .
git commit -m "Add Render.com deployment configuration"
git push origin main
```

## 🗄️ Adım 2: Veritabanı Oluşturma

### Render Dashboard'da:

1. https://dashboard.render.com adresine gidin
2. **New +** → **MySQL** seçin
3. Yapılandırma:
   - **Name**: `farmapp-db`
   - **Database**: `farm_management`
   - **User**: `farmapp_user`
   - **Region**: Frankfurt (veya size yakın)
   - **Plan**: Free
4. **Create Database** tıklayın
5. **Bekleyin**: Veritabanı hazır olana kadar (~2-3 dakika)

### Veritabanı Bilgilerini Kaydedin:
- Internal Database URL
- External Database URL
- Host
- Port
- Username
- Password

### SQL Dosyalarını Çalıştırın:

Render Dashboard → Database → **Connect** sekmesinden MySQL komut satırına bağlanın:

```bash
# Bağlantı komutu (Render'dan kopyalayın)
mysql -h [host] -u [user] -p[password] -P [port] farm_management
```

Sonra SQL dosyalarını sırayla çalıştırın:

```sql
-- 1. Schema
SOURCE backend/database/schema.sql;

-- 2. Güncellemeler
SOURCE backend/database/update_schema.sql;

-- 3. Email doğrulama
SOURCE backend/database/add_verification_columns.sql;
```

**Alternatif:** SQL dosyalarının içeriğini kopyalayıp Render SQL Editor'de çalıştırın.

## 🔙 Adım 3: Backend Deployment

### 3.1. New Web Service Oluşturun

1. **New +** → **Web Service**
2. **Connect Repository**: GitHub reponuzu bağlayın
3. Yapılandırma:

#### Basic Settings:
- **Name**: `farmapp-backend`
- **Region**: Frankfurt
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### Advanced Settings:
- **Plan**: Free
- **Auto-Deploy**: Yes

### 3.2. Environment Variables Ekleyin

**Environment** sekmesinde şu değişkenleri ekleyin:

```env
NODE_ENV=production
PORT=5000

# Database (Render MySQL'den kopyalayın)
DATABASE_URL=mysql://farmapp_user:password@host:port/farm_management

# JWT (Güvenli bir key oluşturun)
JWT_SECRET=your-super-secret-key-change-this-in-production-2024
JWT_EXPIRE=7d

# CORS (Frontend URL'i ekleyin)
FRONTEND_URL=https://farmapp-frontend.onrender.com
```

**Önemli**: `DATABASE_URL`'i Render MySQL bağlantı bilgilerinizle güncelleyin!

### 3.3. Deploy Başlatın

- **Create Web Service** tıklayın
- Build işlemi başlayacak (~2-5 dakika)
- **Live** durumuna geçene kadar bekleyin

### 3.4. Backend URL'i Kaydedin

Deployment tamamlandıktan sonra:
- URL'i kopyalayın: `https://farmapp-backend.onrender.com`

## 🎨 Adım 4: Frontend Deployment

### 4.1. New Static Site Oluşturun

1. **New +** → **Static Site**
2. **Connect Repository**: Aynı repoyu seçin
3. Yapılandırma:

#### Basic Settings:
- **Name**: `farmapp-frontend`
- **Region**: Frankfurt
- **Branch**: `main`
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

### 4.2. Environment Variables

```env
REACT_APP_API_URL=https://farmapp-backend.onrender.com/api
```

**Önemli**: Backend URL'inizi buraya yazın!

### 4.3. Rewrite Rules (SPA için)

**Redirects/Rewrites** sekmesinde:
- **Source**: `/*`
- **Destination**: `/index.html`
- **Action**: Rewrite

### 4.4. Deploy Başlatın

- **Create Static Site** tıklayın
- Build işlemi başlayacak (~3-7 dakika)
- **Live** durumuna geçene kadar bekleyin

## ✅ Adım 5: Doğrulama ve Test

### 5.1. Backend Testi

```bash
# Health check
curl https://farmapp-backend.onrender.com/

# API testi
curl https://farmapp-backend.onrender.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

### 5.2. Frontend Testi

1. `https://farmapp-frontend.onrender.com` adresini açın
2. Login sayfası gelmeli
3. Admin ile giriş yapın:
   - Username: `admin`
   - Password: `password123`
4. Dashboard'u kontrol edin

### 5.3. Email Doğrulama Testi

1. Yeni kullanıcı kayıt edin
2. 6 haneli kodu girin
3. Dashboard'a yönlendirildiğini görün

## 🔄 Adım 6: Otomatik Deployment

### Git Push ile Deploy

```powershell
# Değişiklik yap
git add .
git commit -m "Update feature"
git push origin main
```

Render otomatik olarak:
1. ✅ Yeni commit'i algılar
2. ✅ Build işlemini başlatır
3. ✅ Test eder
4. ✅ Deploy eder

## ⚙️ Yapılandırma Detayları

### Backend (Node.js)

**package.json**:
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0"
  },
  "scripts": {
    "start": "node server.js",
    "build": "echo 'No build step required'"
  }
}
```

### Frontend (React)

**package.json**:
```json
{
  "scripts": {
    "build": "react-scripts build"
  }
}
```

### Database Config (database.js)

```javascript
// Render.com DATABASE_URL desteği
if (process.env.DATABASE_URL) {
    const dbUrl = new URL(process.env.DATABASE_URL);
    poolConfig = {
        host: dbUrl.hostname,
        user: dbUrl.username,
        password: dbUrl.password,
        database: dbUrl.pathname.slice(1),
        port: dbUrl.port || 3306,
        ssl: { rejectUnauthorized: false }
    };
}
```

## 🐛 Sorun Giderme

### Backend Başlamıyor

1. **Logs kontrol edin**: Render Dashboard → Backend Service → Logs
2. **Environment variables kontrol edin**: DATABASE_URL doğru mu?
3. **Build logs**: npm install hatası var mı?

```bash
# Yaygın hatalar:
# - DATABASE_URL yanlış format
# - PORT çakışması (Render otomatik atar)
# - JWT_SECRET eksik
```

### Frontend API'ye Bağlanamıyor

1. **CORS hatası**: Backend'de FRONTEND_URL doğru mu?
2. **API URL**: `REACT_APP_API_URL` environment variable doğru mu?
3. **Build yeniden yap**: Frontend'i redeploy et

### Database Bağlantı Hatası

```bash
# MySQL connection timeout
# Çözüm: ssl: { rejectUnauthorized: false } ekle

# Access denied
# Çözüm: Render DB credentials'ı yeniden kontrol et
```

### 502 Bad Gateway

- Backend başlamayı bekleyin (~30-60 saniye)
- Free tier'da ilk istek yavaş olabilir (cold start)

## 🔐 Güvenlik

### Production Environment Variables

```env
# Güvenli JWT Secret oluştur
JWT_SECRET=$(openssl rand -base64 32)

# Database URL'i gizli tut
DATABASE_URL=mysql://user:pass@host:port/db

# CORS sadece frontend URL'i
FRONTEND_URL=https://your-app.onrender.com
```

### .gitignore Kontrolü

```gitignore
# Bu dosyalar GitHub'a gitMEMELİ
.env
node_modules/
build/
dist/
```

## 📊 Performans

### Free Tier Limitleri

- **Bandwidth**: 100 GB/ay
- **Build Minutes**: 500 dakika/ay
- **Uptime**: %99.9
- **Cold Start**: ~30 saniye (inaktif sonrası)

### Optimizasyon

```javascript
// Backend: Compression middleware
const compression = require('compression');
app.use(compression());

// Frontend: React build optimization
// package.json
{
  "scripts": {
    "build": "GENERATE_SOURCEMAP=false react-scripts build"
  }
}
```

## 🔄 Update & Rollback

### Update

```bash
git push origin main
# Render otomatik deploy eder
```

### Rollback

Render Dashboard → Service → Deploys → Önceki deploy'a "Rollback"

## 📱 Custom Domain (Opsiyonel)

### Frontend

1. Render Dashboard → Static Site → Settings
2. **Custom Domain** ekle: `www.yourfarm.com`
3. DNS ayarlarını yapılandır:
   - Type: CNAME
   - Name: www
   - Value: farmapp-frontend.onrender.com

### Backend

1. API subdomain: `api.yourfarm.com`
2. CNAME: farmapp-backend.onrender.com

## 💰 Maliyet

### Free Tier

- ✅ 750 saat/ay (her servis için)
- ✅ Otomatik HTTPS
- ✅ Otomatik deployment
- ❌ Cold start (15 dakika inaktif sonrası)

### Starter Plan ($7/ay per service)

- ✅ Always-on (no cold start)
- ✅ Daha fazla bandwidth
- ✅ Daha hızlı build

## 📞 Destek

### Render Docs
- https://render.com/docs

### Community Forum
- https://community.render.com

### Status Page
- https://status.render.com

## ✅ Checklist

Deployment öncesi kontrol listesi:

- [ ] GitHub'da repo oluşturuldu
- [ ] `.env` dosyası `.gitignore`'da
- [ ] `render.yaml` eklendi
- [ ] MySQL database oluşturuldu
- [ ] SQL dosyaları çalıştırıldı
- [ ] Backend environment variables ayarlandı
- [ ] Frontend environment variables ayarlandı
- [ ] Backend deploy edildi ve live
- [ ] Frontend deploy edildi ve live
- [ ] API testi yapıldı
- [ ] Login testi yapıldı
- [ ] Email doğrulama testi yapıldı

## 🎉 Tebrikler!

Projeniz artık canlıda! 

- 🌐 Frontend: `https://farmapp-frontend.onrender.com`
- 🔧 Backend: `https://farmapp-backend.onrender.com`
- 🗄️ Database: Render MySQL

---

**Not**: Free tier'da 15 dakika inaktivite sonrası servisler uyur (cold start). İlk istek 30-60 saniye sürebilir.
