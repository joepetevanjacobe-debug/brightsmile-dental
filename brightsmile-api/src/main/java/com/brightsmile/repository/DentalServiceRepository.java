package com.brightsmile.repository;

import com.brightsmile.model.entity.DentalService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DentalServiceRepository extends JpaRepository<DentalService, Long> {
    List<DentalService> findByVisibleTrueOrderBySortOrderAsc();
    List<DentalService> findByCategoryAndVisibleTrue(DentalService.Category category);
}
