package com.brightsmile.scheduler;

import com.brightsmile.model.entity.Appointment;
import com.brightsmile.repository.AppointmentRepository;
import com.brightsmile.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private final AppointmentRepository appointmentRepository;
    private final EmailService emailService;

    /** Runs every hour — sends 24-hour reminders */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional
    public void send24HourReminders() {
        LocalDateTime windowStart = LocalDateTime.now().plusHours(23);
        LocalDateTime windowEnd = LocalDateTime.now().plusHours(25);
        List<Appointment> upcoming = appointmentRepository
                .findForReminder(Appointment.Status.CONFIRMED, windowStart, windowEnd);

        for (Appointment appt : upcoming) {
            emailService.sendReminder(appt, "tomorrow");
            appt.setReminderSent(true);
        }
        log.info("Sent 24h reminders for {} appointments", upcoming.size());
    }

    /** Runs every 15 minutes — sends 2-hour reminders */
    @Scheduled(cron = "0 */15 * * * *")
    @Transactional
    public void send2HourReminders() {
        LocalDateTime windowStart = LocalDateTime.now().plusHours(1).plusMinutes(45);
        LocalDateTime windowEnd = LocalDateTime.now().plusHours(2).plusMinutes(15);
        List<Appointment> upcoming = appointmentRepository
                .findForReminder(Appointment.Status.CONFIRMED, windowStart, windowEnd);

        for (Appointment appt : upcoming) {
            emailService.sendReminder(appt, "in 2 hours");
        }
        log.info("Sent 2h reminders for {} appointments", upcoming.size());
    }
}
