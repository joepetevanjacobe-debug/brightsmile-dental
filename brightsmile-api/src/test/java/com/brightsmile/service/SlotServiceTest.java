package com.brightsmile.service;

import com.brightsmile.model.dto.SlotResponse;
import com.brightsmile.model.entity.*;
import com.brightsmile.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.*;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SlotServiceTest {

    @Mock ScheduleRepository    scheduleRepository;
    @Mock AppointmentRepository appointmentRepository;
    @Mock BlockedSlotRepository blockedSlotRepository;
    @Mock DoctorRepository      doctorRepository;

    @InjectMocks SlotService slotService;

    private Doctor doctor;

    @BeforeEach
    void setUp() {
        User user = User.builder().id(1L).name("Dr. Smith").email("dr@clinic.com")
                .passwordHash("hash").role(User.Role.DOCTOR).build();
        doctor = Doctor.builder().id(1L).user(user).specialty("General").build();
    }

    @Test
    void getAvailableSlots_returnsEmptyWhenDoctorNotWorking() {
        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));
        when(scheduleRepository.findByDoctorIdAndDayOfWeek(eq(1L), any()))
                .thenReturn(Optional.empty());

        List<SlotResponse> slots = slotService.getAvailableSlots(LocalDate.now().plusDays(10), 1L);

        assertThat(slots).isEmpty();
    }

    @Test
    void getAvailableSlots_generatesCorrectNumberOfSlots() {
        LocalDate future = LocalDate.now().plusDays(10);
        Schedule schedule = Schedule.builder()
                .doctor(doctor)
                .dayOfWeek(future.getDayOfWeek())
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(11, 0))
                .slotDurationMin(30)
                .build();

        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));
        when(scheduleRepository.findByDoctorIdAndDayOfWeek(eq(1L), any()))
                .thenReturn(Optional.of(schedule));
        when(appointmentRepository.findByDoctorAndStartDatetimeBetween(any(), any(), any()))
                .thenReturn(List.of());
        when(blockedSlotRepository.findByDoctorIdAndStartDatetimeBetween(any(), any(), any()))
                .thenReturn(List.of());

        List<SlotResponse> slots = slotService.getAvailableSlots(future, 1L);

        // 9:00, 9:30, 10:00, 10:30 → 4 slots
        assertThat(slots).hasSize(4);
        assertThat(slots).allMatch(SlotResponse::isAvailable);
    }

    @Test
    void getAvailableSlots_marksBookedSlotsUnavailable() {
        LocalDate future = LocalDate.now().plusDays(10);
        Schedule schedule = Schedule.builder()
                .doctor(doctor)
                .dayOfWeek(future.getDayOfWeek())
                .startTime(LocalTime.of(9, 0))
                .endTime(LocalTime.of(11, 0))
                .slotDurationMin(30)
                .build();

        User patient = User.builder().id(2L).name("Jane").email("jane@test.com")
                .passwordHash("h").role(User.Role.PATIENT).build();
        DentalService svc = DentalService.builder().id(1L).name("Cleaning")
                .durationMin(30).price(java.math.BigDecimal.valueOf(100))
                .category(DentalService.Category.PREVENTIVE).build();

        Appointment booked = Appointment.builder()
                .id(1L).doctor(doctor).service(svc).patient(patient)
                .startDatetime(future.atTime(9, 0))
                .status(Appointment.Status.CONFIRMED)
                .build();

        when(doctorRepository.findById(1L)).thenReturn(Optional.of(doctor));
        when(scheduleRepository.findByDoctorIdAndDayOfWeek(eq(1L), any()))
                .thenReturn(Optional.of(schedule));
        when(appointmentRepository.findByDoctorAndStartDatetimeBetween(any(), any(), any()))
                .thenReturn(List.of(booked));
        when(blockedSlotRepository.findByDoctorIdAndStartDatetimeBetween(any(), any(), any()))
                .thenReturn(List.of());

        List<SlotResponse> slots = slotService.getAvailableSlots(future, 1L);

        assertThat(slots).hasSize(4);
        SlotResponse nineAm = slots.stream()
                .filter(s -> s.getDatetime().getHour() == 9 && s.getDatetime().getMinute() == 0)
                .findFirst().orElseThrow();
        assertThat(nineAm.isAvailable()).isFalse();

        long availableCount = slots.stream().filter(SlotResponse::isAvailable).count();
        assertThat(availableCount).isEqualTo(3);
    }
}
