import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {

  const { user, logout } = useContext(AuthContext);

  const [summary, setSummary] = useState(null);
  const [shipmentStatus, setShipmentStatus] = useState(null);
  const [message, setMessage] = useState("");

  const loadSummary = async () => {

    const savedUser = localStorage.getItem("user");

    const loggedInUser = savedUser
      ? JSON.parse(savedUser)
      : null;

    const token = loggedInUser?.token;

    try {

      const response = await fetch(
        "http://localhost:8080/api/reports/summary",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load dashboard");
      }

      const data = await response.json();

      setSummary(data);


      const statusResponse = await fetch(
        "http://localhost:8080/api/reports/shipment-status",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!statusResponse.ok) {
        throw new Error("Failed to load shipment status");
      }

      const statusData = await statusResponse.json();

      setShipmentStatus(statusData);

    } catch (error) {

      console.error(error);
      setMessage("Unable to load dashboard data");

    }
  };

  useEffect(() => {

    if (user?.role === "ADMIN") {
      loadSummary();
    }

  }, [user]);

  return (
    <div>

      <h1>Logistics & Parcel Tracking System</h1>

      <hr />

      <nav>

        <Link to="/dashboard">Dashboard</Link>
        {" | "}
        <Link to="/shipments">Shipments</Link>
        {" | "}
        <Link to="/warehouses">Warehouses</Link>
        {" | "}
        <Link to="/deliveries">Deliveries</Link>
        {" | "}
        <Link to="/track">Tracking</Link>
         {" | "}
        <Link to="/tracking-history">Tracking History</Link>
        {" | "}
        <Link to="/reports">Reports</Link>
         {" | "}
        <Link to="/routes">Routes</Link>
         {" | "}
        <Link to="/delivery-proofs">Delivery Proof</Link>
        

      </nav>

      <hr />

      <h2>Dashboard</h2>

      <p>
        Welcome, {user?.email}
      </p>

      <p>
        Role: {user?.role}
      </p>

      <button onClick={logout}>
        Logout
      </button>

      {message && (
        <p>{message}</p>
      )}

      {user?.role === "ADMIN" && summary && (

        <div>

          <h2>Overview</h2>

          {/* KPI CARDS */}

          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "nowrap",
              overflowX: "auto"
            }}
          >

            <div style={{
              border: "1px solid #ddd",
              padding: "10px",
              minWidth: "150px",
              textAlign: "center"
            }}>
              <h3>Total Shipments</h3>
              <p>{summary.totalShipments}</p>
            </div>

            <div style={{
              border: "1px solid #ddd",
              padding: "10px",
              minWidth: "150px",
              textAlign: "center"
            }}>
              <h3>Total Warehouses</h3>
              <p>{summary.totalWarehouses}</p>
            </div>

            <div style={{
              border: "1px solid #ddd",
              padding: "10px",
              minWidth: "150px",
              textAlign: "center"
            }}>
              <h3>Total Deliveries</h3>
              <p>{summary.totalDeliveries}</p>
            </div>

            <div style={{
              border: "1px solid #ddd",
              padding: "10px",
              minWidth: "150px",
              textAlign: "center"
            }}>
              <h3>Total Tracking Records</h3>
              <p>{summary.totalTrackingRecords}</p>
            </div>

            <div style={{
              border: "1px solid #ddd",
              padding: "10px",
              minWidth: "150px",
              textAlign: "center"
            }}>
              <h3>Total Routes</h3>
              <p>{summary.totalRoutes}</p>
            </div>

            <div style={{
              border: "1px solid #ddd",
              padding: "10px",
              minWidth: "150px",
              textAlign: "center"
            }}>
              <h3>Total Delivery Proofs</h3>
              <p>{summary.totalDeliveryProofs}</p>
            </div>

          </div>


          {/* SHIPMENT STATUS */}

          {shipmentStatus && (

            <div>

              <h2>Shipment Status</h2>

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  flexWrap: "nowrap",
                  overflowX: "auto"
                }}
              >

                <div style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  minWidth: "150px",
                  textAlign: "center"
                }}>
                  <h3>Pending</h3>
                  <p>{shipmentStatus.pending}</p>
                </div>

                <div style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  minWidth: "150px",
                  textAlign: "center"
                }}>
                  <h3>Picked Up</h3>
                  <p>{shipmentStatus.pickedUp}</p>
                </div>

                <div style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  minWidth: "150px",
                  textAlign: "center"
                }}>
                  <h3>In Transit</h3>
                  <p>{shipmentStatus.inTransit}</p>
                </div>

                <div style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  minWidth: "150px",
                  textAlign: "center"
                }}>
                  <h3>Out for Delivery</h3>
                  <p>{shipmentStatus.outForDelivery}</p>
                </div>

                <div style={{
                  border: "1px solid #ddd",
                  padding: "10px",
                  minWidth: "150px",
                  textAlign: "center"
                }}>
                  <h3>Delivered</h3>
                  <p>{shipmentStatus.delivered}</p>
                </div>

              </div>

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default Dashboard;