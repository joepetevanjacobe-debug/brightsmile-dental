package com.brightsmile.service;

import com.brightsmile.model.dto.ServiceRequest;
import com.brightsmile.model.entity.DentalService;
import com.brightsmile.repository.DentalServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DentalServiceService {

    private final DentalServiceRepository repository;

    public List<DentalService> getAllVisible() {
        return repository.findByVisibleTrueOrderBySortOrderAsc();
    }

    public List<DentalService> getAll() {
        return repository.findAll();
    }

    public DentalService getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Service not found"));
    }

    @Transactional
    public DentalService create(ServiceRequest req) {
        DentalService s = DentalService.builder()
                .name(req.getName())
                .description(req.getDescription())
                .category(req.getCategory())
                .durationMin(req.getDurationMin())
                .price(req.getPrice())
                .icon(req.getIcon())
                .visible(req.isVisible())
                .sortOrder(req.getSortOrder())
                .build();
        return repository.save(s);
    }

    @Transactional
    public DentalService update(Long id, ServiceRequest req) {
        DentalService s = getById(id);
        s.setName(req.getName());
        s.setDescription(req.getDescription());
        s.setCategory(req.getCategory());
        s.setDurationMin(req.getDurationMin());
        s.setPrice(req.getPrice());
        s.setIcon(req.getIcon());
        s.setVisible(req.isVisible());
        s.setSortOrder(req.getSortOrder());
        return repository.save(s);
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}
