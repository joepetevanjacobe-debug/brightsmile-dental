-- Capture patient age and address at booking time
ALTER TABLE appointments
    ADD COLUMN guest_age     INT          NULL AFTER guest_phone,
    ADD COLUMN guest_address VARCHAR(255) NULL AFTER guest_age;
