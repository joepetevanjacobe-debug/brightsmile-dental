package com.brightsmile.repository;

import com.brightsmile.model.entity.Appointment;
import com.brightsmile.model.entity.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDoctorAndStartDatetimeBetween(
            Doctor doctor, LocalDateTime start, LocalDateTime end);

    List<Appointment> findByPatientId(Long patientId);

    Page<Appointment> findByPatientId(Long patientId, Pageable pageable);

    @Query("SELECT a FROM Appointment a WHERE a.startDatetime BETWEEN :start AND :end AND a.status != 'CANCELLED'")
    List<Appointment> findActiveInRange(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.startDatetime BETWEEN :start AND :end")
    long countInRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.startDatetime BETWEEN :start AND :end AND a.status = 'CANCELLED'")
    long countCancelledInRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT a FROM Appointment a WHERE a.status = :status AND a.startDatetime BETWEEN :start AND :end AND a.reminderSent = false")
    List<Appointment> findForReminder(
            @Param("status") Appointment.Status status,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end);

    @Query("SELECT a.service.name as serviceName, COUNT(a) as cnt FROM Appointment a " +
           "WHERE a.startDatetime BETWEEN :start AND :end GROUP BY a.service.name")
    List<Object[]> countByServiceInRange(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query(value = "SELECT a FROM Appointment a WHERE " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:doctorId IS NULL OR a.doctor.id = :doctorId) AND " +
           "(:serviceId IS NULL OR a.service.id = :serviceId) AND " +
           "a.startDatetime >= :from AND a.startDatetime <= :to")
    Page<Appointment> findFiltered(
            @Param("status") Appointment.Status status,
            @Param("doctorId") Long doctorId,
            @Param("serviceId") Long serviceId,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to,
            Pageable pageable);
}
