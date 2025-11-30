# XAMPP ile Kurulum Rehberi

Bu rehber, Farm Management System projesini XAMPP kullanarak nasıl kuracağınızı adım adım anlatır.

## 📋 Gereksinimler

- **XAMPP** (Apache + MySQL + PHP)
- **Node.js** (v14 veya üzeri)
- **npm** (Node.js ile birlikte gelir)

## 🔧 Adım 1: XAMPP Kurulumu

1. **XAMPP'i İndirin**
   - [XAMPP Resmi Sitesi](https://www.apachefriends.org/tr/index.html)
   - Windows için XAMPP installer'ı indirin
   - Kurulum sırasında MySQL'i seçmeyi unutmayın

2. **XAMPP'i Başlatın**
   - XAMPP Control Panel'i açın
   - **MySQL** modülünü başlatın (Start butonuna tıklayın)
   - MySQL'in yeşil "Running" durumunda olduğundan emin olun

   ```
   ✅ MySQL should show "Running" status
   ```

## 🗄️ Adım 2: Veritabanı Oluşturma

### Yöntem 1: phpMyAdmin ile (Tavsiye Edilir)

1. **phpMyAdmin'e Giriş**
   - Tarayıcınızda açın: `http://localhost/phpmyadmin`
   - Kullanıcı adı: `root`
   - Şifre: (boş bırakın)

2. **Yeni Veritabanı Oluşturun**
   - Sol tarafta "New" (Yeni) butonuna tıklayın
   - Veritabanı adı: `farm_management`
   - Collation: `utf8mb4_general_ci` (Türkçe karakter desteği için)
   - "Create" butonuna tıklayın

3. **SQL Şemasını İçe Aktarın**
   - Oluşturduğunuz `farm_management` veritabanını seçin
   - Üstteki "SQL" sekmesine tıklayın
   - `backend/database/schema.sql` dosyasının içeriğini kopyalayıp yapıştırın
   - "Go" butonuna tıklayın
   - Tüm tabloların başarıyla oluşturulduğunu göreceksiniz

### Yöntem 2: MySQL Command Line ile

```bash
# XAMPP MySQL'e bağlan
"C:\xampp\mysql\bin\mysql.exe" -u root

# Veritabanını oluştur
CREATE DATABASE farm_management CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE farm_management;

# Şemayı import et
SOURCE C:/Users/recep/Desktop/FarmApp/backend/database/schema.sql;

# Çıkış
EXIT;
```

## 🔑 Adım 3: Backend Kurulumu

1. **Backend klasörüne gidin**
   ```powershell
   cd C:\Users\recep\Desktop\FarmApp\backend
   ```

2. **Node.js paketlerini yükleyin**
   ```powershell
   npm install
   ```

3. **.env dosyası zaten hazır**
   - `.env` dosyası XAMPP için yapılandırılmış durumda
   - XAMPP'in varsayılan ayarları kullanılıyor:
     - Host: `localhost`
     - User: `root`
     - Password: (boş)
     - Port: `3306`

4. **Backend sunucusunu başlatın**
   ```powershell
   npm run dev
   ```

   Şu mesajı görmelisiniz:
   ```
   ✅ MySQL veritabanına başarıyla bağlandı!
   ✅ Sunucu http://localhost:5000 adresinde çalışıyor
   ```

## 💻 Adım 4: Frontend Kurulumu

1. **Yeni bir PowerShell terminali açın**

2. **Frontend klasörüne gidin**
   ```powershell
   cd C:\Users\recep\Desktop\FarmApp\frontend
   ```

3. **Node.js paketlerini yükleyin**
   ```powershell
   npm install
   ```

4. **Frontend uygulamasını başlatın**
   ```powershell
   npm start
   ```

   Tarayıcınızda otomatik olarak `http://localhost:3000` açılacaktır.

## 👤 Adım 5: İlk Kullanıcıyı Oluşturma

### Yöntem 1: Kayıt Sayfası ile (Tavsiye Edilir)

1. Tarayıcıda `http://localhost:3000/register` adresine gidin
2. Formu doldurun:
   - Kullanıcı Adı: `admin`
   - Email: `admin@farm.com`
   - Şifre: `Admin123!`
   - Rol: `admin` seçin
3. "Kayıt Ol" butonuna tıklayın
4. Otomatik olarak giriş yapılacaktır

### Yöntem 2: phpMyAdmin ile Manuel Ekleme

1. phpMyAdmin'de `farm_management` veritabanını seçin
2. `users` tablosuna gidin
3. "Insert" sekmesine tıklayın
4. Şu değerleri girin:
   - username: `admin`
   - email: `admin@farm.com`
   - password_hash: `$2b$10$xUz8qP6WqK9nQz5fF5bKJeYj5kK5J5K5J5K5J5K5J5K5J5K5J5K5J` (örnek hash)
   - role: `admin`
   - is_active: `1`

**Not:** Manuel ekleme için şifreyi bcrypt ile hashlemek gerekir. Kayıt sayfasını kullanmanız daha kolaydır.

## 🎯 Adım 6: Sistemi Kullanma

1. **Giriş Yapın**
   - `http://localhost:3000/login`
   - Kullanıcı adı: `admin`
   - Şifre: `Admin123!` (veya oluşturduğunuz şifre)

2. **Dashboard'a Erişin**
   - Başarılı girişten sonra Dashboard sayfasına yönlendirileceksiniz
   - Sol menüden tüm modüllere erişebilirsiniz

## 🔧 XAMPP ile İlgili Önemli Notlar

### MySQL Port Çakışması
Eğer MySQL başlamazsa, port 3306 başka bir program tarafından kullanılıyor olabilir:

1. XAMPP Control Panel'de MySQL yanındaki "Config" → "my.ini" dosyasını açın
2. `port=3306` satırını bulun ve farklı bir port yazın (örn: `port=3307`)
3. MySQL'i yeniden başlatın
4. Backend `.env` dosyasında `DB_PORT=3307` olarak güncelleyin

### Apache ile Çakışma
Eğer Apache başlamazsa (port 80 veya 443 çakışması):
- Apache'yi kapatın (bu proje için gerekli değil)
- Sadece MySQL çalışması yeterlidir

### XAMPP MySQL'i Durdurma ve Başlatma
```
✅ Her zaman XAMPP Control Panel'den MySQL'i yönetin
✅ Windows Services'den değil, XAMPP Control Panel'den başlatın
```

## 🛠️ Sorun Giderme

### 1. "MySQL bağlantı hatası" Mesajı

**Çözüm:**
- XAMPP Control Panel'de MySQL'in çalıştığından emin olun
- `.env` dosyasındaki `DB_PASSWORD` boş olmalı (XAMPP varsayılan)
- Port numarasının doğru olduğunu kontrol edin (3306)

### 2. "ER_BAD_DB_ERROR: Unknown database"

**Çözüm:**
```bash
# phpMyAdmin'de veritabanını oluşturun
CREATE DATABASE farm_management;
```

### 3. "Port 5000 already in use"

**Çözüm:**
```powershell
# Backend .env dosyasında portu değiştirin
PORT=5001
```

### 4. Frontend açılmıyor

**Çözüm:**
- Backend'in çalıştığından emin olun (`http://localhost:5000`)
- `frontend/.env` dosyasında `REACT_APP_API_URL` doğru olmalı
- Tarayıcı cache'ini temizleyin (Ctrl + Shift + Delete)

### 5. "Access denied for user 'root'@'localhost'"

**Çözüm:**
- XAMPP'te MySQL şifresi boş olmalıdır
- `.env` dosyasında `DB_PASSWORD=` (boş) olarak ayarlayın
- Eğer şifre koyduyseniz, phpMyAdmin'de şifreyi sıfırlayın:

```sql
UPDATE mysql.user SET Password=PASSWORD('') WHERE User='root';
FLUSH PRIVILEGES;
```

## 📊 Veritabanı Tabloları Kontrolü

phpMyAdmin'de kontrol edin:
- ✅ users (8 kayıt alanı)
- ✅ animals (15 kayıt alanı)
- ✅ barns (6 kayıt alanı)
- ✅ health_records (10 kayıt alanı)
- ✅ feeding_records (8 kayıt alanı)
- ✅ production_records (9 kayıt alanı)
- ✅ employees (9 kayıt alanı)
- ✅ tasks (11 kayıt alanı)

## 🎉 Başarılı Kurulum Kontrolü

Aşağıdaki adımları kontrol edin:

1. ✅ XAMPP MySQL "Running" durumunda
2. ✅ phpMyAdmin'de `farm_management` veritabanı görünüyor
3. ✅ Backend terminal: "MySQL veritabanına başarıyla bağlandı!"
4. ✅ Backend terminal: "Sunucu http://localhost:5000 adresinde çalışıyor"
5. ✅ Frontend terminal: "webpack compiled successfully"
6. ✅ Tarayıcıda `http://localhost:3000` açılıyor
7. ✅ Login sayfası görünüyor
8. ✅ Admin kullanıcısı ile giriş yapılabiliyor

## 🔄 Her Seferinde Başlatma

### Projeyi Açmak için:

1. **XAMPP'i başlatın**
   - XAMPP Control Panel → MySQL → Start

2. **Backend'i başlatın**
   ```powershell
   cd C:\Users\recep\Desktop\FarmApp\backend
   npm run dev
   ```

3. **Frontend'i başlatın** (yeni terminal)
   ```powershell
   cd C:\Users\recep\Desktop\FarmApp\frontend
   npm start
   ```

### Projeyi Kapatmak için:

1. Frontend terminalinde: `Ctrl + C`
2. Backend terminalinde: `Ctrl + C`
3. XAMPP Control Panel → MySQL → Stop

## 📞 Ek Yardım

Sorun yaşarsanız:
1. `KURULUM.md` dosyasına bakın (genel kurulum)
2. `README.md` dosyasına bakın (proje özeti)
3. `PROJE_OZETI.md` dosyasına bakın (detaylı bilgi)

---

**🎯 XAMPP ile kurulum tamamlandı! Sistemi kullanmaya başlayabilirsiniz.**
