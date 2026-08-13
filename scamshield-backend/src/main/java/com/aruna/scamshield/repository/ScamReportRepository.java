package com.aruna.scamshield.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aruna.scamshield.entity.ScamReport;

public interface ScamReportRepository extends JpaRepository<ScamReport, Integer> {

}