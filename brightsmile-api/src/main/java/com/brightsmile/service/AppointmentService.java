package com.brightsmile.service;

import com.brightsmile.model.dto.AppointmentRequest;
import com.brightsmile.model.dto.AppointmentResponse;
import com.brightsmile.model.entity.*;
import com.brightsmile.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final DentalServiceRepository dentalServiceRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Transactional
    public AppointmentResponse book(AppointmentRequest req, String patientEmail) {
        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        DentalService service = dentalServiceRepository.findById(req.getServiceId())
                .orElseThrow(() -> new IllegalArgumentException("Service not found"));

        Appointment.AppointmentBuilder builder = Appointment.builder()
                .doctor(doctor)
                .service(service)
                .startDatetime(req.getStartDatetime())
                .endDatetime(req.getStartDatetime().plusMinutes(service.getDurationMin()))
                .notes(req.getNotes())
                .status(Appointment.Status.PENDING);

        if (patientEmail != null) {
            User patient = userRepository.findByEmail(patientEmail).orElse(null);
            builder.patient(patient);
        } else {
            builder.guestName(req.getGuestName())
                   .guestEmail(req.getGuestEmail())
                   .guestPhone(req.getGuestPhone())
                   .guestAge(req.getGuestAge())
                   .guestAddress(req.getGuestAddress());
        }

        Appointment saved = appointmentRepository.save(builder.build());
        emailService.sendBookingConfirmation(saved);
        return AppointmentResponse.from(saved);
    }

    public List<AppointmentResponse> getPatientAppointments(String email) {
        User patient = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return appointmentRepository.findByPatientId(patient.getId())
                .stream().map(AppointmentResponse::from).toList();
    }

    @Transactional
    public void cancelByPatient(Long appointmentId, String email) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        if (appt.getPatient() == null || !appt.getPatient().getEmail().equals(email)) {
            throw new AccessDeniedException("Not your appointment");
        }
        appt.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appt);
        emailService.sendCancellationEmail(appt);
    }

    // Admin operations
    public Page<AppointmentResponse> findFiltered(Appointment.Status status, Long doctorId,
            Long serviceId, LocalDateTime from, LocalDateTime to, Pageable pageable) {
        if (from == null) from = LocalDateTime.now().minusYears(1);
        if (to == null) to = LocalDateTime.now().plusYears(1);
        return appointmentRepository
                .findFiltered(status, doctorId, serviceId, from, to, pageable)
                .map(AppointmentResponse::from);
    }

    public AppointmentResponse getById(Long id) {
        return AppointmentResponse.from(appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found")));
    }

    @Transactional
    public AppointmentResponse updateStatus(Long id, Appointment.Status status) {
        Appointment appt = appointmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
        appt.setStatus(status);
        return AppointmentResponse.from(appointmentRepository.save(appt));
    }

    @Transactional
    public void delete(Long id) {
        appointmentRepository.deleteById(id);
    }
}
