CREATE DATABASE IF NOT EXISTS visagio
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE visagio;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('professional', 'client', 'admin') NOT NULL DEFAULT 'client',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id INT NULL,
    user_id INT NULL,
    name VARCHAR(120) NOT NULL,
    phone VARCHAR(20),
    birth_date DATE,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_clients_professional
        FOREIGN KEY (professional_id) REFERENCES users(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_clients_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS facial_analyses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    face_shape VARCHAR(50),
    hair_type VARCHAR(50),
    hair_texture VARCHAR(50),
    hair_density VARCHAR(50),
    current_length VARCHAR(50),
    image_url VARCHAR(500),
    observations TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_analyses_client
        FOREIGN KEY (client_id) REFERENCES clients(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    analysis_id INT NOT NULL,
    category ENUM(
        'haircut',
        'beard',
        'coloring',
        'highlights',
        'hydration',
        'treatment'
    ) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    technical_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recommendations_analysis
        FOREIGN KEY (analysis_id) REFERENCES facial_analyses(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    professional_id INT NOT NULL,
    client_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    status ENUM(
        'scheduled',
        'completed',
        'cancelled'
    ) NOT NULL DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointments_professional
        FOREIGN KEY (professional_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_appointments_client
        FOREIGN KEY (client_id) REFERENCES clients(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS hair_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT NOT NULL,
    procedure_type VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    procedure_date DATE NOT NULL,
    next_maintenance_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hair_history_client
        FOREIGN KEY (client_id) REFERENCES clients(id)
        ON DELETE CASCADE
);
