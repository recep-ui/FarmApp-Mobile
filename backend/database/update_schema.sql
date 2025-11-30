-- Eksik kolonları eklemek için SQL komutları
-- Bu dosyayı phpMyAdmin'de SQL sekmesinde çalıştırın

-- 1. Users tablosuna is_active kolonu ekle
ALTER TABLE Users 
ADD COLUMN is_active TINYINT(1) DEFAULT 1 AFTER role;

-- 2. Animals tablosuna created_at kolonu ekle
ALTER TABLE Animals 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER registration_date;

-- 3. Tasks tablosuna created_at kolonu ekle
ALTER TABLE Tasks 
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER creation_date;

-- 4. Mevcut kayıtlardaki created_at değerlerini doldur
UPDATE Animals SET created_at = registration_date WHERE created_at IS NULL;
UPDATE Tasks SET created_at = creation_date WHERE created_at IS NULL;

-- Kontrol sorguları (isteğe bağlı)
-- Users tablosu yapısını kontrol et
DESCRIBE Users;

-- Animals tablosu yapısını kontrol et
DESCRIBE Animals;

-- Tasks tablosu yapısını kontrol et
DESCRIBE Tasks;

-- ============================================
-- ÖRNEK VERİLER
-- ============================================

-- 1. Kullanıcılar (Şifreler: password123)
-- Eğer kullanıcılar zaten varsa önce silelim
DELETE FROM Users WHERE username IN ('admin', 'recep');

INSERT INTO Users (username, email, password_hash, first_name, last_name, role, is_active) VALUES
('admin', 'admin@farm.com', '$2b$10$YQNlXdBHVfN/cXhx.hXOFOqNxKJ6pZCxHJ8kGvzQz5Y7qPZp8jXEm', 'Admin', 'User', 'admin', 1),
('recep', 'recep@farm.com', '$2b$10$YQNlXdBHVfN/cXhx.hXOFOqNxKJ6pZCxHJ8kGvzQz5Y7qPZp8jXEm', 'Recep', 'Yılmaz', 'user', 1);

-- 2. Ahırlar
INSERT INTO Barns (name, capacity, location) VALUES
('A Ahırı', 50, 'Kuzey Bölge'),
('B Ahırı', 30, 'Güney Bölge'),
('C Ahırı', 40, 'Doğu Bölge');

-- 3. Hayvanlar
INSERT INTO Animals (species, breed, birth_date, gender, tag_number, barn_id, total_production, status, created_at) VALUES
('Cow', 'Holstein', '2020-03-15', 'Female', 'COW-001', 1, 1250.50, 'alive', NOW()),
('Cow', 'Holstein', '2019-08-22', 'Female', 'COW-002', 1, 2100.75, 'alive', NOW()),
('Cow', 'Montofon', '2021-01-10', 'Male', 'COW-003', 1, 0, 'alive', NOW()),
('Sheep', 'Merino', '2021-06-05', 'Female', 'SHEEP-001', 2, 25.30, 'alive', NOW()),
('Sheep', 'Merino', '2020-11-18', 'Female', 'SHEEP-002', 2, 48.90, 'alive', NOW()),
('Sheep', 'Karakaş', '2021-04-20', 'Male', 'SHEEP-003', 2, 0, 'alive', NOW()),
('Chicken', 'Leghorn', '2022-09-12', 'Female', 'CHICK-001', 3, 180.00, 'alive', NOW()),
('Chicken', 'Rhode Island', '2022-08-25', 'Female', 'CHICK-002', 3, 195.00, 'alive', NOW()),
('Goat', 'Saanen', '2020-05-14', 'Female', 'GOAT-001', 3, 320.40, 'alive', NOW()),
('Goat', 'Saanen', '2021-02-28', 'Male', 'GOAT-002', 3, 0, 'alive', NOW());

-- 4. Çalışanlar
INSERT INTO Employees (first_name, last_name, position, contact_info, hire_date, status) VALUES
('Mehmet', 'Demir', 'Veteriner', '0532-111-2233', '2019-01-15', 'active'),
('Ayşe', 'Kaya', 'Ahır Sorumlusu', '0533-222-3344', '2020-03-20', 'active'),
('Ali', 'Yılmaz', 'Yem Uzmanı', '0534-333-4455', '2021-06-10', 'active'),
('Fatma', 'Öztürk', 'Bakım Görevlisi', '0535-444-5566', '2022-01-05', 'active');

