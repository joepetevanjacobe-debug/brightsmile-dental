package com.brightsmile.model.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    @NotNull
    private Long serviceId;
    @NotNull
    private Long doctorId;
    @NotNull
    private LocalDateTime startDatetime;

    // Guest fields — required when user is not authenticated
    private String guestName;
    @Email
    private String guestEmail;
    private String guestPhone;
    @Min(0)
    @Max(120)
    private Integer guestAge;
    private String guestAddress;

    private String notes;
}
