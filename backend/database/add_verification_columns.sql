-- Email doğrulama kolonlarını ekle
-- Bu dosyayı phpMyAdmin'de SQL sekmesinde çalıştırın

ALTER TABLE Users 
ADD COLUMN email_verified TINYINT(1) DEFAULT 0 AFTER is_active,
ADD COLUMN verification_token VARCHAR(255) AFTER email_verified,
ADD COLUMN verification_token_expires TIMESTAMP AFTER verification_token;

-- Mevcut kullanıcıları doğrulanmış olarak işaretle
UPDATE Users SET email_verified = 1 WHERE username IN ('admin', 'recep');

-- Kontrol sorgusu
DESCRIBE Users;

SELECT user_id, username, email, email_verified, verification_token FROM Users;
