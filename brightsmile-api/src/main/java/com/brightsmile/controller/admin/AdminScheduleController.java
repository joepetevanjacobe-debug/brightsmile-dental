package com.brightsmile.controller.admin;

import com.brightsmile.model.entity.BlockedSlot;
import com.brightsmile.model.entity.Doctor;
import com.brightsmile.model.entity.Schedule;
import com.brightsmile.repository.BlockedSlotRepository;
import com.brightsmile.repository.DoctorRepository;
import com.brightsmile.repository.ScheduleRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/schedule")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','RECEPTIONIST')")
public class AdminScheduleController {

    private final ScheduleRepository scheduleRepository;
    private final BlockedSlotRepository blockedSlotRepository;
    private final DoctorRepository doctorRepository;

    @GetMapping("/{doctorId}")
    public ResponseEntity<List<Schedule>> getSchedule(@PathVariable Long doctorId) {
        return ResponseEntity.ok(scheduleRepository.findByDoctorId(doctorId));
    }

    @PutMapping("/{doctorId}")
    @Transactional
    public ResponseEntity<List<Schedule>> setSchedule(
            @PathVariable Long doctorId,
            @RequestBody List<ScheduleEntry> entries) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        scheduleRepository.deleteByDoctorId(doctorId);
        List<Schedule> saved = entries.stream().map(e -> scheduleRepository.save(
                Schedule.builder()
                        .doctor(doctor)
                        .dayOfWeek(e.getDayOfWeek())
                        .startTime(e.getStartTime())
                        .endTime(e.getEndTime())
                        .slotDurationMin(e.getSlotDurationMin() > 0 ? e.getSlotDurationMin() : 30)
                        .build()
        )).toList();
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/block")
    public ResponseEntity<BlockedSlot> blockSlot(@RequestBody BlockRequest req) {
        Doctor doctor = doctorRepository.findById(req.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        BlockedSlot blocked = blockedSlotRepository.save(BlockedSlot.builder()
                .doctor(doctor)
                .startDatetime(req.getStartDatetime())
                .endDatetime(req.getEndDatetime())
                .reason(req.getReason())
                .build());
        return ResponseEntity.status(HttpStatus.CREATED).body(blocked);
    }

    @DeleteMapping("/block/{id}")
    public ResponseEntity<Void> unblock(@PathVariable Long id) {
        blockedSlotRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @Data
    public static class ScheduleEntry {
        private DayOfWeek dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
        private int slotDurationMin;
    }

    @Data
    public static class BlockRequest {
        private Long doctorId;
        private LocalDateTime startDatetime;
        private LocalDateTime endDatetime;
        private String reason;
    }
}
