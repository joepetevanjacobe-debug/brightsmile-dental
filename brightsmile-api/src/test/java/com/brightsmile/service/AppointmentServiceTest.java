package com.brightsmile.service;

import com.brightsmile.model.dto.AppointmentRequest;
import com.brightsmile.model.dto.AppointmentResponse;
import com.brightsmile.model.entity.*;
import com.brightsmile.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock AppointmentRepository    appointmentRepository;
    @Mock DoctorRepository         doctorRepository;
    @Mock DentalServiceRepository  dentalServiceRepository;
    @Mock UserRepository           userRepository;
    @Mock EmailService             emailService;

    @InjectMocks AppointmentService appointmentService;

    private Doctor      doctor;
    private DentalService service;
    private User        patient;

    @BeforeEach
    void setUp() {
        User docUser = User.builder().id(1L).name("Dr. Smith").email("dr@clinic.com")
                .passwordHash("hash").role(User.Role.DOCTOR).build();
        doctor = Doctor.builder().id(1L).user(docUser).specialty("General").build();

        service = DentalService.builder().id(1L).name("Cleaning")
                .durationMin(60).price(BigDecimal.valueOf(120))
                .category(DentalService.Category.PREVENTIVE).build();

        patient = User.builder().id(2L).name("Jane Doe").email("jane@test.com")
                .passwordHash("hash").role(User.Role.PATIENT).build();
    }

    @Test
    void book_asGuest_savesAppointmentAndSendsEmail() {
        AppointmentRequest req = new AppointmentRequest();
        req.setDoctorId(1L);
        req.setServiceId(1L);
        req.setStartDatetime(LocalDateTime.now().plusDays(3));
        req.setGuestName("John Guest");
        req.setGuestEmail("john@guest.com");
        req.setGuestPhone("5551234567");

        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));
        when(dentalServiceRepository.findById(1L)).thenReturn(Optional.of(service));

        Appointment saved = Appointment.builder()
                .id(10L).doctor(doctor).service(service)
                .guestName("John Guest").guestEmail("john@guest.com").guestPhone("5551234567")
                .startDatetime(req.getStartDatetime())
                .endDatetime(req.getStartDatetime().plusMinutes(60))
                .status(Appointment.Status.PENDING)
                .build();
        when(appointmentRepository.save(any())).thenReturn(saved);

        AppointmentResponse resp = appointmentService.book(req, null);

        assertThat(resp.getId()).isEqualTo(10L);
        assertThat(resp.getPatientName()).isEqualTo("John Guest");
        assertThat(resp.getStatus()).isEqualTo(Appointment.Status.PENDING);
        verify(emailService).sendBookingConfirmation(saved);
    }

    @Test
    void book_asPatient_linksPatientRecord() {
        AppointmentRequest req = new AppointmentRequest();
        req.setDoctorId(1L);
        req.setServiceId(1L);
        req.setStartDatetime(LocalDateTime.now().plusDays(5));

        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));
        when(dentalServiceRepository.findById(1L)).thenReturn(Optional.of(service));
        when(userRepository.findByEmail("jane@test.com")).thenReturn(Optional.of(patient));

        Appointment saved = Appointment.builder()
                .id(11L).doctor(doctor).service(service).patient(patient)
                .startDatetime(req.getStartDatetime())
                .endDatetime(req.getStartDatetime().plusMinutes(60))
                .status(Appointment.Status.PENDING)
                .build();
        when(appointmentRepository.save(any())).thenReturn(saved);

        AppointmentResponse resp = appointmentService.book(req, "jane@test.com");

        assertThat(resp.getPatientName()).isEqualTo("Jane Doe");
        verify(emailService).sendBookingConfirmation(saved);
    }

    @Test
    void cancelByPatient_throwsWhenNotOwner() {
        Appointment appt = Appointment.builder()
                .id(5L).doctor(doctor).service(service).patient(patient)
                .startDatetime(LocalDateTime.now().plusDays(2))
                .status(Appointment.Status.CONFIRMED)
                .build();

        when(appointmentRepository.findById(5L)).thenReturn(Optional.of(appt));

        assertThatThrownBy(() -> appointmentService.cancelByPatient(5L, "other@test.com"))
                .isInstanceOf(AccessDeniedException.class);
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void cancelByPatient_successfullyCancels() {
        Appointment appt = Appointment.builder()
                .id(6L).doctor(doctor).service(service).patient(patient)
                .startDatetime(LocalDateTime.now().plusDays(2))
                .status(Appointment.Status.CONFIRMED)
                .build();

        when(appointmentRepository.findById(6L)).thenReturn(Optional.of(appt));
        when(appointmentRepository.save(any())).thenReturn(appt);

        appointmentService.cancelByPatient(6L, "jane@test.com");

        assertThat(appt.getStatus()).isEqualTo(Appointment.Status.CANCELLED);
        verify(emailService).sendCancellationEmail(appt);
    }

    @Test
    void updateStatus_changesStatusCorrectly() {
        Appointment appt = Appointment.builder()
                .id(7L).doctor(doctor).service(service).patient(patient)
                .startDatetime(LocalDateTime.now().plusDays(1))
                .status(Appointment.Status.PENDING)
                .build();

        when(appointmentRepository.findById(7L)).thenReturn(Optional.of(appt));
        when(appointmentRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        AppointmentResponse resp = appointmentService.updateStatus(7L, Appointment.Status.CONFIRMED);

        assertThat(resp.getStatus()).isEqualTo(Appointment.Status.CONFIRMED);
    }
}
