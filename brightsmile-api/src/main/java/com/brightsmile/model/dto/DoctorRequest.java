package com.brightsmile.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DoctorRequest {
    // User fields
    @NotBlank private String name;
    @NotBlank private String email;
    private String password;
    private String phone;

    // Doctor fields
    private String specialty;
    private String bio;
    private String credentials;
    private String photoUrl;
    private boolean visible = true;
}
