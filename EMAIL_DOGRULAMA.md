# Email Doğrulama Sistemi - Kurulum ve Kullanım

## 🚀 Yapılan Değişiklikler

### Backend Değişiklikleri

1. **Veritabanı Şeması Güncellemesi**
   - `Users` tablosuna 3 yeni kolon eklendi:
     - `email_verified` (TINYINT): Email doğrulanma durumu (0: hayır, 1: evet)
     - `verification_token` (VARCHAR): 6 haneli doğrulama kodu
     - `verification_token_expires` (TIMESTAMP): Kodun son kullanma tarihi

2. **Yeni Controller: verificationController.js**
   - `verifyEmail`: Email doğrulama kodu kontrolü
   - `resendVerificationCode`: Yeni kod gönderme
   - `checkVerificationStatus`: Doğrulama durumu kontrolü

3. **Auth Controller Güncellemeleri**
   - Register: Email format kontrolü, benzersizlik kontrolü, doğrulama token oluşturma
   - Login: Email doğrulanmamış kullanıcıların girişini engelleme

4. **Yeni Route'lar (/api/auth)**
   - `POST /verify-email`: Email doğrulama
   - `POST /resend-verification`: Yeni kod gönderme
   - `GET /verification-status/:userId`: Durum kontrolü

### Frontend Değişiklikleri

1. **Yeni Sayfa: VerifyEmail.js**
   - 6 haneli doğrulama kodu girişi
   - Yeni kod talep etme
   - Geliştirme ortamında kod görüntüleme

2. **Register.js Güncellemesi**
   - Kayıt sonrası VerifyEmail sayfasına yönlendirme
   - Email format ve domain kontrolü

3. **Login.js Güncellemesi**
   - Email doğrulanmamış kullanıcıları VerifyEmail'e yönlendirme

4. **CSS Güncellemeleri**
   - Success message stili
   - Secondary button stili

## 📋 Kurulum Adımları

### 1. Veritabanı Güncelleme

phpMyAdmin'de FarmApp veritabanını seçin ve aşağıdaki SQL dosyasını çalıştırın:

```
backend/database/add_verification_columns.sql
```

Bu dosya:
- ✅ Yeni kolonları ekler
- ✅ Mevcut admin ve recep kullanıcılarını doğrulanmış olarak işaretler
- ✅ Veritabanı yapısını kontrol eder

### 2. Backend'i Başlatma

```powershell
cd backend
npm run dev
```

### 3. Frontend'i Başlatma

```powershell
cd frontend
npm start
```

## 🔐 Nasıl Çalışır?

### Kayıt Akışı

1. **Kullanıcı Kayıt Olur**
   - Form validasyonu yapılır
   - Email formatı kontrol edilir (yasaklı domainler engellenir)
   - Username ve email benzersizliği kontrol edilir
   - 6 haneli rastgele doğrulama kodu oluşturulur
   - Kullanıcı veritabanına kaydedilir (`email_verified = 0`)

2. **VerifyEmail Sayfasına Yönlendirilir**
   - Kullanıcıya email adresi gösterilir
   - 6 haneli kod giriş alanı gösterilir
   - Geliştirme ortamında kod ekranda görünür

3. **Kullanıcı Kodu Girer**
   - Kod format kontrolü (6 hane)
   - Backend'e doğrulama isteği gönderilir
   - Kod doğruysa: `email_verified = 1` yapılır
   - Token ve süre bilgisi temizlenir
   - Dashboard'a yönlendirilir

### Login Akışı

1. **Kullanıcı Giriş Yapmaya Çalışır**
   - Username/email ve şifre kontrol edilir
   - Email doğrulanmış mı kontrol edilir
   - Doğrulanmamışsa: VerifyEmail sayfasına yönlendirilir
   - Doğrulanmışsa: Dashboard'a giriş yapılır

### Yeni Kod Talep Etme

- Kullanıcı "Yeni Kod Gönder" butonuna tıklar
- Yeni 6 haneli kod oluşturulur
- Yeni 24 saatlik süre başlatılır
- Geliştirme ortamında yeni kod gösterilir

## 🛡️ Güvenlik Özellikleri

### Email Validasyonu

```javascript
// Format kontrolü
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Yasaklı domainler
const blockedDomains = [
  'test.com', 
  'example.com', 
  'temp.com', 
  'fake.com', 
  'temporary.com'
];
```

### Benzersizlik Kontrolleri

- **Username**: Her kullanıcı adı benzersiz olmalı
- **Email**: Her email adresi benzersiz olmalı
- Ayrı ayrı kontrol yapılır, spesifik hata mesajları döndürülür

### Token Güvenliği

- **6 haneli rastgele kod**: 100000-999999 arası
- **24 saatlik geçerlilik süresi**: Token expires ile kontrol
- **Tek kullanımlık**: Doğrulama sonrası token silinir

### Zorunlu Alan Kontrolleri

Backend (express-validator):
```javascript
body('username').trim().isLength({ min: 3 })
body('email').isEmail()
body('password').isLength({ min: 6 })
```

