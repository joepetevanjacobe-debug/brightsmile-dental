package com.brightsmile.repository;

import com.brightsmile.model.entity.ClinicSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClinicSettingRepository extends JpaRepository<ClinicSetting, String> {}
