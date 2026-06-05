package com.brightsmile.service;

import com.brightsmile.model.dto.DoctorRequest;
import com.brightsmile.model.entity.Doctor;
import com.brightsmile.model.entity.User;
import com.brightsmile.repository.DoctorRepository;
import com.brightsmile.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<Doctor> getAllVisible() {
        return doctorRepository.findByVisibleTrue();
    }

    public List<Doctor> getAll() {
        return doctorRepository.findAll();
    }

    public Doctor getById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
    }

    @Transactional
    public Doctor create(DoctorRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(User.Role.DOCTOR)
                .verified(true)
                .build();
        userRepository.save(user);

        Doctor doctor = Doctor.builder()
                .user(user)
                .specialty(req.getSpecialty())
                .bio(req.getBio())
                .credentials(req.getCredentials())
                .photoUrl(req.getPhotoUrl())
                .visible(req.isVisible())
                .build();
        return doctorRepository.save(doctor);
    }

    @Transactional
    public Doctor update(Long id, DoctorRequest req) {
        Doctor doctor = getById(id);
        doctor.setSpecialty(req.getSpecialty());
        doctor.setBio(req.getBio());
        doctor.setCredentials(req.getCredentials());
        doctor.setPhotoUrl(req.getPhotoUrl());
        doctor.setVisible(req.isVisible());

        User user = doctor.getUser();
        user.setName(req.getName());
        user.setPhone(req.getPhone());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        }
        userRepository.save(user);
        return doctorRepository.save(doctor);
    }

    @Transactional
    public void delete(Long id) {
        Doctor doctor = getById(id);
        doctorRepository.delete(doctor);
    }
}
