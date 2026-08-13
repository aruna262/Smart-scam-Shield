import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ReportScam() {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    scamType: "",
    phone: "",
    url: "",
    description: "",
    evidence: "",
  });

  const [submittedReport, setSubmittedReport] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const scamTypeParam = params.get("scamType");
    const valueParam = params.get("value");

    if (scamTypeParam || valueParam) {
      let isPhone = false;
      let isUrl = false;

      if (valueParam) {
        if (
          valueParam.startsWith("http") ||
          valueParam.includes("www.")
        ) {
          isUrl = true;
        } else if (/^[\d\s+\-()]{5,}$/.test(valueParam)) {
          isPhone = true;
        }
      }

      setFormData((prev) => ({
        ...prev,
        scamType:
          scamTypeParam === "Phone Number"
            ? "UPI Scam"
            : scamTypeParam === "Suspicious Link"
            ? "Phishing"
            : "Job Scam",

        phone: isPhone ? valueParam : prev.phone,

        url: isUrl ? valueParam : prev.url,

        description: valueParam
          ? `Reported from Check Scam analysis: "${valueParam}"`
          : prev.description,
      }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SAVE REPORT TO BACKEND
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.scamType || !formData.description) {
      setErrorMessage(
        "⚠️ Please select a Scam Type and enter a Scam Description."
      );
      return;
    }

    setErrorMessage("");

    const reportData = {
      scamType: formData.scamType,
      phone: formData.phone,
      url: formData.url,
      description: formData.description,
      evidence: formData.evidence,
      riskLevel: "HIGH",
    };

    console.log("Sending report:", reportData);

    try {
      const response = await fetch(
        "http://localhost:8080/reports",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reportData),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();

        console.error("Backend error:", errorText);

        throw new Error(
          `Failed to submit report. Status: ${response.status}`
        );
      }

      const savedReport = await response.json();

      console.log(
        "Report saved successfully:",
        savedReport
      );

      setSubmittedReport({
        ...savedReport,

        type: formData.scamType.toUpperCase(),

        title: `${formData.scamType} - ${
          formData.phone ||
          formData.url ||
          "Community Flag"
        }`,
      });
    } catch (error) {
      console.error("Error submitting report:", error);

      setErrorMessage(
        "❌ Failed to submit report. Please make sure the Spring Boot backend is running on port 8080."
      );
    }
  };

  // =========================
  // SUBMIT ANOTHER REPORT
  // =========================
  const handleSubmitAnother = () => {
    setSubmittedReport(null);

    setFormData({
      scamType: "",
      phone: "",
      url: "",
      description: "",
      evidence: "",
    });

    setErrorMessage("");
  };

  return (
    <div className="page-container">

      <h1>🚨 Report a Scam</h1>

      <p className="page-description">
        Help protect the community by submitting real scam details.
        Reports are saved immediately.
      </p>

      <div className="report-card">

        {submittedReport ? (

          // =========================
          // SUCCESS MESSAGE
          // =========================
          <div
            style={{
              textAlign: "center",
              padding: "20px 10px",
            }}
          >

            <div
              style={{
                fontSize: "50px",
                marginBottom: "10px",
              }}
            >
              ✅
            </div>

            <h2
              style={{
                color: "#2ecc71",
                margin: "10px 0",
              }}
            >
              Report Submitted Successfully!
            </h2>

            <p
              style={{
                color: "#aab5ca",
                marginBottom: "25px",
              }}
            >
              Your scam report has been permanently saved
              to the community database.
            </p>

            <div
              style={{
                background: "#080d18",
                border: "1px solid #283756",
                borderRadius: "12px",
                padding: "20px",
                textAlign: "left",
                marginBottom: "25px",
              }}
            >

              <div
                style={{
                  color: "#704cff",
                  fontWeight: "bold",
                  marginBottom: "6px",
                }}
              >
                {submittedReport.type}
              </div>

              <h3
                style={{
                  margin: "0 0 10px 0",
                  color: "white",
                }}
              >
                {submittedReport.title}
              </h3>

              <p
                style={{
                  color: "#8d98ad",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                {submittedReport.description}
              </p>

              {submittedReport.id && (
                <p
                  style={{
                    color: "#8d98ad",
                    fontSize: "13px",
                    marginTop: "10px",
                  }}
                >
                  Report ID: {submittedReport.id}
                </p>
              )}

            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >

              <button
                type="button"
                className="submit-btn"
                style={{
                  flex: 1,
                  background: "#704cff",
                }}
                onClick={handleSubmitAnother}
              >
                ➕ SUBMIT ANOTHER REPORT
              </button>

              <button
                type="button"
                className="submit-btn"
                style={{
                  flex: 1,
                  background: "#1d2842",
                  border: "1px solid #3c4d75",
                }}
                onClick={() => navigate("/reports")}
              >
                📋 VIEW COMMUNITY REPORTS
              </button>

            </div>

          </div>

        ) : (

          // =========================
          // REPORT FORM
          // =========================
          <form onSubmit={handleSubmit}>

            <label>
              Scam Type *
            </label>

            <select
              name="scamType"
              value={formData.scamType}
              onChange={handleChange}
            >

              <option value="">
                Select Scam Type
              </option>

              <option value="UPI Scam">
                💳 UPI / QR Code Scam
              </option>

              <option value="Job Scam">
                💼 Fake Work From Home Job
              </option>

              <option value="Phishing">
                🔗 Banking Phishing Link
              </option>

              <option value="Fake Website">
                🌐 Fake Shopping / Investment Site
              </option>

              <option value="Investment Scam">
                📈 Crypto / High Return Fraud
              </option>

              <option value="Fake Social Media Account">
                📱 Fake Social Media Impersonation
              </option>

              <option value="Other">
                ⚠️ Other Suspicious Activity
              </option>

            </select>

            <label>
              Scam Phone Number (Optional)
            </label>

            <input
              type="text"
              name="phone"
              placeholder="e.g. +91 9876543210"
              value={formData.phone}
              onChange={handleChange}
            />

            <label>
              Suspicious URL / Link (Optional)
            </label>

            <input
              type="text"
              name="url"
              placeholder="https://suspicious-website.com"
              value={formData.url}
              onChange={handleChange}
            />

            <label>
              Scam Description *
            </label>

            <textarea
              rows="5"
              name="description"
              placeholder="Explain how the scam happened, what was asked, amount lost, or messaging used..."
              value={formData.description}
              onChange={handleChange}
            />

            <label>
              Evidence / Additional Information
            </label>

            <textarea
              rows="3"
              name="evidence"
              placeholder="Add payment IDs, transaction refs, fake recruiter names, or Telegram handles..."
              value={formData.evidence}
              onChange={handleChange}
            />

            {errorMessage && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "12px",
                  background:
                    "rgba(255, 63, 85, 0.15)",
                  border:
                    "1px solid #ff3f55",
                  borderRadius: "8px",
                  color: "#ff6678",
                  fontSize: "14px",
                }}
              >
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="submit-btn"
            >
              🚨 SUBMIT SCAM REPORT
            </button>

          </form>

        )}

      </div>

    </div>
  );
}

export default ReportScam;