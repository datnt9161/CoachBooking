package com.example.demo.repository;

import com.example.demo.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CoachRepository extends JpaRepository<Coach, Long> {
    Optional<Coach> findByLicensePlate(String licensePlate);
    List<Coach> findByType(Coach.CoachType type);
}
