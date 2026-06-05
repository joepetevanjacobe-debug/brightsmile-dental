package com.brightsmile.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "dental_services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DentalService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(name = "duration_min", nullable = false)
    private int durationMin;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    private String icon;

    @Column(nullable = false)
    @Builder.Default
    private boolean visible = true;

    @Column(name = "sort_order")
    @Builder.Default
    private int sortOrder = 0;

    public enum Category {
        COSMETIC, RESTORATIVE, PREVENTIVE, ORTHODONTIC, PEDIATRIC, GENERAL
    }
}
