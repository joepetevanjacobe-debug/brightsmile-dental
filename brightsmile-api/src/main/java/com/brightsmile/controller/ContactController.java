package com.brightsmile.controller;

import com.brightsmile.model.dto.ContactRequest;
import com.brightsmile.model.entity.Contact;
import com.brightsmile.repository.ContactRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactRepository contactRepository;

    @PostMapping
    public ResponseEntity<Map<String, String>> submit(@Valid @RequestBody ContactRequest req) {
        Contact contact = Contact.builder()
                .name(req.getName())
                .email(req.getEmail())
                .phone(req.getPhone())
                .message(req.getMessage())
                .build();
        contactRepository.save(contact);
        return ResponseEntity.ok(Map.of("message", "Thank you! We'll be in touch soon."));
    }
}
