# Farm Management System - Frontend

Çiftlik Yönetim Sistemi için React frontend uygulaması.

## Teknolojiler

- **React** ^18.2.0 - UI kütüphanesi
- **React Router DOM** ^6.20.0 - Routing
- **Axios** ^1.6.2 - HTTP istekleri
- **React Scripts** 5.0.1 - Build araçları

## Kurulum

### 1. Bağımlılıkları Yükle

```bash
cd frontend
npm install
```

### 2. Ortam Değişkenlerini Ayarla

`.env` dosyası zaten oluşturulmuş. Gerekirse backend URL'ini düzenleyin:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Uygulamayı Başlat

```bash
npm start
```

Uygulama `http://localhost:3000` adresinde açılacak.

## Sayfa Yapısı

- **Login** (`/login`) - Kullanıcı girişi
- **Register** (`/register`) - Yeni kullanıcı kaydı
- **Dashboard** (`/dashboard`) - Ana sayfa, istatistikler
- **Animals** (`/animals`) - Hayvan yönetimi
- **Barns** (`/barns`) - Ahır yönetimi
- **Health Records** (`/health-records`) - Sağlık kayıtları
- **Feeding Records** (`/feeding-records`) - Besleme kayıtları
- **Production Records** (`/production-records`) - Üretim kayıtları
- **Employees** (`/employees`) - Çalışan yönetimi
- **Tasks** (`/tasks`) - Görev yönetimi

## Özellikler

- JWT tabanlı kimlik doğrulama
- Protected routes (Korumalı sayfalar)
- Responsive tasarım
- CRUD işlemleri tüm tablolar için
- Dashboard istatistikleri
- Modern ve kullanıcı dostu arayüz

## Geliştirme Notları

### Yeni Sayfa Ekleme

`Animals.js` dosyasını baz alarak diğer sayfaları oluşturabilirsiniz:

1. `src/pages` klasörüne yeni component ekleyin
2. İlgili service'i `src/services/index.js`'den import edin
3. `App.js`'e route ekleyin
4. Sidebar'a link ekleyin (`Layout.js`)

### Stil Düzenleme

- Genel stiller: `styles/App.css`
- Auth sayfaları: `styles/Auth.css`
- Layout: `styles/Layout.css`
- Dashboard: `styles/Dashboard.css`
- CRUD sayfaları: `styles/Common.css`

## Build

Production build oluşturmak için:

```bash
npm run build
```

Build dosyaları `build/` klasörüne oluşturulur.

## Lisans

MIT
