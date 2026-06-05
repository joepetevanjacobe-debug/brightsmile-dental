-- BrightSmile Dental — Initial Schema

CREATE TABLE IF NOT EXISTS users (
    id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
    name               VARCHAR(120)  NOT NULL,
    email              VARCHAR(255)  NOT NULL UNIQUE,
    password_hash      VARCHAR(255)  NOT NULL,
    phone              VARCHAR(30),
    role               ENUM('ADMIN','RECEPTIONIST','DOCTOR','PATIENT') NOT NULL DEFAULT 'PATIENT',
    verified           BOOLEAN       NOT NULL DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
);

CREATE TABLE IF NOT EXISTS doctors (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT        NOT NULL UNIQUE,
    specialty   VARCHAR(120),
    bio         TEXT,
    credentials VARCHAR(255),
    photo_url   VARCHAR(512),
    visible     BOOLEAN       NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_doctor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dental_services (
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    name         VARCHAR(120)   NOT NULL,
    description  TEXT,
    category     ENUM('COSMETIC','RESTORATIVE','PREVENTIVE','ORTHODONTIC','PEDIATRIC','GENERAL') NOT NULL,
    duration_min INT            NOT NULL DEFAULT 30,
    price        DECIMAL(10,2)  NOT NULL,
    icon         VARCHAR(100),
    visible      BOOLEAN        NOT NULL DEFAULT TRUE,
    sort_order   INT            NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS schedules (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id         BIGINT    NOT NULL,
    day_of_week       ENUM('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY') NOT NULL,
    start_time        TIME      NOT NULL,
    end_time          TIME      NOT NULL,
    slot_duration_min INT       NOT NULL DEFAULT 30,
    CONSTRAINT fk_schedule_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    UNIQUE KEY uq_doctor_day (doctor_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS blocked_slots (
    id             BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id      BIGINT    NOT NULL,
    start_datetime DATETIME  NOT NULL,
    end_datetime   DATETIME  NOT NULL,
    reason         VARCHAR(255),
    CONSTRAINT fk_blocked_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS appointments (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_user_id BIGINT       NULL,
    doctor_id       BIGINT       NOT NULL,
    service_id      BIGINT       NOT NULL,
    start_datetime  DATETIME     NOT NULL,
    end_datetime    DATETIME,
    status          ENUM('PENDING','CONFIRMED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
    guest_name      VARCHAR(120),
    guest_email     VARCHAR(255),
    guest_phone     VARCHAR(30),
    notes           TEXT,
    reminder_sent   BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appt_patient  FOREIGN KEY (patient_user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_appt_doctor   FOREIGN KEY (doctor_id)       REFERENCES doctors(id),
    CONSTRAINT fk_appt_service  FOREIGN KEY (service_id)      REFERENCES dental_services(id),
    INDEX idx_appt_datetime (start_datetime),
    INDEX idx_appt_status   (status)
);

CREATE TABLE IF NOT EXISTS contacts (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(120)  NOT NULL,
    email      VARCHAR(255)  NOT NULL,
    phone      VARCHAR(30),
    message    TEXT          NOT NULL,
    created_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed: default admin user  (password: Admin@1234 — change immediately)
INSERT INTO users (name, email, password_hash, role, verified)
VALUES ('Admin', 'admin@brightsmile.com',
        '$2a$12$9e2IJ3lOvjhv6wZV6RU2bOVY2.gMI8KIkCx3.2eMFIl5zVLJvHXdC',
        'ADMIN', TRUE);

-- Seed: sample dental services
INSERT INTO dental_services (name, description, category, duration_min, price, icon, sort_order) VALUES
('Dental Cleaning',    'Professional cleaning to remove plaque and tartar.',         'PREVENTIVE',   60,  120.00, 'shield-check',   1),
('Teeth Whitening',    'Advanced whitening to brighten your smile by several shades.','COSMETIC',     90,  350.00, 'sparkles',       2),
('Dental Braces',      'Traditional and clear aligner orthodontic treatment.',        'ORTHODONTIC',  60,  3500.00,'align-center',   3),
('Dental Implants',    'Permanent tooth replacement with titanium implants.',         'RESTORATIVE', 120, 2500.00, 'anchor',         4),
('Root Canal Therapy', 'Pain-free root canal treatment to save infected teeth.',      'RESTORATIVE',  90,  900.00, 'activity',       5),
('Pediatric Dentistry','Gentle, fun dental care designed for children.',              'PEDIATRIC',    45,   80.00, 'smile',          6);
