# Render.com Hızlı Başlangıç

## 🚀 5 Adımda Deployment

### 1️⃣ GitHub'a Yükle
```powershell
git add .
git commit -m "Add Render deployment config"
git push origin main
```

### 2️⃣ Render'da MySQL Oluştur
- https://dashboard.render.com → New + → MySQL
- Name: `farmapp-db`
- Database: `farm_management`
- Plan: Free
- **SQL dosyalarını çalıştır** (schema.sql, update_schema.sql)

### 3️⃣ Backend Deploy Et
- New + → Web Service → GitHub repo seçin
- Root Directory: `backend`
- Build: `npm install`
- Start: `npm start`
- Environment Variables:
  ```
  NODE_ENV=production
  DATABASE_URL=[MySQL'den kopyala]
  JWT_SECRET=güvenli-key-buraya
  FRONTEND_URL=https://farmapp-frontend.onrender.com
  ```

### 4️⃣ Frontend Deploy Et
- New + → Static Site → GitHub repo seçin
- Root Directory: `frontend`
- Build: `npm install && npm run build`
- Publish: `build`
- Environment Variables:
  ```
  REACT_APP_API_URL=https://farmapp-backend.onrender.com/api
  ```

### 5️⃣ Test Et
- Frontend URL'e git
- admin / password123 ile giriş yap
- ✅ Çalışıyor!

## 📋 Önemli Notlar

⚠️ **Free tier**: 15 dk inaktivite sonrası cold start (30-60 sn)
✅ **Otomatik deploy**: Git push sonrası otomatik güncellenir
🔒 **HTTPS**: Otomatik SSL sertifikası
📊 **Loglar**: Dashboard'dan tüm logları görebilirsiniz

## 🐛 Sorun mu var?

1. **Backend başlamıyor**: Logs'a bak, DATABASE_URL doğru mu?
2. **Frontend bağlanamıyor**: REACT_APP_API_URL doğru mu?
3. **Database hatası**: SQL dosyaları çalıştırıldı mı?

Detaylı rehber: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)
