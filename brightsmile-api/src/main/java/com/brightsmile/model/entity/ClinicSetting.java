package com.brightsmile.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clinic_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClinicSetting {

    @Id
    @Column(name = "setting_key", length = 100)
    private String key;

    @Column(name = "setting_value", columnDefinition = "TEXT")
    private String value;
}
