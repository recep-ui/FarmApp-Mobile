# Render.com Deployment Checklist

## 📋 Deployment Öncesi Kontrol Listesi

### ✅ Files.io Veritabanı Hazırlığı

- [ ] Files.io hesabı oluşturuldu
- [ ] MySQL hosting paketi satın alındı
- [ ] Veritabanı bilgileri not edildi:
  - Host: _______________
  - Port: _______________
  - Database Name: _______________
  - Username: _______________
  - Password: _______________
- [ ] DATABASE_URL formatı oluşturuldu: `mysql://user:pass@host:port/database`
- [ ] phpMyAdmin veya MySQL Workbench ile erişim test edildi
- [ ] `backend/database/schema.sql` import edildi
- [ ] Tablolar ve veriler doğrulandı

### ✅ GitHub Hazırlığı

- [ ] Git repository başlatıldı (`git init`)
- [ ] `.gitignore` dosyası kontrol edildi
- [ ] `.env` dosyası git'e eklenmediği doğrulandı
- [ ] Tüm dosyalar commit edildi
- [ ] GitHub'da yeni repo oluşturuldu
- [ ] Remote origin eklendi
- [ ] Kod GitHub'a push edildi (`git push -u origin main`)

### ✅ Backend Environment Variables

Render.com'da backend için aşağıdaki değişkenleri ayarladınız mı?

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `HOST` = `0.0.0.0`
- [ ] `JWT_SECRET` = (Generate ile oluşturulmuş güçlü bir değer)
- [ ] `JWT_EXPIRE` = `7d`
- [ ] `DATABASE_URL` = (Files.io bilgilerinizle)
- [ ] `DB_SSL` = `true`
- [ ] `FRONTEND_URL` = (Frontend URL'iniz - sonradan güncellenecek)

### ✅ Backend Deployment

- [ ] Render Dashboard'da "New Web Service" oluşturuldu
- [ ] GitHub repository bağlandı
- [ ] Service Name: `farmapp-backend`
- [ ] Region: Frankfurt (veya yakın)
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Environment: Node
- [ ] Plan: Free
- [ ] Environment variables eklendi
- [ ] Deploy başarıyla tamamlandı
- [ ] Backend URL not edildi: _______________
- [ ] Health check çalışıyor: `https://your-backend.onrender.com/`
- [ ] API response alındı (JSON)
- [ ] Logs'da veritabanı bağlantısı başarılı

### ✅ Frontend Environment Variables

Render.com'da frontend için:

- [ ] `REACT_APP_API_URL` = `https://farmapp-backend.onrender.com/api`

### ✅ Frontend Deployment

- [ ] Render Dashboard'da "New Static Site" oluşturuldu
- [ ] Aynı GitHub repository seçildi
- [ ] Service Name: `farmapp-frontend`
- [ ] Region: Frankfurt
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `build`
- [ ] Environment variables eklendi
- [ ] Deploy başarıyla tamamlandı
- [ ] Frontend URL not edildi: _______________
- [ ] Tarayıcıda açılıyor ve login ekranı görünüyor

### ✅ CORS ve Final Ayarlar

- [ ] Backend'de `FRONTEND_URL` güncellendi (frontend URL'i ile)
- [ ] Backend manual olarak yeniden deploy edildi
- [ ] CORS hatası yok (browser console kontrol)
- [ ] API istekleri başarılı

### ✅ Fonksiyonel Test

- [ ] Frontend login ekranı açılıyor
- [ ] Kullanıcı kaydı oluşturulabiliyor
- [ ] Login başarılı
- [ ] Dashboard açılıyor
- [ ] API çağrıları çalışıyor
- [ ] Veriler veritabanına kaydediliyor
- [ ] Veriler veritabanından okunuyor

### ✅ Production Güvenlik

- [ ] JWT_SECRET güçlü ve benzersiz
- [ ] Veritabanı şifresi güçlü
- [ ] `.env` dosyaları git'de yok
- [ ] Hassas bilgiler loglanmıyor
- [ ] SSL/HTTPS aktif (Render otomatik)
- [ ] CORS sadece belirlenen origin'lere izin veriyor

### ✅ Monitoring ve Bakım

- [ ] Render Dashboard'da auto-deploy aktif
- [ ] Backend logs düzenli kontrol ediliyor
- [ ] Frontend build logs kontrol edildi
- [ ] Free tier limitler bilinmekte:
  - 750 saat/ay backend
  - 15 dakika idle sonrası sleep
- [ ] İsteğe bağlı: Uptime monitor kuruldu (UptimeRobot, etc.)

---

## 🚨 Sorun Giderme

### Veritabanı Bağlantı Hatası

```
ECONNREFUSED or Connection timeout
```

**Çözüm:**
1. DATABASE_URL formatını kontrol edin
2. Files.io dashboard'dan veritabanı durumunu kontrol edin
3. IP whitelist varsa Render IP'lerini ekleyin
4. DB_SSL=true olduğundan emin olun

### CORS Hatası

```
Access to fetch blocked by CORS policy
```

**Çözüm:**
1. Backend'de FRONTEND_URL doğru mu?
2. Frontend'de REACT_APP_API_URL doğru mu?
3. `/api` suffix var mı?
4. Backend'i yeniden deploy edin

### 502 Bad Gateway

**Çözüm:**
1. Backend logs'ları kontrol edin
2. PORT=10000 ve HOST=0.0.0.0 olmalı
3. Build başarılı mı kontrol edin

### API 404 Hatası

**Çözüm:**
1. API URL'de `/api` suffix var mı?
2. Backend route'ları doğru mu?
3. Browser network tab'ında request URL'i kontrol edin

---

## 📞 Destek Kaynakları

- **Render Docs:** https://render.com/docs
- **Files.io Support:** https://www.files.io/support
- **Render Community:** https://community.render.com

---

**Son Güncelleme:** {{ date }}
**Deployment Durumu:** [ ] Başarılı  [ ] Devam Ediyor  [ ] Hata Var
