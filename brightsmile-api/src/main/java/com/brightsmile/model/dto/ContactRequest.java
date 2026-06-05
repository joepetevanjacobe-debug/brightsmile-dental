package com.brightsmile.model.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ContactRequest {
    @NotBlank
    private String name;
    @Email @NotBlank
    private String email;
    private String phone;
    @NotBlank @Size(min = 10, max = 2000)
    private String message;
}
