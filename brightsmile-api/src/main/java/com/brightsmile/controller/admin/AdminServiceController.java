package com.brightsmile.controller.admin;

import com.brightsmile.model.dto.ServiceRequest;
import com.brightsmile.model.entity.DentalService;
import com.brightsmile.service.DentalServiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/services")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminServiceController {

    private final DentalServiceService serviceService;

    @GetMapping
    public ResponseEntity<List<DentalService>> list() {
        return ResponseEntity.ok(serviceService.getAll());
    }

    @PostMapping
    public ResponseEntity<DentalService> create(@Valid @RequestBody ServiceRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DentalService> update(@PathVariable Long id,
                                                @Valid @RequestBody ServiceRequest req) {
        return ResponseEntity.ok(serviceService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        serviceService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
