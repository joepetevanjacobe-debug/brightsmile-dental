package com.brightsmile.model.dto;

import com.brightsmile.model.entity.Appointment;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AppointmentResponse {
    private Long id;
    private String patientName;
    private String patientEmail;
    private String patientPhone;
    private Integer patientAge;
    private String patientAddress;
    private String doctorName;
    private Long doctorId;
    private String serviceName;
    private Long serviceId;
    private BigDecimal servicePrice;
    private int serviceDurationMin;
    private LocalDateTime startDatetime;
    private LocalDateTime endDatetime;
    private Appointment.Status status;
    private String notes;
    private LocalDateTime createdAt;

    public static AppointmentResponse from(Appointment a) {
        return AppointmentResponse.builder()
                .id(a.getId())
                .patientName(a.getPatientName())
                .patientEmail(a.getPatientEmail())
                .patientPhone(a.getPatient() != null ? a.getPatient().getPhone() : a.getGuestPhone())
                .patientAge(a.getGuestAge())
                .patientAddress(a.getGuestAddress())
                .doctorName(a.getDoctor().getUser().getName())
                .doctorId(a.getDoctor().getId())
                .serviceName(a.getService().getName())
                .serviceId(a.getService().getId())
                .servicePrice(a.getService().getPrice())
                .serviceDurationMin(a.getService().getDurationMin())
                .startDatetime(a.getStartDatetime())
                .endDatetime(a.getEndDatetime())
                .status(a.getStatus())
                .notes(a.getNotes())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
