package com.brightsmile.service;

import com.brightsmile.model.dto.DashboardStats;
import com.brightsmile.model.entity.Appointment;
import com.brightsmile.model.entity.User;
import com.brightsmile.repository.AppointmentRepository;
import com.brightsmile.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public DashboardStats getStats() {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = todayStart.plusDays(1);
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime now = LocalDateTime.now();

        long todayCount = appointmentRepository.countInRange(todayStart, todayEnd);
        long newPatientsMonth = userRepository.countByRoleAndCreatedAtAfter(User.Role.PATIENT, monthStart);

        // Revenue: sum of completed appointments this month
        List<Appointment> monthAppointments = appointmentRepository.findActiveInRange(monthStart, now);
        BigDecimal revenue = monthAppointments.stream()
                .filter(a -> a.getStatus() == Appointment.Status.COMPLETED)
                .map(a -> a.getService().getPrice())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalMonth = appointmentRepository.countInRange(monthStart, now);
        long cancelledMonth = appointmentRepository.countCancelledInRange(monthStart, now);
        double cancellationRate = totalMonth > 0 ? (double) cancelledMonth / totalMonth * 100 : 0;

        // Last 30 days breakdown
        LocalDateTime thirtyDaysAgo = now.minusDays(30);
        List<DashboardStats.DailyCount> daily = new ArrayList<>();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        for (int i = 29; i >= 0; i--) {
            LocalDateTime dayStart = now.minusDays(i).toLocalDate().atStartOfDay();
            LocalDateTime dayEnd = dayStart.plusDays(1);
            long count = appointmentRepository.countInRange(dayStart, dayEnd);
            daily.add(DashboardStats.DailyCount.builder()
                    .date(dayStart.format(fmt))
                    .count(count)
                    .build());
        }

        // Service breakdown
        List<Object[]> raw = appointmentRepository.countByServiceInRange(thirtyDaysAgo, now);
        List<DashboardStats.ServiceBreakdown> breakdown = raw.stream()
                .map(r -> DashboardStats.ServiceBreakdown.builder()
                        .serviceName((String) r[0])
                        .count((Long) r[1])
                        .build())
                .toList();

        return DashboardStats.builder()
                .todayAppointments(todayCount)
                .newPatientsThisMonth(newPatientsMonth)
                .totalRevenueThisMonth(revenue)
                .cancellationRate(Math.round(cancellationRate * 10.0) / 10.0)
                .appointmentsLast30Days(daily)
                .serviceBreakdown(breakdown)
                .build();
    }
}
