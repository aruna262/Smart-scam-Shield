package com.aruna.scamshield.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aruna.scamshield.entity.ScamReport;
import com.aruna.scamshield.repository.ScamReportRepository;

@Service
public class ScamReportService {

    @Autowired
    private ScamReportRepository scamReportRepository;

    // Create Report
    public ScamReport saveReport(ScamReport report) {
        return scamReportRepository.save(report);
    }

    // Get All Reports
    public List<ScamReport> getAllReports() {
        return scamReportRepository.findAll();
    }

    // Get Report By ID
    public Optional<ScamReport> getReportById(Integer id) {
        return scamReportRepository.findById(id);
    }

    // Update Report
    public ScamReport updateReport(Integer id, ScamReport newReport) {

        Optional<ScamReport> existingReport =
                scamReportRepository.findById(id);

        if (existingReport.isPresent()) {

            ScamReport report = existingReport.get();

            report.setScamType(newReport.getScamType());
            report.setPhone(newReport.getPhone());
            report.setUrl(newReport.getUrl());
            report.setDescription(newReport.getDescription());
            report.setEvidence(newReport.getEvidence());
            report.setRiskLevel(newReport.getRiskLevel());

            return scamReportRepository.save(report);
        }

        return null;
    }

    // Delete Report
    public void deleteReport(Integer id) {
        scamReportRepository.deleteById(id);
    }
}