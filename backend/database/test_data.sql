-- Test Verileri ve İlk Admin Kullanıcısı
-- Bu dosyayı FILES.IO phpMyAdmin'de çalıştırın

-- Admin kullanıcısı oluştur (şifre: admin123)
-- Şifre bcrypt ile hash'lenmiş: admin123
-- Hash: $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW
INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active, email_verified)
VALUES 
('admin', 'admin@farmapp.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Admin', 'User', 'admin', 1, 1),
('demo', 'demo@farmapp.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'Demo', 'User', 'user', 1, 1)
ON DUPLICATE KEY UPDATE username=username;

-- Örnek Ahırlar
INSERT INTO barns (name, capacity, location) VALUES
('Ahır 1', 50, 'Kuzey Bölge'),
('Ahır 2', 30, 'Güney Bölge'),
('Ahır 3', 40, 'Doğu Bölge')
ON DUPLICATE KEY UPDATE name=name;

-- Örnek Hayvanlar
INSERT INTO animals (species, breed, birth_date, gender, tag_number, barn_id, status) VALUES
('Cow', 'Holstein', '2022-01-15', 'Female', 'COW001', 1, 'alive'),
('Cow', 'Jersey', '2021-06-20', 'Female', 'COW002', 1, 'alive'),
('Sheep', 'Merino', '2023-03-10', 'Male', 'SHEEP001', 2, 'alive'),
('Chicken', 'Leghorn', '2023-08-05', 'Female', 'CHICK001', 3, 'alive'),
('Goat', 'Saanen', '2022-11-12', 'Female', 'GOAT001', 2, 'alive')
ON DUPLICATE KEY UPDATE tag_number=tag_number;

-- Örnek Çalışanlar
INSERT INTO employees (first_name, last_name, position, contact_info, hire_date, status) VALUES
('Ahmet', 'Yılmaz', 'Veteriner', '555-0101', '2020-01-15', 'active'),
('Ayşe', 'Demir', 'Bakım Görevlisi', '555-0102', '2021-03-20', 'active'),
('Mehmet', 'Kaya', 'Besici', '555-0103', '2022-06-10', 'active')
ON DUPLICATE KEY UPDATE first_name=first_name;

-- Örnek Görevler
INSERT INTO tasks (title, description, assigned_employee_id, due_date, status, priority) VALUES
('Ahır Temizliği', 'Ahır 1 genel temizlik', 2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'pending', 'high'),
('Veteriner Kontrolü', 'Tüm ineklerin rutin kontrolü', 1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'in_progress', 'medium'),
('Yem Stok Kontrolü', 'Yem deposu sayımı', 3, DATE_ADD(CURDATE(), INTERVAL 7 DAY), 'pending', 'low')
ON DUPLICATE KEY UPDATE title=title;

-- Örnek Sağlık Kayıtları
INSERT INTO health_records (animal_id, date, diagnosis, treatment_applied, veterinarian_info) VALUES
(1, CURDATE(), 'Rutin Kontrol', 'Vitamin takviyesi', 'Dr. Ahmet Yılmaz'),
(2, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Hafif enfeksiyon', 'Antibiyotik tedavisi', 'Dr. Ahmet Yılmaz')
ON DUPLICATE KEY UPDATE animal_id=animal_id;

-- Örnek Üretim Kayıtları
INSERT INTO production_records (animal_id, date, product_type, quantity, unit, quality) VALUES
(1, CURDATE(), 'Milk', 25.5, 'liters', 'Excellent'),
(2, CURDATE(), 'Milk', 22.0, 'liters', 'Good'),
(4, CURDATE(), 'Egg', 12.0, 'pieces', 'Grade A'),
(4, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Egg', 11.0, 'pieces', 'Grade A')
ON DUPLICATE KEY UPDATE animal_id=animal_id;

-- Örnek Besleme Kayıtları
INSERT INTO feeding_records (animal_id, date, feed_type, quantity, unit) VALUES
(1, CURDATE(), 'Silo Yemi', 15.5, 'kg'),
(2, CURDATE(), 'Silo Yemi', 14.0, 'kg'),
(3, CURDATE(), 'Ot', 8.0, 'kg'),
(4, CURDATE(), 'Tahıl', 0.5, 'kg')
ON DUPLICATE KEY UPDATE animal_id=animal_id;

-- Sorgu başarılı mesajı
SELECT 'Test verileri başarıyla eklendi!' as Message;
SELECT COUNT(*) as 'Toplam Kullanıcı' FROM users;
SELECT COUNT(*) as 'Toplam Hayvan' FROM animals;
SELECT COUNT(*) as 'Toplam Ahır' FROM barns;
SELECT COUNT(*) as 'Toplam Çalışan' FROM employees;
SELECT COUNT(*) as 'Toplam Görev' FROM tasks;
