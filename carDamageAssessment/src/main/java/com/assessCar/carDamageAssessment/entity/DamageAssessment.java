package com.assessCar.carDamageAssessment.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;


@Entity
public class DamageAssessment {
    public Long getId() {
        return id;
    }
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String imagePath;
    private String damageLevel; // "minor", "moderate", "severe"
    public String getImagePath() {
        return imagePath;
    }
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
    public String getDamageLevel() {
        return damageLevel;
    }
    public void setDamageLevel(String damageLevel) {
        this.damageLevel = damageLevel;
    }
    public void setId(long l) {
        id=l;
    }
}
