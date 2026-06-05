package com.brightsmile.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class SlotResponse {
    private LocalDateTime datetime;
    private boolean available;
}
