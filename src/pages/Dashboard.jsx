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
        fetch("https://logistransport-backend-hp98.onrender.com/api/reports/summary", {
          method: "GET",
          headers,
        }),
        fetch("https://logistransport-backend-hp98.onrender.com/api/reports/shipment-status", {
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
      <div key={label} id="card-style">
        <h3 id="card-heading-style">{label}</h3>
        <p id="number-style">{value ?? 0}</p>
      </div>
    ));

  return (
    <div id="page-style">
      <h1 id="page-heading-style">Dashboard</h1>

      <div id="welcome-style">
        <p style={{ margin: "0 0 8px" }}>
          Welcome, <strong>{user?.email}</strong>
        </p>

        <p style={{ margin: 0 }}>
          Role: <strong>{user?.role}</strong>
        </p>
      </div>

      {message && (
        <p role="alert" id="message-style">
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
              <section id="section-style">
                <h2 id="section-heading-style">Overview</h2>

                <div id="grid-style">
                  {renderCards(summaryCards)}
                </div>
              </section>

              {shipmentStatus && (
                <section id="section-style">
                  <h2 id="section-heading-style">
                    Shipment Status
                  </h2>

                  <div id="grid-style">
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
                id="refresh-button-style"
              >
                Refresh Dashboard
              </button>
            </div>
          )}
        </>
      )}

      {user?.role !== "ADMIN" && (
        <div id="section-style">
          <h2 id="section-heading-style">Welcome to LogiTransport</h2>
          <p style={{ color: "#475569", marginBottom: 0 }}>
            Use Shipment Tracking to check the latest status of your parcel.
          </p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;