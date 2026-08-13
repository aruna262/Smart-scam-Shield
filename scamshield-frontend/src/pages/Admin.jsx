import { useEffect, useState } from "react";

function Admin() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  // ==============================
  // LOAD REPORTS
  // ==============================

  const loadReports = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/reports"
      );

      if (!response.ok) {
        throw new Error("Failed to load reports");
      }

      const data = await response.json();

      setReports(data);
    } catch (error) {
      console.error("Admin load error:", error);
      alert("❌ Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // ==============================
  // VERIFY REPORT
  // ==============================

  const handleVerify = async (report) => {
    try {
      const response = await fetch(
        `http://localhost:8080/reports/${report.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...report,
            status: "VERIFIED",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Verification failed");
      }

      alert("✅ Report verified successfully!");

      loadReports();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to verify report");
    }
  };

  // ==============================
  // PENDING
  // ==============================

  const handlePending = async (report) => {
    try {
      const response = await fetch(
        `http://localhost:8080/reports/${report.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...report,
            status: "PENDING",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Status update failed");
      }

      alert("⏳ Report moved to Pending");

      loadReports();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update status");
    }
  };

  // ==============================
  // DELETE
  // ==============================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
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
        throw new Error("Delete failed");
      }

      alert("🗑️ Report deleted successfully!");

      loadReports();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete report");
    }
  };

  // ==============================
  // FILTER
  // ==============================

  const filteredReports = reports.filter((report) => {
    const status = (
      report.status || "PENDING"
    ).toUpperCase();

    if (filter === "ALL") {
      return true;
    }

    return status === filter;
  });

  // ==============================
  // STATISTICS
  // ==============================

  const totalReports = reports.length;

  const verifiedReports = reports.filter(
    (report) =>
      (report.status || "").toUpperCase() ===
      "VERIFIED"
  ).length;

  const pendingReports = reports.filter(
    (report) =>
      !report.status ||
      report.status.toUpperCase() ===
        "PENDING"
  ).length;

  const highRiskReports = reports.filter(
    (report) => {
      const risk = (
        report.riskLevel ||
        report.risk ||
        ""
      ).toUpperCase();

      return (
        risk === "HIGH" ||
        risk === "CRITICAL"
      );
    }
  ).length;

  // ==============================
  // UI
  // ==============================

  return (
    <div className="page-container">

      {/* HEADER */}

      <h1>
        👨‍💼 Admin Panel
      </h1>

      <p className="page-description">
        Manage, verify and monitor
        community scam reports.
      </p>

      {/* =========================
          STATISTICS
      ========================== */}

      <div className="stats">

        <div className="stat-card">
          <h2>
            {totalReports}
          </h2>
          <p>
            📋 Total Reports
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {highRiskReports}
          </h2>
          <p>
            🔴 High Risk
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {verifiedReports}
          </h2>
          <p>
            ✅ Verified
          </p>
        </div>

        <div className="stat-card">
          <h2>
            {pendingReports}
          </h2>
          <p>
            ⏳ Pending
          </p>
        </div>

      </div>

      {/* =========================
          FILTER BUTTONS
      ========================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexWrap: "wrap",
          margin: "30px 0",
        }}
      >

        {[
          "ALL",
          "VERIFIED",
          "PENDING",
        ].map((item) => (

          <button
            key={item}
            type="button"
            onClick={() =>
              setFilter(item)
            }
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              border:
                filter === item
                  ? "1px solid #947cff"
                  : "1px solid #303b53",
              background:
                filter === item
                  ? "#704cff"
                  : "#192238",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >

            {item === "ALL"
              ? "🌐 All"
              : item === "VERIFIED"
              ? "✅ Verified"
              : "⏳ Pending"}

          </button>

        ))}

      </div>

      {/* =========================
          LOADING
      ========================== */}

      {loading ? (

        <div
          style={{
            textAlign: "center",
            padding: "50px",
          }}
        >
          <h2>
            ⏳ Loading reports...
          </h2>
        </div>

      ) : (

        <div className="reports-container">

          {filteredReports.length === 0 ? (

            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "50px",
                color: "#8d98ad",
              }}
            >

              <h2>
                📭 No reports found
              </h2>

            </div>

          ) : (

            filteredReports.map(
              (report) => {

                const risk = (
                  report.riskLevel ||
                  report.risk ||
                  "HIGH"
                ).toUpperCase();

                const status = (
                  report.status ||
                  "PENDING"
                ).toUpperCase();

                return (

                  <div
                    className="scam-report"
                    key={report.id}
                  >

                    {/* HEADER */}

                    <div
                      className="report-header"
                    >

                      <span
                        className="report-type"
                      >
                        🚨{" "}
                        {(
                          report.scamType ||
                          "OTHER"
                        ).toUpperCase()}
                      </span>

                      <span
                        style={{
                          padding:
                            "5px 10px",
                          borderRadius:
                            "15px",
                          background:
                            status ===
                            "VERIFIED"
                              ? "#123d2b"
                              : "#3d3212",
                          color:
                            status ===
                            "VERIFIED"
                              ? "#4cff9b"
                              : "#ffd35a",
                          fontSize:
                            "12px",
                          fontWeight:
                            "bold",
                        }}
                      >
                        {status ===
                        "VERIFIED"
                          ? "✅ VERIFIED"
                          : "⏳ PENDING"}
                      </span>

                    </div>

                    {/* TITLE */}

                    <h2
                      style={{
                        color: "white",
                        fontSize: "18px",
                      }}
                    >
                      {report.title ||
                        report.scamType ||
                        "Scam Report"}
                    </h2>

                    {/* DESCRIPTION */}

                    <p>
                      {report.description ||
                        "No description"}
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
                        {report.phone}
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
                        {report.url}
                      </p>

                    )}

                    {/* RISK */}

                    <div
                      style={{
                        marginTop:
                          "12px",
                        fontWeight:
                          "bold",
                        color:
                          risk ===
                          "CRITICAL"
                            ? "#ff4057"
                            : risk ===
                              "HIGH"
                            ? "#ff6678"
                            : "#ffd35a",
                      }}
                    >
                      {risk ===
                      "CRITICAL"
                        ? "🚨"
                        : risk === "HIGH"
                        ? "🔴"
                        : "🟡"}{" "}
                      {risk} RISK
                    </div>

                    {/* FOOTER */}

                    <div
                      className="report-footer"
                    >

                      <span>
                        👤 User Report
                      </span>

                      <span>
                        🕒{" "}
                        {report.createdAt
                          ? new Date(
                              report.createdAt
                            ).toLocaleDateString()
                          : "Recently"}
                      </span>

                    </div>

                    {/* ADMIN ACTIONS */}

                    <div
                      style={{
                        display:
                          "flex",
                        gap: "10px",
                        marginTop:
                          "15px",
                      }}
                    >

                      {status !==
                        "VERIFIED" && (

                        <button
                          type="button"
                          onClick={() =>
                            handleVerify(
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
                              "none",
                            borderRadius:
                              "6px",
                            cursor:
                              "pointer",
                            fontWeight:
                              "bold",
                          }}
                        >
                          ✅ Verify
                        </button>

                      )}

                      {status !==
                        "PENDING" && (

                        <button
                          type="button"
                          onClick={() =>
                            handlePending(
                              report
                            )
                          }
                          style={{
                            flex: 1,
                            padding:
                              "10px",
                            background:
                              "#333b50",
                            color:
                              "white",
                            border:
                              "none",
                            borderRadius:
                              "6px",
                            cursor:
                              "pointer",
                          }}
                        >
                          ⏳ Pending
                        </button>

                      )}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            report.id
                          )
                        }
                        style={{
                          flex: 1,
                          padding:
                            "10px",
                          background:
                            "rgba(255,63,85,0.15)",
                          color:
                            "#ff6678",
                          border:
                            "1px solid #ff3f55",
                          borderRadius:
                            "6px",
                          cursor:
                            "pointer",
                          fontWeight:
                            "bold",
                        }}
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                );
              }
            )

          )}

        </div>

      )}

    </div>
  );
}

export default Admin;