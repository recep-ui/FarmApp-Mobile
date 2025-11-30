# Render.com ve Files.io Deployment Rehberi

Bu rehber, FarmApp uygulamasını Render.com'da (backend + frontend) ve Files.io'da (MySQL veritabanı) nasıl yayınlayacağınızı adım adım açıklar.

## 📋 Gereksinimler

1. **Render.com** hesabı (ücretsiz)
2. **Files.io** hesabı ve MySQL veritabanı
3. **GitHub** hesabı (kodların yükleneceği yer)

---

## 🗄️ 1. Adım: Files.io'da MySQL Veritabanı Kurulumu

### 1.1 Files.io'da Veritabanı Oluşturma

1. [Files.io](https://www.files.io/) adresine gidin ve MySQL hosting hizmeti satın alın
2. Veritabanı bilgilerinizi not edin:
   - Host: `mysql.files.io` (veya sağlanan host)
   - Port: `3306`
   - Database Name: `farm_management` (veya tercih ettiğiniz isim)
   - Username: `your_username`
   - Password: `your_password`

### 1.2 Veritabanı Connection String Oluşturma

Files.io bilgilerinizle DATABASE_URL oluşturun:

```
mysql://username:password@mysql.files.io:3306/farm_management
```

**Örnek:**
```
mysql://farmuser:MyP@ssw0rd123@mysql.files.io:3306/farm_management
```

⚠️ **Not:** Şifrenizde özel karakterler varsa, URL-encoded olması gerekebilir.

### 1.3 Veritabanı Şemasını Yükleme

Files.io veritabanınıza bağlanmak için phpMyAdmin veya MySQL Workbench kullanın:

1. **phpMyAdmin ile:**
   - Files.io dashboard'unuzdan phpMyAdmin'e giriş yapın
   - SQL sekmesine gidin
   - `backend/database/schema.sql` dosyasının içeriğini yapıştırın
   - Execute/Çalıştır butonuna tıklayın

2. **MySQL Workbench ile:**
   ```bash
   mysql -h mysql.files.io -P 3306 -u username -p farm_management < backend/database/schema.sql
   ```

---

## 🚀 2. Adım: Render.com'da Backend Kurulumu

### 2.1 GitHub'a Kod Yükleme

```bash
# Git repository'sini başlatın (henüz yapmadıysanız)
git init
git add .
git commit -m "Initial commit for Render deployment"

# GitHub'a yükleyin
git remote add origin https://github.com/yourusername/farmapp.git
git branch -M main
git push -u origin main
```

### 2.2 Render.com'da Backend Service Oluşturma

1. [Render Dashboard](https://dashboard.render.com/) adresine gidin
2. **"New +"** butonuna tıklayın
3. **"Web Service"** seçin
4. GitHub repository'nizi bağlayın ve seçin

#### Backend Ayarları:

- **Name:** `farmapp-backend`
- **Region:** Frankfurt (veya size yakın)
- **Branch:** `main`
- **Root Directory:** `backend`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free

#### Environment Variables (Backend):

Aşağıdaki environment variables'ları ekleyin:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `HOST` | `0.0.0.0` |
| `JWT_SECRET` | (Generate butonu ile oluşturun) |
| `JWT_EXPIRE` | `7d` |
| `DATABASE_URL` | `mysql://username:password@mysql.files.io:3306/farm_management` |
| `DB_SSL` | `true` |
| `FRONTEND_URL` | `https://farmapp-frontend.onrender.com` |

⚠️ **DATABASE_URL'i files.io bilgilerinizle güncelleyin!**

5. **"Create Web Service"** butonuna tıklayın
6. Deployment tamamlanana kadar bekleyin (5-10 dakika)
7. Backend URL'inizi not edin: `https://farmapp-backend.onrender.com`

---

## 🎨 3. Adım: Render.com'da Frontend Kurulumu

### 3.1 Frontend Service Oluşturma

1. Render Dashboard'da **"New +"** > **"Static Site"** seçin
2. Aynı GitHub repository'sini seçin

#### Frontend Ayarları:

- **Name:** `farmapp-frontend`
- **Region:** Frankfurt
- **Branch:** `main`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `build`
- **Plan:** Free

#### Environment Variables (Frontend):

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://farmapp-backend.onrender.com/api` |

⚠️ Backend URL'inizi yukarıdaki değerde kullanın!

3. **Auto-Deploy:** Yes
4. **"Create Static Site"** butonuna tıklayın
5. Deployment tamamlanana kadar bekleyin

---

## 🔧 4. Adım: CORS Ayarlarını Güncelleme

Frontend deploy edildikten sonra URL'sini alın ve backend'de güncelleyin:

1. Render Dashboard > Backend Service > Environment
2. `FRONTEND_URL` değerini frontend URL'iniz ile güncelleyin
3. Backend'i yeniden deploy edin (Manual Deploy > Deploy latest commit)

---

## ✅ 5. Adım: Test ve Doğrulama

### 5.1 Backend Test

```bash
curl https://farmapp-backend.onrender.com/
```

Yanıt:
```json
{
  "message": "Farm Management System API",
  "version": "1.0.0",
  "status": "running"
}
```

### 5.2 Veritabanı Bağlantısı Test

Backend loglarını kontrol edin:
- Render Dashboard > Backend Service > Logs
- "MySQL veritabanına başarıyla bağlandı!" mesajını görmelisiniz

### 5.3 Frontend Test

Frontend URL'inizi tarayıcıda açın ve login ekranının geldiğini kontrol edin.

---

## 🔐 6. Adım: İlk Kullanıcı Oluşturma

Veritabanınıza doğrudan bağlanarak bir admin kullanıcısı oluşturun:

```sql
INSERT INTO users (username, email, password, role, email_verified) 
VALUES (
    'admin',
    'admin@farmapp.com',
    '$2b$10$YourHashedPasswordHere',  -- bcrypt ile hash'lenmiş şifre
    'admin',
    1
);
```

Veya frontend'den register olup veritabanından `role`'ü `admin` yapın.

---

## 📊 Alternatif: render.yaml ile Otomatik Deployment

Projenizde `render.yaml` dosyası mevcut. Blueprint kullanarak tek tıkla deploy:

1. Render Dashboard'da **"New +"** > **"Blueprint"**
2. GitHub repository'nizi seçin
3. `render.yaml` otomatik algılanacak
4. Environment variables'ları doldurun:
   - `DATABASE_URL` (files.io)
   - `JWT_SECRET` (generate)
5. **"Apply"** butonuna tıklayın

---

## 🐛 Sorun Giderme

### Veritabanı Bağlantı Hatası

- DATABASE_URL formatını kontrol edin
- Files.io'da IP whitelist varsa Render IP'lerini ekleyin
- DB_SSL ayarını kontrol edin

### CORS Hatası

- Backend'de FRONTEND_URL'in doğru olduğunu kontrol edin
- `server.js`'deki allowedOrigins dizisini kontrol edin

### Render Free Tier Uyuma Modu

Render free tier, 15 dakika hareketsizlikten sonra uyur:
- İlk istek 30-60 saniye sürebilir
- Cron job veya uptime monitor ile önlenebilir

---

## 📝 Önemli Notlar

1. **Free Tier Limitleri:**
   - Backend: 750 saat/ay
   - Frontend: Unlimited bandwidth
   - 15 dakika hareketsizlik sonrası uyku modu

2. **Güvenlik:**
   - JWT_SECRET'i mutlaka güçlü bir değer yapın
   - Veritabanı şifrelerini karmaşık tutun
   - Environment variables'ları asla GitHub'a yüklemeyin

3. **Performans:**
   - İlk istek yavaş olabilir (cold start)
   - Files.io veritabanı konumunu backend region'a yakın seçin

4. **Bakım:**
   - Render otomatik SSL sertifikası sağlar
   - Git push ile otomatik deployment aktif

---

## 🔗 Yararlı Linkler

- [Render Docs](https://render.com/docs)
- [Files.io Support](https://www.files.io/support)
- [MySQL Connection String Format](https://dev.mysql.com/doc/refman/8.0/en/connecting-using-uri-or-key-value-pairs.html)

---

## 📞 Destek

Sorun yaşarsanız:
1. Render logs'ları kontrol edin
2. Files.io dashboard'dan database status'ü kontrol edin
3. Browser console'da network hatalarına bakın

**Deployment başarılı! 🎉**
