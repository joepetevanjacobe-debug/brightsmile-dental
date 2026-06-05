package com.brightsmile.controller.admin;

import com.brightsmile.model.dto.DoctorRequest;
import com.brightsmile.model.entity.Doctor;
import com.brightsmile.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/team")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminTeamController {

    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<Doctor>> list() {
        return ResponseEntity.ok(doctorService.getAll());
    }

    @PostMapping
    public ResponseEntity<Doctor> create(@Valid @RequestBody DoctorRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(doctorService.create(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> update(@PathVariable Long id, @Valid @RequestBody DoctorRequest req) {
        return ResponseEntity.ok(doctorService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        doctorService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
