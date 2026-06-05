package com.brightsmile.service;

import com.brightsmile.model.dto.SlotResponse;
import com.brightsmile.model.entity.Appointment;
import com.brightsmile.model.entity.BlockedSlot;
import com.brightsmile.model.entity.Doctor;
import com.brightsmile.model.entity.Schedule;
import com.brightsmile.repository.AppointmentRepository;
import com.brightsmile.repository.BlockedSlotRepository;
import com.brightsmile.repository.DoctorRepository;
import com.brightsmile.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SlotService {

    private final ScheduleRepository scheduleRepository;
    private final AppointmentRepository appointmentRepository;
    private final BlockedSlotRepository blockedSlotRepository;
    private final DoctorRepository doctorRepository;

    public List<SlotResponse> getAvailableSlots(LocalDate date, Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        Optional<Schedule> scheduleOpt = scheduleRepository
                .findByDoctorIdAndDayOfWeek(doctorId, date.getDayOfWeek());

        if (scheduleOpt.isEmpty()) {
            return List.of(); // Doctor doesn't work this day
        }

        Schedule schedule = scheduleOpt.get();
        int slotDuration = schedule.getSlotDurationMin();

        // Generate all potential slots for the day
        List<LocalDateTime> allSlots = generateSlots(date, schedule.getStartTime(),
                schedule.getEndTime(), slotDuration);

        // Fetch booked appointments for this doctor on this date
        LocalDateTime dayStart = date.atStartOfDay();
        LocalDateTime dayEnd = date.atTime(23, 59, 59);
        List<Appointment> booked = appointmentRepository
                .findByDoctorAndStartDatetimeBetween(doctor, dayStart, dayEnd);
        Set<LocalDateTime> bookedTimes = booked.stream()
                .filter(a -> a.getStatus() != Appointment.Status.CANCELLED)
                .map(Appointment::getStartDatetime)
                .collect(Collectors.toSet());

        // Fetch blocked slots
        List<BlockedSlot> blocked = blockedSlotRepository
                .findByDoctorIdAndStartDatetimeBetween(doctorId, dayStart, dayEnd);

        return allSlots.stream().map(slot -> {
            boolean isBooked = bookedTimes.contains(slot);
            boolean isBlocked = blocked.stream().anyMatch(b ->
                    !slot.isBefore(b.getStartDatetime()) && slot.isBefore(b.getEndDatetime()));
            boolean isPast = slot.isBefore(LocalDateTime.now().plusMinutes(30));
            return new SlotResponse(slot, !isBooked && !isBlocked && !isPast);
        }).collect(Collectors.toList());
    }

    private List<LocalDateTime> generateSlots(LocalDate date, LocalTime start,
                                               LocalTime end, int durationMin) {
        List<LocalDateTime> slots = new ArrayList<>();
        LocalTime current = start;
        while (current.plusMinutes(durationMin).compareTo(end) <= 0) {
            slots.add(date.atTime(current));
            current = current.plusMinutes(durationMin);
        }
        return slots;
    }
}
