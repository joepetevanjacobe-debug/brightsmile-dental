package com.brightsmile.model.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardStats {
    private long todayAppointments;
    private long newPatientsThisMonth;
    private BigDecimal totalRevenueThisMonth;
    private double cancellationRate;
    private List<DailyCount> appointmentsLast30Days;
    private List<ServiceBreakdown> serviceBreakdown;

    @Data
    @Builder
    public static class DailyCount {
        private String date;
        private long count;
    }

    @Data
    @Builder
    public static class ServiceBreakdown {
        private String serviceName;
        private long count;
    }
}
