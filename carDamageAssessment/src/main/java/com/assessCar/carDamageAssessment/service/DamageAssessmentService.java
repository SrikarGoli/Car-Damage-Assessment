package com.assessCar.carDamageAssessment.service;


import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.assessCar.carDamageAssessment.entity.DamageAssessment;
import com.assessCar.carDamageAssessment.repository.DamageAssessmentRepository;

@Service
public class DamageAssessmentService {
    @Autowired
    private DamageAssessmentRepository repository;

    public DamageAssessment save(DamageAssessment assessment) {
    return repository.saveAndFlush(assessment);
    }

    public Optional<DamageAssessment> findById(Long id) {
        return repository.findById(id);
    }
}