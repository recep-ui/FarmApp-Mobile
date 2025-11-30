-- Farm Management System Database Schema

-- Kullanıcılar Tablosu
CREATE TABLE IF NOT EXISTS users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role VARCHAR(20) DEFAULT 'user',
    is_active TINYINT(1) DEFAULT 1,
    email_verified TINYINT(1) DEFAULT 0,
    verification_token VARCHAR(255),
    verification_token_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ahırlar Tablosu
CREATE TABLE IF NOT EXISTS barns (
    barn_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Hayvanlar Tablosu
CREATE TABLE IF NOT EXISTS animals (
    animal_id INT PRIMARY KEY AUTO_INCREMENT,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100),
    birth_date DATE,
    gender VARCHAR(10),
    tag_number VARCHAR(50) UNIQUE,
    mother_id INT,
    father_id INT,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    barn_id INT,
    total_production DECIMAL(10, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    FOREIGN KEY (barn_id) REFERENCES barns(barn_id) ON DELETE SET NULL,
    FOREIGN KEY (mother_id) REFERENCES animals(animal_id) ON DELETE SET NULL,
    FOREIGN KEY (father_id) REFERENCES animals(animal_id) ON DELETE SET NULL
);

-- Sağlık Kayıtları Tablosu
CREATE TABLE IF NOT EXISTS health_records (
    health_record_id INT PRIMARY KEY AUTO_INCREMENT,
    animal_id INT NOT NULL,
    date DATE NOT NULL,
    diagnosis TEXT,
    treatment_applied TEXT,
    medications TEXT,
    veterinarian_info VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animals(animal_id) ON DELETE CASCADE
);

-- Besleme Kayıtları Tablosu
CREATE TABLE IF NOT EXISTS feeding_records (
    feeding_record_id INT PRIMARY KEY AUTO_INCREMENT,
    animal_id INT NOT NULL,
    date DATE NOT NULL,
    feed_type VARCHAR(100) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animals(animal_id) ON DELETE CASCADE
);

-- Üretim Kayıtları Tablosu
CREATE TABLE IF NOT EXISTS production_records (
    production_record_id INT PRIMARY KEY AUTO_INCREMENT,
    animal_id INT NOT NULL,
    date DATE NOT NULL,
    product_type VARCHAR(50) NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    quality VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES animals(animal_id) ON DELETE CASCADE
);

-- Çalışanlar Tablosu
CREATE TABLE IF NOT EXISTS employees (
    employee_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    position VARCHAR(100),
    contact_info VARCHAR(255),
    hire_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Görevler Tablosu
CREATE TABLE IF NOT EXISTS tasks (
    task_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_employee_id INT,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date DATE,
    status VARCHAR(50) DEFAULT 'pending',
    completed_date TIMESTAMP NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    FOREIGN KEY (assigned_employee_id) REFERENCES employees(employee_id) ON DELETE SET NULL
);

-- İndeksler (Performans için)
CREATE INDEX idx_animals_species ON animals(species);
CREATE INDEX idx_animals_barn ON animals(barn_id);
CREATE INDEX idx_health_animal ON health_records(animal_id);
CREATE INDEX idx_health_date ON health_records(date);
CREATE INDEX idx_feeding_animal ON feeding_records(animal_id);
CREATE INDEX idx_feeding_date ON feeding_records(date);
CREATE INDEX idx_production_animal ON production_records(animal_id);
CREATE INDEX idx_production_date ON production_records(date);
CREATE INDEX idx_tasks_employee ON tasks(assigned_employee_id);
CREATE INDEX idx_tasks_status ON tasks(status);
