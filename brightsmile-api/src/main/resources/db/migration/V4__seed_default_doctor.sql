-- Seed a default doctor (with login user) and a weekly schedule so that
-- appointments can be booked out of the box. Without at least one doctor the
-- booking flow and the admin "Add Appointment" action fail with "Doctor not found".
-- The doctor user can log in with password: admin123  (same bcrypt as the admin seed).

INSERT INTO users (name, email, password_hash, role, verified)
SELECT 'Maria Santos', 'dr.santos@confidentdentalcare.com',
       '$2b$12$saCFWjHbt0UraK5tFOZ.6ebBDgUavMm70CQhKU2E/8Y9D2OrB1a66',
       'DOCTOR', TRUE
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'dr.santos@confidentdentalcare.com');

INSERT INTO doctors (user_id, specialty, bio, credentials, visible)
SELECT u.id, 'General Dentistry',
       'Experienced general dentist providing gentle, comprehensive care.',
       'DMD', TRUE
FROM users u
WHERE u.email = 'dr.santos@confidentdentalcare.com'
  AND NOT EXISTS (SELECT 1 FROM doctors d WHERE d.user_id = u.id);

-- Weekly schedule: Monday–Saturday, 09:00–17:00, 60-minute slots.
INSERT INTO schedules (doctor_id, day_of_week, start_time, end_time, slot_duration_min)
SELECT d.id, dow.day, '09:00:00', '17:00:00', 60
FROM doctors d
JOIN users u ON u.id = d.user_id AND u.email = 'dr.santos@confidentdentalcare.com'
CROSS JOIN (
    SELECT 'MONDAY' AS day UNION ALL SELECT 'TUESDAY' UNION ALL SELECT 'WEDNESDAY'
    UNION ALL SELECT 'THURSDAY' UNION ALL SELECT 'FRIDAY' UNION ALL SELECT 'SATURDAY'
) dow
WHERE NOT EXISTS (
    SELECT 1 FROM schedules s WHERE s.doctor_id = d.id AND s.day_of_week = dow.day
);
