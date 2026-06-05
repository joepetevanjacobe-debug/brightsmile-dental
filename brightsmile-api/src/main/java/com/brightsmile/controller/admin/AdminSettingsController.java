package com.brightsmile.controller.admin;

import com.brightsmile.model.entity.ClinicSetting;
import com.brightsmile.repository.ClinicSettingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/settings")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminSettingsController {

    private final ClinicSettingRepository settingRepository;

    /** Returns all settings as a flat key→value map. */
    @GetMapping
    public ResponseEntity<Map<String, String>> getAll() {
        Map<String, String> settings = settingRepository.findAll()
                .stream()
                .collect(Collectors.toMap(ClinicSetting::getKey, ClinicSetting::getValue));
        return ResponseEntity.ok(settings);
    }

    /** Accepts a key→value map and upserts every entry. */
    @PutMapping
    @Transactional
    public ResponseEntity<Map<String, String>> saveAll(@RequestBody Map<String, String> updates) {
        updates.forEach((k, v) ->
                settingRepository.save(new ClinicSetting(k, v))
        );
        return ResponseEntity.ok(updates);
    }
}
