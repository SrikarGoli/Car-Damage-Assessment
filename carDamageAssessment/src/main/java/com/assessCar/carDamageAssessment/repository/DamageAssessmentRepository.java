package com.assessCar.carDamageAssessment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.assessCar.carDamageAssessment.entity.DamageAssessment;

@Repository
public interface DamageAssessmentRepository extends JpaRepository<DamageAssessment, Long>{

}
