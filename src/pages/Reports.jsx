import { useEffect, useState } from "react";

function Reports() {

  const [summary, setSummary] = useState(null);
  const [shipmentStatus, setShipmentStatus] = useState(null);
  const [message, setMessage] = useState("");

  const getToken = () => {

    const savedUser = localStorage.getItem("user");

    const user = savedUser
      ? JSON.parse(savedUser)
      : null;

    return user?.token;
  };

  const loadReports = async () => {

    const token = getToken();

    try {

      const summaryResponse = await fetch(
        "http://localhost:8080/api/reports/summary",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!summaryResponse.ok) {
        throw new Error("Failed to load summary report");
      }

      const summaryData = await summaryResponse.json();

      setSummary(summaryData);


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

      setMessage("Unable to load reports");

    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div>

      <h1>Reports</h1>

      {message && (
        <p>{message}</p>
      )}

      {summary && (
        <div>

          <h2>Summary Report</h2>

          <table border="1">

            <thead>
              <tr>
                <th>Report</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>Total Shipments</td>
                <td>{summary.totalShipments}</td>
              </tr>

              <tr>
                <td>Total Warehouses</td>
                <td>{summary.totalWarehouses}</td>
              </tr>

              <tr>
                <td>Total Deliveries</td>
                <td>{summary.totalDeliveries}</td>
              </tr>

              <tr>
                <td>Total Tracking Records</td>
                <td>{summary.totalTrackingRecords}</td>
              </tr>

              <tr>
                <td>Total Routes</td>
                <td>{summary.totalRoutes}</td>
              </tr>

              <tr>
                <td>Total Delivery Proofs</td>
                <td>{summary.totalDeliveryProofs}</td>
              </tr>

            </tbody>

          </table>

        </div>
      )}

      {shipmentStatus && (
        <div>

          <h2>Shipment Status Report</h2>

          <table border="1">

            <thead>
              <tr>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>Pending</td>
                <td>{shipmentStatus.pending}</td>
              </tr>

              <tr>
                <td>Picked Up</td>
                <td>{shipmentStatus.pickedup}</td>
              </tr>

              <tr>
                <td>In Transit</td>
                <td>{shipmentStatus.inTransit}</td>
              </tr>

              <tr>
                <td>Out for Delivery</td>
                <td>{shipmentStatus.outForDelivery}</td>
              </tr>
              
              <tr>
                <td>Delivered</td>
                <td>{shipmentStatus.delivered}</td>
              </tr>

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default Reports;