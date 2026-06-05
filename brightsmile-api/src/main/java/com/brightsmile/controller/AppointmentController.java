package com.brightsmile.controller;

import com.brightsmile.model.dto.AppointmentRequest;
import com.brightsmile.model.dto.AppointmentResponse;
import com.brightsmile.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponse> book(
            @Valid @RequestBody AppointmentRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        AppointmentResponse response = appointmentService.book(req, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
