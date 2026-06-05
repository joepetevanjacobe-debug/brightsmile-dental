package com.brightsmile.controller;

import com.brightsmile.model.dto.AppointmentResponse;
import com.brightsmile.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portal")
@RequiredArgsConstructor
public class PortalController {

    private final AppointmentService appointmentService;

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> myAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(userDetails.getUsername()));
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<Void> cancel(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        appointmentService.cancelByPatient(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
