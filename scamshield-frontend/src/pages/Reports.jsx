import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Reports() {
  const location = useLocation();

  // ==========================================
  // DEFAULT COMMUNITY REPORTS
  // ==========================================

  const defaultReports = [
    {
      id: "def-1",
      type: "UPI SCAM",
      scamType: "UPI Scam",
      icon: "💳",
      title: "Fake UPI QR Payment Collect Fraud",
      description:
        "Scammer sent a fake payment QR code claiming to send money for OLX product purchase, but scanning it debited ₹15,000 from victim's account.",
      risk: "HIGH",
      riskLevel: "HIGH",
      date: "Today",
      isDefault: true,
      phone: "",
      url: "",
      evidence: "Fake QR code screenshot",
    },

    {
      id: "def-2",
      type: "JOB SCAM",
      scamType: "Job Scam",
      icon: "💼",
      title: "Fake Work-From-Home YouTube Like Task",
      description:
        "Fraudulent recruiter offered ₹500/day for liking YouTube videos, then asked the victim to transfer money.",
      risk: "HIGH",
      riskLevel: "HIGH",
      date: "Yesterday",
      isDefault: true,
      phone: "",
      url: "",
      evidence: "WhatsApp screenshot",
    },

    {
      id: "def-3",
      type: "PHISHING",
      scamType: "Phishing",
      icon: "🔗",
      title: "Fake Bank NetBanking Credentials Harvest",
      description:
        "Phishing link sent via SMS claiming bank account will be locked unless KYC is updated.",
      risk: "CRITICAL",
      riskLevel: "CRITICAL",
      date: "2 days ago",
      isDefault: true,
      phone: "",
      url: "https://fake-bank-example.com",
      evidence: "Suspicious banking website",
    },

    {
      id: "def-4",
      type: "INVESTMENT SCAM",
      scamType: "Investment Scam",
      icon: "📈",
      title: "Fake Telegram Stock & Crypto Trading Bot",
      description:
        "Victims were lured into a fake trading portal using fake profit screenshots.",
      risk: "HIGH",
      riskLevel: "HIGH",
      date: "3 days ago",
      isDefault: true,
      phone: "",
      url: "",
      evidence: "Telegram screenshots",
    },
  ];

  // ==========================================
  // STATES
  // ==========================================

  const [allReports, setAllReports] = useState([]);

  const [filterType, setFilterType] = useState("ALL");

  const [filterRisk, setFilterRisk] = useState("ALL");

  const [searchQuery, setSearchQuery] = useState("");

  const [editingReport, setEditingReport] =
    useState(null);

  const [editForm, setEditForm] = useState({
    scamType: "",
    phone: "",
    url: "",
    description: "",
    evidence: "",
    riskLevel: "HIGH",
  });

  // ==========================================
  // LOAD REPORTS
  // ==========================================

  useEffect(() => {
    loadReports();

    const params = new URLSearchParams(
      location.search
    );

    const filterParam = params.get("filter");

    if (filterParam === "HIGH") {
      setFilterRisk("HIGH");
    }

    if (filterParam === "CRITICAL") {
      setFilterRisk("CRITICAL");
    }
  }, [location.search]);

  // ==========================================
  // GET REPORTS FROM BACKEND
  // ==========================================

  const loadReports = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/reports"
      );

      if (!response.ok) {
        throw new Error(
          "Failed to fetch reports"
        );
      }

      const backendReports =
        await response.json();

      console.log(
        "Reports loaded:",
        backendReports
      );

      const userReports =
        backendReports.map((report) => {
          const scamType =
            report.scamType || "Other";

          const upperType =
            scamType.toUpperCase();

          let icon = "🚨";

          if (upperType.includes("UPI")) {
            icon = "💳";
          } else if (
            upperType.includes("JOB")
          ) {
            icon = "💼";
          } else if (
            upperType.includes("PHISHING")
          ) {
            icon = "🔗";
          } else if (
            upperType.includes("INVESTMENT")
          ) {
            icon = "📈";
          } else if (
            upperType.includes("SOCIAL")
          ) {
            icon = "📱";
          } else if (
            upperType.includes("WEBSITE")
          ) {
            icon = "🌐";
          }

          const risk =
            report.riskLevel ||
            report.risk ||
            "HIGH";

          return {
            ...report,

            type: upperType,

            scamType: scamType,

            icon: icon,

            title:
              report.title ||
              `${scamType} - ${
                report.phone ||
                report.url ||
                "Community Flag"
              }`,

            description:
              report.description ||
              "No description available",

            evidence:
              report.evidence || "",

            risk: risk.toUpperCase(),

            riskLevel: risk.toUpperCase(),

            date: report.createdAt
              ? new Date(
                  report.createdAt
                ).toLocaleDateString()
              : "Just now",

            isDefault: false,
          };
        });

      setAllReports([
        ...userReports,
        ...defaultReports,
      ]);
    } catch (error) {
      console.error(
        "Failed to load reports:",
        error
      );

      setAllReports(defaultReports);
    }
  };

  // ==========================================
  // EDIT REPORT
  // ==========================================

  const handleEdit = (report) => {
    console.log(
      "Edit clicked:",
      report
    );

    setEditingReport(report);

    setEditForm({
      scamType:
        report.scamType ||
        report.type ||
        "",

      phone: report.phone || "",

      url: report.url || "",

      description:
        report.description || "",

      evidence:
        report.evidence || "",

      riskLevel:
        report.riskLevel ||
        report.risk ||
        "HIGH",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==========================================
  // EDIT FORM CHANGE
  // ==========================================

  const handleEditChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==========================================
  // UPDATE REPORT
  // ==========================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingReport) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/reports/${editingReport.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            editForm
          ),
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        console.error(
          "Backend error:",
          errorText
        );

        throw new Error(
          "Failed to update report"
        );
      }

      await response.json();

      alert(
        "✅ Report updated successfully!"
      );

      setEditingReport(null);

      setEditForm({
        scamType: "",
        phone: "",
        url: "",
        description: "",
        evidence: "",
        riskLevel: "HIGH",
      });

      await loadReports();
    } catch (error) {
      console.error(
        "Update error:",
        error
      );

      alert(
        "❌ Failed to update report"
      );
    }
  };

  // ==========================================
  // DELETE REPORT
  // ==========================================

  const handleDeleteUserReport = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this report?"
      );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/reports/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete report"
        );
      }

      alert(
        "🗑️ Report deleted successfully!"
      );

      await loadReports();
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert(
        "❌ Failed to delete report"
      );
    }
  };

  // ==========================================
  // SEARCH + CATEGORY + RISK FILTER
  // ==========================================

  const filteredReports =
    allReports.filter((report) => {

      // --------------------------------------
      // SEARCH
      // --------------------------------------

      const search =
        searchQuery
          .trim()
          .toLowerCase();

      const searchableText = [
        report.phone,
        report.url,
        report.scamType,
        report.type,
        report.title,
        report.description,
        report.evidence,
        report.riskLevel,
        report.risk,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        search === "" ||
        searchableText.includes(search);

      // --------------------------------------
      // CATEGORY FILTER
      // --------------------------------------

      const reportType = (
        report.type ||
        report.scamType ||
        ""
      ).toUpperCase();

      let matchesType = true;

      if (filterType !== "ALL") {

        if (filterType === "OTHER") {
          matchesType =
            !reportType.includes("UPI") &&
            !reportType.includes("JOB") &&
            !reportType.includes("PHISHING") &&
            !reportType.includes(
              "INVESTMENT"
            );
        } else {
          matchesType =
            reportType.includes(
              filterType
            );
        }
      }

      // --------------------------------------
      // RISK FILTER
      // --------------------------------------

      const reportRisk = (
        report.riskLevel ||
        report.risk ||
        ""
      ).toUpperCase();

      const matchesRisk =
        filterRisk === "ALL" ||
        reportRisk === filterRisk;

      return (
        matchesSearch &&
        matchesType &&
        matchesRisk
      );
    });

  // ==========================================
  // USER REPORTS
  // ==========================================

  const userReports =
    allReports.filter(
      (report) =>
        !report.isDefault
    );

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalCount =
    allReports.length;

  const highRiskCount =
    allReports.filter(
      (report) =>
        report.risk === "HIGH" ||
        report.risk === "CRITICAL"
    ).length;

  const criticalCount =
    allReports.filter(
      (report) =>
        report.risk === "CRITICAL"
    ).length;

  const userSubmittedCount =
    userReports.length;

  // ==========================================
  // RESET FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("ALL");
    setFilterRisk("ALL");
  };

  // ==========================================
  // RETURN
  // ==========================================

  return (
    <div className="page-container">

      {/* =====================================
          PAGE TITLE
      ====================================== */}

      <h1>
        📋 Community Scam Reports
      </h1>

      <p className="page-description">
        Browse real reported scams,
        filter by threat vector, and
        stay protected from current
        online frauds.
      </p>


      {/* =====================================
          EDIT FORM
      ====================================== */}

      {editingReport && (
        <div
          className="report-card"
          style={{
            maxWidth: "800px",
            margin: "20px auto",
            padding: "25px",
          }}
        >

          <h2
            style={{
              color: "white",
            }}
          >
            ✏️ Edit Scam Report
          </h2>

          <form
            onSubmit={handleUpdate}
          >

            <label>
              Scam Type
            </label>

            <select
              name="scamType"
              value={
                editForm.scamType
              }
              onChange={
                handleEditChange
              }
            >
              <option value="UPI Scam">
                💳 UPI Scam
              </option>

              <option value="Job Scam">
                💼 Job Scam
              </option>

              <option value="Phishing">
                🔗 Phishing
              </option>

              <option value="Fake Website">
                🌐 Fake Website
              </option>

              <option value="Investment Scam">
                📈 Investment Scam
              </option>

              <option value="Fake Social Media Account">
                📱 Fake Social Media Account
              </option>

              <option value="Other">
                ⚠️ Other
              </option>
            </select>


            <label>
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={
                editForm.phone
              }
              onChange={
                handleEditChange
              }
              placeholder="Enter phone number"
            />


            <label>
              URL
            </label>

            <input
              type="text"
              name="url"
              value={
                editForm.url
              }
              onChange={
                handleEditChange
              }
              placeholder="Enter suspicious URL"
            />


            <label>
              Description
            </label>

            <textarea
              rows="5"
              name="description"
              value={
                editForm.description
              }
              onChange={
                handleEditChange
              }
              placeholder="Describe the scam..."
            />


            <label>
              Evidence
            </label>

            <textarea
              rows="3"
              name="evidence"
              value={
                editForm.evidence
              }
              onChange={
                handleEditChange
              }
              placeholder="Enter evidence"
            />


            <label>
              Risk Level
            </label>

            <select
              name="riskLevel"
              value={
                editForm.riskLevel
              }
              onChange={
                handleEditChange
              }
            >
              <option value="LOW">
                LOW
              </option>

              <option value="MEDIUM">
                MEDIUM
              </option>

              <option value="HIGH">
                HIGH
              </option>

              <option value="CRITICAL">
                CRITICAL
              </option>
            </select>


            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}
            >

              <button
                type="submit"
                className="submit-btn"
                style={{
                  flex: 1,
                  background:
                    "#704cff",
                  cursor:
                    "pointer",
                }}
              >
                💾 UPDATE REPORT
              </button>


              <button
                type="button"
                className="submit-btn"
                style={{
                  flex: 1,
                  background:
                    "#333b50",
                  cursor:
                    "pointer",
                }}
                onClick={() => {

                  setEditingReport(
                    null
                  );

                  setEditForm({
                    scamType: "",
                    phone: "",
                    url: "",
                    description:
                      "",
                    evidence:
                      "",
                    riskLevel:
                      "HIGH",
                  });

                }}
              >
                ❌ CANCEL
              </button>

            </div>

          </form>

        </div>
      )}


      {/* =====================================
          STATISTICS
      ====================================== */}

      <div className="stats">

        <div className="stat-card">

          <h2>
            {totalCount}
          </h2>

          <p>
            📋 Total Reports
          </p>

        </div>


        <div className="stat-card">

          <h2>
            {highRiskCount}
          </h2>

          <p>
            🔴 High & Critical Risk
          </p>

        </div>


        <div className="stat-card">

          <h2>
            {criticalCount}
          </h2>

          <p>
            🚨 Critical Risk
          </p>

        </div>


        <div className="stat-card">

          <h2>
            {userSubmittedCount}
          </h2>

          <p>
            👤 User Submitted
          </p>

        </div>

      </div>


      {/* =====================================
          SEARCH
      ====================================== */}

      <div
        style={{
          maxWidth: "1000px",
          margin: "30px auto",
        }}
      >

        <div
          className="check-form"
          style={{
            display: "flex",
            gap: "10px",
            width: "100%",
          }}
        >

          <input
            type="text"
            placeholder="🔍 Search by phone, URL, scam type or description..."
            value={
              searchQuery
            }
            onChange={(e) =>
              setSearchQuery(
                e.target.value
              )
            }
            style={{
              flex: 1,
              width: "100%",
              padding: "14px",
            }}
          />

        </div>


        {/* =====================================
            CATEGORY FILTER
        ====================================== */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent:
              "center",
            marginTop: "15px",
          }}
        >

          {[
            "ALL",
            "UPI",
            "JOB",
            "PHISHING",
            "INVESTMENT",
            "OTHER",
          ].map((cat) => (

            <button
              key={cat}
              type="button"
              onClick={() =>
                setFilterType(
                  cat
                )
              }
              style={{
                padding:
                  "10px 18px",
                borderRadius:
                  "20px",
                background:
                  filterType === cat
                    ? "#704cff"
                    : "#192238",
                color: "white",
                border:
                  filterType === cat
                    ? "1px solid #947cff"
                    : "1px solid #303b53",
                cursor:
                  "pointer",
                fontWeight:
                  "600",
              }}
            >

              {cat === "ALL"
                ? "🌐 All Types"
                : cat === "UPI"
                ? "💳 UPI Fraud"
                : cat === "JOB"
                ? "💼 Job Scams"
                : cat ===
                  "PHISHING"
                ? "🔗 Phishing"
                : cat ===
                  "INVESTMENT"
                ? "📈 Investment"
                : "⚠️ Other"}

            </button>

          ))}

        </div>


        {/* =====================================
            RISK FILTER
        ====================================== */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            justifyContent:
              "center",
            marginTop: "15px",
          }}
        >

          {[
            "ALL",
            "LOW",
            "MEDIUM",
            "HIGH",
            "CRITICAL",
          ].map((risk) => (

            <button
              key={risk}
              type="button"
              onClick={() =>
                setFilterRisk(
                  risk
                )
              }
              style={{
                padding:
                  "10px 18px",
                borderRadius:
                  "20px",
                background:
                  filterRisk === risk
                    ? "#704cff"
                    : "#192238",
                color: "white",
                border:
                  filterRisk === risk
                    ? "1px solid #947cff"
                    : "1px solid #303b53",
                cursor:
                  "pointer",
                fontWeight:
                  "600",
              }}
            >

              {risk === "ALL"
                ? "🌐 All Risk"
                : risk === "LOW"
                ? "🟢 Low Risk"
                : risk === "MEDIUM"
                ? "🟡 Medium Risk"
                : risk === "HIGH"
                ? "🔴 High Risk"
                : "🚨 Critical Risk"}

            </button>

          ))}

        </div>


        {/* =====================================
            CLEAR FILTER BUTTON
        ====================================== */}

        {(searchQuery ||
          filterType !== "ALL" ||
          filterRisk !== "ALL") && (

          <div
            style={{
              textAlign: "center",
              marginTop: "15px",
            }}
          >

            <button
              type="button"
              onClick={
                clearFilters
              }
              style={{
                padding:
                  "9px 20px",
                borderRadius:
                  "20px",
                background:
                  "#333b50",
                color: "white",
                border:
                  "1px solid #555",
                cursor:
                  "pointer",
              }}
            >
              ❌ Clear Search & Filters
            </button>

          </div>

        )}

      </div>


      {/* =====================================
          SEARCH RESULT COUNT
      ====================================== */}

      <p
        style={{
          textAlign: "center",
          color: "#9da8c0",
          marginBottom: "20px",
        }}
      >
        Showing{" "}
        <strong>
          {filteredReports.length}
        </strong>{" "}
        report(s)
      </p>


      {/* =====================================
          REPORTS
      ====================================== */}

      <div className="reports-container">

        {filteredReports.length ===
        0 ? (

          <div
            style={{
              gridColumn:
                "1 / -1",
              textAlign: "center",
              padding: "50px",
              color: "#8d98ad",
            }}
          >

            <h2>
              🔍 No reports found
            </h2>

            <p>
              Try another phone number,
              URL, scam type or risk
              level.
            </p>

            <button
              onClick={
                clearFilters
              }
              style={{
                padding:
                  "10px 20px",
                borderRadius:
                  "8px",
                background:
                  "#704cff",
                color: "white",
                border: "none",
                cursor:
                  "pointer",
              }}
            >
              Reset Filters
            </button>

          </div>

        ) : (

          filteredReports.map(
            (report) => (

              <div
                className="scam-report"
                key={
                  report.id
                }
              >

                {/* REPORT HEADER */}

                <div className="report-header">

                  <span className="report-type">

                    {report.icon}{" "}

                    {report.type}

                  </span>


                  <span
                    className={
                      report.risk ===
                      "CRITICAL"
                        ? "critical-risk"
                        : report.risk ===
                          "HIGH"
                        ? "high-risk"
                        : ""
                    }
                  >

                    {report.risk ===
                    "CRITICAL"
                      ? "🚨"
                      : report.risk ===
                        "HIGH"
                      ? "🔴"
                      : report.risk ===
                        "MEDIUM"
                      ? "🟡"
                      : "🟢"}{" "}

                    {report.risk}{" "}
                    RISK

                  </span>

                </div>


                {/* TITLE */}

                <h2
                  style={{
                    fontSize:
                      "18px",
                    color:
                      "white",
                  }}
                >
                  {
                    report.title
                  }
                </h2>


                {/* DESCRIPTION */}

                <p>
                  {
                    report.description
                  }
                </p>


                {/* PHONE */}

                {report.phone && (

                  <p
                    style={{
                      color:
                        "#aab5ca",
                      fontSize:
                        "13px",
                    }}
                  >
                    📞 Phone:{" "}
                    {
                      report.phone
                    }
                  </p>

                )}


                {/* URL */}

                {report.url && (

                  <p
                    style={{
                      color:
                        "#aab5ca",
                      fontSize:
                        "13px",
                      wordBreak:
                        "break-all",
                    }}
                  >
                    🔗 URL:{" "}
                    {
                      report.url
                    }
                  </p>

                )}


                {/* EVIDENCE */}

                {report.evidence && (

                  <div
                    style={{
                      marginTop:
                        "10px",
                      padding:
                        "8px 12px",
                      background:
                        "#080d18",
                      borderRadius:
                        "6px",
                      fontSize:
                        "12px",
                      color:
                        "#aab5ca",
                      borderLeft:
                        "2px solid #704cff",
                    }}
                  >

                    <strong>
                      Evidence:
                    </strong>{" "}

                    {
                      report.evidence
                    }

                  </div>

                )}


                {/* FOOTER */}

                <div className="report-footer">

                  <span>

                    {report.isDefault
                      ? "👥 Community Report"
                      : "👤 User Submitted Report"}

                  </span>


                  <span>

                    🕒{" "}
                    {
                      report.date
                    }

                  </span>

                </div>


                {/* EDIT + DELETE */}

                {!report.isDefault && (

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "10px",
                      marginTop:
                        "12px",
                    }}
                  >

                    <button
                      type="button"
                      onClick={() =>
                        handleEdit(
                          report
                        )
                      }
                      style={{
                        flex: 1,
                        padding:
                          "10px",
                        background:
                          "#704cff",
                        color:
                          "white",
                        border:
                          "1px solid #947cff",
                        borderRadius:
                          "6px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "600",
                      }}
                    >
                      ✏️ Edit
                    </button>


                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteUserReport(
                          report.id
                        )
                      }
                      style={{
                        flex: 1,
                        padding:
                          "10px",
                        background:
                          "rgba(255, 63, 85, 0.15)",
                        border:
                          "1px solid #ff3f55",
                        color:
                          "#ff6678",
                        borderRadius:
                          "6px",
                        cursor:
                          "pointer",
                        fontWeight:
                          "600",
                      }}
                    >
                      🗑️ Delete
                    </button>

                  </div>

                )}

              </div>

            )

          )

        )}

      </div>

    </div>
  );
}

export default Reports;