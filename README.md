# Farm Management System

Modern ve kapsamlı bir Çiftlik Yönetim Sistemi. Node.js/Express.js backend ve React frontend ile geliştirilmiştir.

## Özellikler

### Backend
- JWT tabanlı güvenli kimlik doğrulama
- RESTful API mimarisi
- MySQL veritabanı
- Şifre hashleme (bcrypt)
- Input validasyonu

### Frontend
- Modern React 18 uygulaması
- Responsive tasarım
- Protected routes
- Dashboard istatistikleri
- CRUD işlemleri

## Modüller

1. **Hayvan Yönetimi** - Tür, ırk, doğum tarihi, kulak numarası takibi
2. **Ahır Yönetimi** - Kapasite, konum, doluluk oranı
3. **Sağlık Kayıtları** - Teşhis, tedavi, ilaç takibi
4. **Besleme Kayıtları** - Yem türü, miktar, tarih
5. **Üretim Kayıtları** - Süt, yumurta, et üretim takibi
6. **Çalışan Yönetimi** - Personel bilgileri, pozisyon
7. **Görev Yönetimi** - Atama, durum, öncelik takibi

## Teknoloji Stack

### Backend
- Node.js
- Express.js
- MySQL
- JWT (jsonwebtoken)
- Bcrypt
- Express Validator

### Frontend
- React 18
- React Router DOM
- Axios
- Modern CSS

## Kurulum

**Detaylı kurulum talimatları için [KURULUM.md](KURULUM.md) dosyasına bakın.**

### Hızlı Başlangıç

#### Gereksinimler
- Node.js (v14 veya üzeri)
- MySQL (v5.7 veya üzeri)
- npm

#### 1. MySQL Veritabanı
```sql
CREATE DATABASE farm_management;
```
Sonra `backend/database/schema.sql` dosyasını çalıştırın.

#### 2. Backend
```bash
cd backend
npm install
copy .env.example .env
# .env dosyasını düzenleyin (DB bilgileri)
npm run dev
```

#### 3. Frontend
```bash
cd frontend
npm install
npm start
```

**Uygulama:** `http://localhost:3000`  
**API:** `http://localhost:5000`

## API Dokümantasyonu

API endpoint'leri için `backend/README.md` dosyasına bakın.

## Kullanım

1. Sisteme giriş yapmak için `/register` sayfasından kayıt olun
2. Giriş yapın ve dashboard'a yönlendirileceksiniz
3. Sol menüden istediğiniz modüle gidin
4. CRUD işlemlerini gerçekleştirin

## Ekran Görüntüleri

Projede görseller için `attachments` klasöründeki tasarımlara bakabilirsiniz.

## Geliştirme Planı

- [ ] Grafik ve chart entegrasyonu (Chart.js / Recharts)
- [ ] Raporlama modülü
- [ ] Excel export özelliği
- [ ] Bildirim sistemi
- [ ] Mobil uygulama
- [ ] Multi-language desteği

## Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için lütfen önce issue açın.

## Lisans

MIT

## İletişim

Sorularınız için issue açabilirsiniz.
