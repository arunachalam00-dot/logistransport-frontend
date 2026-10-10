import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);

  const [summary, setSummary] = useState(null);
  const [shipmentStatus, setShipmentStatus] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    const savedUser = localStorage.getItem("user");
    const loggedInUser = savedUser
      ? JSON.parse(savedUser)
      : null;

    return loggedInUser?.token;
  };

  const loadDashboard = async () => {
    const token = getToken();

    if (!token) {
      setMessage("Please log in to view dashboard data.");
      return;
    }

    setLoading(true);

    try {
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
        throw new Error("Failed to load dashboard data.");
      }

      const [summaryData, statusData] = await Promise.all([
        summaryResponse.json(),
        statusResponse.json(),
      ]);

      setSummary(summaryData);
      setShipmentStatus(statusData);
      setMessage("");
    } catch (error) {
      console.error("Dashboard loading error:", error);
      setMessage("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      loadDashboard();
    }
  }, [user]);

  const summaryCards = summary
    ? [
        ["Total Shipments", summary.totalShipments],
        ["Total Warehouses", summary.totalWarehouses],
        ["Total Deliveries", summary.totalDeliveries],
        ["Total Tracking Records", summary.totalTrackingRecords],
        ["Total Routes", summary.totalRoutes],
        ["Total Delivery Proofs", summary.totalDeliveryProofs],
      ]
    : [];

  const statusCards = shipmentStatus
    ? [
        ["Pending", shipmentStatus.pending],
        ["Picked Up", shipmentStatus.pickedUp],
        ["In Transit", shipmentStatus.inTransit],
        ["Out for Delivery", shipmentStatus.outForDelivery],
        ["Delivered", shipmentStatus.delivered],
      ]
    : [];

  const renderCards = (cards) =>
    cards.map(([label, value]) => (
      <div key={label} style={cardStyle}>
        <h3 style={cardHeadingStyle}>{label}</h3>
        <p style={numberStyle}>{value ?? 0}</p>
      </div>
    ));

  return (
    <div style={pageStyle}>
      <h1 style={pageHeadingStyle}>Dashboard</h1>

      <div style={welcomeStyle}>
        <p style={{ margin: "0 0 8px" }}>
          Welcome, <strong>{user?.email}</strong>
        </p>

        <p style={{ margin: 0 }}>
          Role: <strong>{user?.role}</strong>
        </p>
      </div>

      {message && (
        <p role="alert" style={messageStyle}>
          {message}
        </p>
      )}

      {user?.role === "ADMIN" && (
        <>
          {loading && (
            <p style={{ textAlign: "center", color: "#475569" }}>
              Loading dashboard...
            </p>
          )}

          {!loading && summary && (
            <>
              <section style={sectionStyle}>
                <h2 style={sectionHeadingStyle}>Overview</h2>

                <div style={gridStyle}>
                  {renderCards(summaryCards)}
                </div>
              </section>

              {shipmentStatus && (
                <section style={sectionStyle}>
                  <h2 style={sectionHeadingStyle}>
                    Shipment Status
                  </h2>

                  <div style={gridStyle}>
                    {renderCards(statusCards)}
                  </div>
                </section>
              )}
            </>
          )}

          {!loading && (
            <div style={{ textAlign: "center", marginTop: "25px" }}>
              <button
                onClick={loadDashboard}
                style={refreshButtonStyle}
              >
                Refresh Dashboard
              </button>
            </div>
          )}
        </>
      )}

      {user?.role !== "ADMIN" && (
        <div style={sectionStyle}>
          <h2 style={sectionHeadingStyle}>Welcome to LogiTransport</h2>
          <p style={{ color: "#475569", marginBottom: 0 }}>
            Use Shipment Tracking to check the latest status of your parcel.
          </p>
        </div>
      )}
    </div>
  );
}

const pageStyle = {
  maxWidth: "1200px",
  margin: "30px auto",
  padding: "25px",
  background: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  boxShadow: "0 5px 18px rgba(0,0,0,0.06)",
  boxSizing: "border-box",
};

const pageHeadingStyle = {
  textAlign: "center",
  color: "#17365d",
  marginTop: 0,
  marginBottom: "25px",
  paddingBottom: "15px",
  borderBottom: "3px solid #17365d",
};

const welcomeStyle = {
  padding: "18px 20px",
  marginBottom: "25px",
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
  color: "#334155",
};

const sectionStyle = {
  marginTop: "25px",
  padding: "22px",
  background: "#ffffff",
  border: "1px solid #cbd5e1",
  borderRadius: "12px",
  boxShadow: "0 5px 16px rgba(0,0,0,0.07)",
};

const sectionHeadingStyle = {
  textAlign: "center",
  color: "#17365d",
  marginTop: 0,
  marginBottom: "22px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "18px",
};

const cardStyle = {
  border: "1px solid #cbd5e1",
  borderRadius: "10px",
  padding: "20px 14px",
  textAlign: "center",
  backgroundColor: "#ffffff",
  boxShadow: "0 3px 9px rgba(0,0,0,0.06)",
  boxSizing: "border-box",
};

const cardHeadingStyle = {
  color: "#17365d",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 14px",
};

const numberStyle = {
  fontSize: "30px",
  fontWeight: "700",
  color: "#17365d",
  margin: 0,
};

const messageStyle = {
  padding: "12px",
  color: "#b91c1c",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
};

const refreshButtonStyle = {
  padding: "12px 24px",
  background: "#17365d",
  color: "#ffffff",
  border: "none",
  borderRadius: "7px",
  fontSize: "15px",
  fontWeight: "600",
  cursor: "pointer",
  boxShadow: "0 3px 0 #0f2744",
};

export default Dashboard;