Frontend (HTML5 + JavaScript):
```javascript
required
type="email"
minLength={6}
```

## 📝 API Endpoints

### POST /api/auth/register
**Request:**
```json
{
  "username": "kullanici123",
  "email": "kullanici@gmail.com",
  "password": "password123",
  "first_name": "Ad",
  "last_name": "Soyad",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Kullanıcı başarıyla oluşturuldu...",
  "data": {
    "userId": 3,
    "username": "kullanici123",
    "email": "kullanici@gmail.com",
    "role": "user",
    "token": "jwt-token...",
    "emailVerified": false,
    "verificationToken": "123456"
  }
}
```

### POST /api/auth/verify-email
**Request:**
```json
{
  "userId": 3,
  "verificationCode": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email başarıyla doğrulandı"
}
```

### POST /api/auth/resend-verification
**Request:**
```json
{
  "userId": 3
}
```

**Response:**
```json
{
  "success": true,
  "message": "Yeni doğrulama kodu gönderildi",
  "data": {
    "verificationToken": "654321"
  }
}
```

### GET /api/auth/verification-status/:userId
**Response:**
```json
{
  "success": true,
  "data": {
    "emailVerified": true
  }
}
```

## 🧪 Test Senaryoları

### 1. Başarılı Kayıt ve Doğrulama
1. `/register` sayfasına git
2. Geçerli bilgilerle kayıt ol
3. VerifyEmail sayfasında gösterilen kodu gir
4. Dashboard'a yönlendirildiğini kontrol et

### 2. Hatalı Email Formatı
1. Register formunda `test@example.com` gir
2. "Bu email domaini kullanılamaz" hatası görmeli

### 3. Duplicate Email
1. Mevcut bir email ile kayıt olmayı dene
2. "Bu email zaten kullanılıyor" hatası görmeli

### 4. Yanlış Doğrulama Kodu
1. VerifyEmail sayfasında hatalı kod gir
2. "Doğrulama kodu hatalı" hatası görmeli

### 5. Süresi Dolmuş Kod
1. Veritabanında `verification_token_expires`'ı geçmiş tarihe ayarla
2. Kod girmeyi dene
3. "Doğrulama kodu süresi dolmuş" hatası görmeli

### 6. Doğrulanmamış Kullanıcı Girişi
1. Email doğrulamadan login sayfasına git
2. Username/password gir
3. VerifyEmail sayfasına yönlendirilmeli

## 🔧 Geliştirme Notları

### Email Gönderimi (Şu an devre dışı)

Gerçek uygulamada Nodemailer kullanarak email gönderilebilir:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: 'farmapp@gmail.com',
  to: user.email,
  subject: 'Email Doğrulama',
  html: `<p>Doğrulama kodunuz: <strong>${verificationToken}</strong></p>`
};

await transporter.sendMail(mailOptions);
```

### Geliştirme vs Prodüksiyon

**Geliştirme ortamında:**
- Doğrulama kodu ekranda gösterilir
- Console'a yazdırılır

**Prodüksiyon ortamında:**
- `verificationToken` response'dan kaldırılmalı
- Kod sadece email ile gönderilmeli
- Rate limiting eklenmeli (brute force koruması)

## 📊 Veritabanı Yapısı

```sql
Users Table:
├── user_id (INT, PK, AUTO_INCREMENT)
├── username (VARCHAR, UNIQUE)
├── email (VARCHAR, UNIQUE) ⭐
├── password_hash (VARCHAR)
├── first_name (VARCHAR)
├── last_name (VARCHAR)
├── role (VARCHAR)
├── is_active (TINYINT)
├── email_verified (TINYINT) ⭐ YENI
├── verification_token (VARCHAR) ⭐ YENI
├── verification_token_expires (TIMESTAMP) ⭐ YENI
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## ✅ Tamamlanan Özellikler

- ✅ Email format kontrolü (frontend + backend)
- ✅ Email benzersizlik kontrolü
- ✅ Username benzersizlik kontrolü
- ✅ 6 haneli doğrulama kodu sistemi
- ✅ Token süre kontrolü (24 saat)
- ✅ Doğrulanmamış kullanıcı girişi engelleme
- ✅ Yeni kod talep etme
- ✅ Responsive UI
- ✅ Hata yönetimi
- ✅ Success/error mesajları

## 🚧 İsteğe Bağlı Geliştirmeler

- [ ] Nodemailer entegrasyonu (gerçek email gönderimi)
- [ ] Rate limiting (brute force koruması)
- [ ] Email şablonları (HTML email)
- [ ] SMS doğrulama alternatifi
- [ ] 2FA (Two-Factor Authentication)
- [ ] Email değiştirme özelliği
- [ ] Kullanıcı profil sayfasında email durumu gösterimi

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Console'u kontrol edin (F12)
2. Backend loglarına bakın
3. Veritabanı yapısını kontrol edin (`DESCRIBE Users;`)
4. SQL dosyalarının çalıştırılıp çalıştırılmadığını kontrol edin
