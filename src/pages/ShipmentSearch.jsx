
import { useState } from "react";

function ShipmentSearch() {
  const [shipmentId, setShipmentId] = useState("");
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    return user?.token;
  };

  const searchShipment = async () => {
    const searchId = shipmentId.trim();

    if (!searchId) {
      setData(null);
      setMessage("Please enter Shipment ID");
      return;
    }

    const token = getToken();

    if (!token) {
      setData(null);
      setMessage("Please log in again");
      return;
    }

    setLoading(true);
    setData(null);
    setMessage("");

    try {
      const response = await fetch(
        `https://logistransport-backend-7oqv.onrender.com/api/shipments/search/${encodeURIComponent(shipmentId.trim())}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
          }
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Shipment ID not found. Please check the ID.");
        }

        if (response.status === 401 || response.status === 403) {
          throw new Error("You are not authorized. Please log in again.");
        }

        const errorText = await response.text();
        console.error("Shipment search failed:", response.status, errorText);

        throw new Error(
          `Unable to search shipment. Server returned ${response.status}.`
        );
      }

      const result = await response.json();

      // Supports either a direct shipment response or a tracking overview.
      const shipment = result.shipment ?? result;

      if (!shipment || (!shipment.shipmentId && !shipment.trackingNumber)) {
        throw new Error(
          "The server response does not contain shipment details."
        );
      }

      setData(result);
      setMessage("");
    } catch (error) {
      console.error("Shipment search error:", error);
      setData(null);
      setMessage(error.message || "Unable to search shipment.");
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "18px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.06)"
  };

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "minmax(130px, 180px) 1fr",
    gap: "12px",
    padding: "10px 0",
    borderBottom: "1px solid #e2e8f0",
    overflowWrap: "anywhere"
  };

  const Detail = ({ label, value }) => (
    <div style={rowStyle}>
      <strong style={{ color: "#334155" }}>{label}</strong>
      <span>{value || "Not available"}</span>
    </div>
  );

  const shipment = data?.shipment ?? data;
  const delivery = data?.delivery;
  const warehouse = data?.warehouse;
  const route = data?.route;

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        padding: "25px",
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        boxShadow: "0 6px 20px rgba(0,0,0,0.10)"
      }}
    >
      <h1
        style={{
          color: "#17365d",
          marginTop: 0,
          marginBottom: "22px"
        }}
      >
        Shipment Search
      </h1>

      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "18px"
        }}
      >
        <input
          type="text"
          placeholder="Enter Shipment ID (e.g. SID011)"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchShipment();
          }}
          style={{
            flex: "1 1 300px",
            minWidth: 0,
            padding: "12px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            fontSize: "15px",
            boxSizing: "border-box",
            outlineColor: "#2563eb"
          }}
        />

        <button
          onClick={searchShipment}
          disabled={loading}
          style={{
            padding: "12px 28px",
            background: loading ? "#94a3b8" : "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0 4px 0 #1d4ed8"
          }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {message && (
        <p
          role="alert"
          style={{
            padding: "12px",
            color: "#b91c1c",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px"
          }}
        >
          {message}
        </p>
      )}

      {data && (
        <div style={{ display: "grid", gap: "20px", marginTop: "25px" }}>
          <section style={cardStyle}>
            <h2 style={{ color: "#17365d", marginTop: 0 }}>
              Shipment Details
            </h2>
            <Detail label="Shipment ID" value={shipment?.shipmentId} />
            <Detail label="Tracking Number" value={shipment?.trackingNumber} />
            <Detail label="Sender" value={shipment?.senderName} />
            <Detail label="Receiver" value={shipment?.receiverName} />
            <Detail label="Source" value={shipment?.source} />
            <Detail label="Destination" value={shipment?.destination} />
            <Detail label="Status" value={shipment?.status} />
          </section>

          <section style={cardStyle}>
            <h2 style={{ color: "#17365d", marginTop: 0 }}>
              Delivery Partner
            </h2>
            <Detail
              label="Delivery Person"
              value={delivery?.deliveryPerson || "No delivery assigned"}
            />
            <Detail label="Delivery Date" value={delivery?.deliveryDate} />
            <Detail label="Delivery Status" value={delivery?.status} />
          </section>

          <section style={cardStyle}>
            <h2 style={{ color: "#17365d", marginTop: 0 }}>Warehouse</h2>
            <Detail
              label="Warehouse Name"
              value={warehouse?.warehouseName || "No warehouse assigned"}
            />
            <Detail label="Location" value={warehouse?.location} />
            <Detail label="Manager" value={warehouse?.managerName} />
          </section>

          {/* <section style={cardStyle}>
            <h2 style={{ color: "#17365d", marginTop: 0 }}>Route</h2>
            <Detail
              label="Route Name"
              value={route?.routeName || "No route assigned"}
            />
          </section> */}
        </div>
      )}
    </div>
  );
}

export default ShipmentSearch;