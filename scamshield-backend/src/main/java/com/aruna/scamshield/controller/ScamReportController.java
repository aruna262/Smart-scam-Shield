package com.aruna.scamshield.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.aruna.scamshield.entity.ScamReport;
import com.aruna.scamshield.service.ScamReportService;

@RestController
@RequestMapping("/reports")
@CrossOrigin(origins = {
	    "http://localhost:5177",
	    "http://localhost:5176",
	    "http://localhost:5173"
	})
public class ScamReportController {

    @Autowired
    private ScamReportService scamReportService;

    // POST - Create Report
    @PostMapping
    public ScamReport createReport(@RequestBody ScamReport report) {
        return scamReportService.saveReport(report);
    }

    // GET - All Reports
    @GetMapping
    public List<ScamReport> getAllReports() {
        return scamReportService.getAllReports();
    }

    // GET - Report by ID
    @GetMapping("/{id}")
    public ResponseEntity<ScamReport> getReportById(@PathVariable Integer id) {

        Optional<ScamReport> report =
                scamReportService.getReportById(id);

        if (report.isPresent()) {
            return ResponseEntity.ok(report.get());
        }

        return ResponseEntity.notFound().build();
    }

    // PUT - Update Report
    @PutMapping("/{id}")
    public ResponseEntity<ScamReport> updateReport(
            @PathVariable Integer id,
            @RequestBody ScamReport report) {

        ScamReport updatedReport =
                scamReportService.updateReport(id, report);

        if (updatedReport != null) {
            return ResponseEntity.ok(updatedReport);
        }

        return ResponseEntity.notFound().build();
    }

    // DELETE - Delete Report
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteReport(
            @PathVariable Integer id) {

        Optional<ScamReport> report =
                scamReportService.getReportById(id);

        if (report.isPresent()) {
            scamReportService.deleteReport(id);
            return ResponseEntity.ok("Report deleted successfully");
        }

        return ResponseEntity.notFound().build();
    }
}