package com.brightsmile.model.dto;

import com.brightsmile.model.entity.DentalService;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ServiceRequest {
    @NotBlank
    private String name;
    private String description;
    @NotNull
    private DentalService.Category category;
    @Min(5)
    private int durationMin;
    @NotNull @DecimalMin("0.0")
    private BigDecimal price;
    private String icon;
    private boolean visible = true;
    private int sortOrder;
}
