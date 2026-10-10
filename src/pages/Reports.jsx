import { useEffect, useState } from "react";

function Reports() {
  const [summary, setSummary] = useState(null);
  const [shipmentStatus, setShipmentStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    return user?.token;
  };

  const loadReports = async () => {
    const token = getToken();

    if (!token) {
      setMessage("Please log in to view reports.");
      setLoading(false);
      return;
    }

    try {
      setMessage("");

      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      const [summaryResponse, statusResponse] = await Promise.all([
        fetch("http://localhost:8080/api/reports/summary", {
          method: "GET",
          headers,
        }),
        fetch("http://localhost:8080/api/reports/shipment-status", {
          method: "GET",
          headers,
        }),
      ]);

      if (!summaryResponse.ok || !statusResponse.ok) {
        throw new Error("Failed to load reports. Please try again.");
      }

      const [summaryData, statusData] = await Promise.all([
        summaryResponse.json(),
        statusResponse.json(),
      ]);

      setSummary(summaryData);
      setShipmentStatus(statusData);
    } catch (error) {
      console.error("Report loading error:", error);
      setMessage(error.message || "Unable to load reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const panelStyle = {
    flex: "1 1 420px",
    minWidth: 0,
    background: "#ffffff",
    padding: "22px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    boxShadow: "0 5px 16px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    border: "1px solid #cbd5e1",
  };

  const headerStyle = {
    padding: "13px 15px",
    border: "1px solid #cbd5e1",
    background: "#17365d",
    color: "#ffffff",
    textAlign: "left",
    fontWeight: "600",
  };

  const cellStyle = {
    padding: "13px 15px",
    border: "1px solid #cbd5e1",
    color: "#334155",
    background: "#ffffff",
  };

  const totalStyle = {
    ...cellStyle,
    textAlign: "center",
    fontWeight: "700",
    color: "#17365d",
  };

  const summaryRows = summary
    ? [
        ["Total Shipments", summary.totalShipments],
        ["Total Warehouses", summary.totalWarehouses],
        ["Total Deliveries", summary.totalDeliveries],
        ["Total Tracking Records", summary.totalTrackingRecords],
        ["Total Routes", summary.totalRoutes],
        ["Total Delivery Proofs", summary.totalDeliveryProofs],
      ]
    : [];

  const statusRows = shipmentStatus
    ? [
        ["Pending", shipmentStatus.pending],
        ["Picked Up", shipmentStatus.pickedUp],
        ["In Transit", shipmentStatus.inTransit],
        ["Out for Delivery", shipmentStatus.outForDelivery],
        ["Delivered", shipmentStatus.delivered],
      ]
    : [];

  const renderTable = (firstHeading, rows) => (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={headerStyle}>{firstHeading}</th>
            <th style={{ ...headerStyle, textAlign: "center" }}>
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map(([label, value], index) => (
            <tr key={label}>
              <td
                style={{
                  ...cellStyle,
                  background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                }}
              >
                {label}
              </td>
              <td
                style={{
                  ...totalStyle,
                  background: index % 2 === 0 ? "#ffffff" : "#f8fafc",
                }}
              >
                {value ?? 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "30px auto",
        padding: "25px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        boxShadow: "0 5px 18px rgba(0,0,0,0.06)",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#17365d",
          marginTop: 0,
          marginBottom: "30px",
          paddingBottom: "15px",
          borderBottom: "3px solid #17365d",
        }}
      >
        Reports
      </h1>

      {message && (
        <div
          role="alert"
          style={{
            padding: "13px",
            marginBottom: "20px",
            background: "#fef2f2",
            color: "#b91c1c",
            border: "1px solid #fecaca",
            borderRadius: "8px",
          }}
        >
          {message}
        </div>
      )}

      {loading && (
        <p style={{ textAlign: "center", color: "#475569" }}>
          Loading reports...
        </p>
      )}

      {!loading && !message && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "25px",
            alignItems: "flex-start",
          }}
        >
          <section style={panelStyle}>
            <h2
              style={{
                textAlign: "center",
                color: "#17365d",
                marginTop: 0,
                marginBottom: "20px",
              }}
            >
              Summary Report
            </h2>

            {renderTable("Report", summaryRows)}
          </section>

          <section style={panelStyle}>
            <h2
              style={{
                textAlign: "center",
                color: "#17365d",
                marginTop: 0,
                marginBottom: "20px",
              }}
            >
              Shipment Status Report
            </h2>

            {renderTable("Status", statusRows)}
          </section>
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "25px" }}>
        <button
          onClick={() => {
            setLoading(true);
            loadReports();
          }}
          disabled={loading}
          style={{
            padding: "11px 24px",
            background: loading ? "#94a3b8" : "#17365d",
            color: "#ffffff",
            border: "none",
            borderRadius: "7px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 3px 0 #0f2744",
          }}
        >
          Refresh Reports
        </button>
      </div>
    </div>
  );
}

export default Reports;