-- 5. Görevler
INSERT INTO Tasks (title, description, assigned_employee_id, due_date, status, priority, created_at) VALUES
('COW-001 Aşılama', 'Holstein ineğine yıllık aşı uygulaması yapılacak', 1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), 'pending', 'high', NOW()),
('A Ahırı Temizlik', 'Haftalık genel temizlik ve dezenfeksiyon', 2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'in_progress', 'medium', NOW()),
('Yem Stoğu Kontrolü', 'Kış dönemi için yem stoğu planlaması', 3, DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'pending', 'medium', NOW()),
('Koyun Kırkımı', 'Merino koyunlarının yaz kırkımı', 4, DATE_ADD(CURDATE(), INTERVAL 10 DAY), 'pending', 'low', NOW()),
('Süt Üretimi Raporu', 'Aylık süt üretim raporunun hazırlanması', 1, CURDATE(), 'completed', 'high', NOW());

-- 6. Sağlık Kayıtları
INSERT INTO Health_Records (animal_id, date, diagnosis, treatment_applied, medications, veterinarian_info, notes) VALUES
(1, '2024-11-01', 'Rutin Kontrol', 'Genel muayene yapıldı', 'Multivitamin', 'Dr. Mehmet Demir', 'Sağlık durumu iyi'),
(2, '2024-10-15', 'Ayak Yarası', 'Yara temizliği ve pansuman', 'Antibiyotik Merhem', 'Dr. Mehmet Demir', 'İyileşme süreci takip edilecek'),
(4, '2024-11-10', 'Parazit Tedavisi', 'İç parazit ilacı uygulandı', 'Albendazol', 'Dr. Mehmet Demir', 'Başarılı'),
(7, '2024-11-05', 'Solunum Yolu Enfeksiyonu', 'Antibiyotik tedavisi başlandı', 'Amoksisilin', 'Dr. Mehmet Demir', '7 gün tedavi süresi');

-- 7. Besleme Kayıtları
INSERT INTO Feeding_Records (animal_id, date, feed_type, quantity, unit, notes) VALUES
(1, CURDATE(), 'Karma Yem', 25.5, 'kg', 'Sabah besleme'),
(2, CURDATE(), 'Karma Yem', 23.0, 'kg', 'Sabah besleme'),
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Saman', 15.0, 'kg', 'Akşam besleme'),
(4, CURDATE(), 'Kuru Ot', 2.5, 'kg', 'Günlük ot'),
(5, CURDATE(), 'Kuru Ot', 2.8, 'kg', 'Günlük ot'),
(7, CURDATE(), 'Tavuk Yemi', 0.15, 'kg', 'Günlük yem'),
(8, CURDATE(), 'Tavuk Yemi', 0.14, 'kg', 'Günlük yem');

-- 8. Üretim Kayıtları
INSERT INTO Production_Records (animal_id, date, product_type, quantity, unit, quality, notes) VALUES
(1, CURDATE(), 'Milk', 28.5, 'litre', 'A', 'Sabah sağımı'),
(2, CURDATE(), 'Milk', 32.0, 'litre', 'A', 'Sabah sağımı'),
(1, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Milk', 27.8, 'litre', 'A', 'Akşam sağımı'),
(2, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Milk', 31.5, 'litre', 'A', 'Akşam sağımı'),
(4, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Wool', 3.2, 'kg', 'B', 'Yaz kırkımı'),
(5, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Wool', 3.8, 'kg', 'A', 'Yaz kırkımı'),
(7, CURDATE(), 'Egg', 1, 'adet', 'A', 'Günlük'),
(8, CURDATE(), 'Egg', 1, 'adet', 'A', 'Günlük'),
(7, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Egg', 1, 'adet', 'A', 'Günlük'),
(9, CURDATE(), 'Milk', 4.5, 'litre', 'B', 'Keçi sütü');
