-- Set the default admin password to a simpler value: admin123
-- bcrypt (strength 12) hash. Change after first login in production.

UPDATE users
SET password_hash = '$2b$12$saCFWjHbt0UraK5tFOZ.6ebBDgUavMm70CQhKU2E/8Y9D2OrB1a66'
WHERE email = 'admin@brightsmile.com';
