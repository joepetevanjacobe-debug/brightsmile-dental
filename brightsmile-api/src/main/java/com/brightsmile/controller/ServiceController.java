package com.brightsmile.controller;

import com.brightsmile.model.entity.DentalService;
import com.brightsmile.service.DentalServiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class ServiceController {

    private final DentalServiceService serviceService;

    @GetMapping
    public ResponseEntity<List<DentalService>> listVisible() {
        return ResponseEntity.ok(serviceService.getAllVisible());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DentalService> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(serviceService.getById(id));
    }
}
