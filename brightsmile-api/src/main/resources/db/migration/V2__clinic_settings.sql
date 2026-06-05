CREATE TABLE IF NOT EXISTS clinic_settings (
    setting_key   VARCHAR(100) PRIMARY KEY,
    setting_value TEXT
);

INSERT INTO clinic_settings (setting_key, setting_value) VALUES
('clinic.name',              'BrightSmile Dental'),
('clinic.phone',             '(555) 123-4567'),
('clinic.email',             'hello@brightsmile.com'),
('clinic.address',           '123 Smile Avenue, Suite 200, New York, NY 10001'),
('notifications.email_on_booking', 'true'),
('notifications.reminder_24h',     'true'),
('notifications.reminder_2h',      'true'),
('notifications.sms_enabled',      'false')
ON DUPLICATE KEY UPDATE setting_key = setting_key;
