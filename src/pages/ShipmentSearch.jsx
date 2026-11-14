
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
        `https://logistransport-backend-hp98.onrender.com/api/shipments/search/${encodeURIComponent(shipmentId.trim())}`,
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


  const Detail = ({ label, value }) => (
    <div id="row-style">
      <strong style={{ color: "#334155" }}>{label}</strong>
      <span>{value || "Not available"}</span>
    </div>
  );

  const shipment = data?.shipment ?? data;
  const delivery = data?.delivery;
  const warehouse = data?.warehouse;
  const route = data?.route;

  return (
    <div id="box1">
      <h1 id="h1">
        Shipment Search
      </h1>

      <div id="shipment-box">
        <input
          type="text"
          placeholder="Enter Shipment ID (e.g. SID001)"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchShipment();
          }}
         id="shipment-boxx"
        />

        <button
          onClick={searchShipment}
          disabled={loading}
         id="search-button"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {message && (
        <p
          role="alert"
         id="alert"
        >
          {message}
        </p>
      )}

      {data && (
        <div style={{ display: "grid", gap: "20px", marginTop: "25px" }}>
          <section style={cardStyle}>
            <h2 id="h2">
              Shipment Details
            </h2>
            <Detail label="Shipment ID" value={shipment?.shipmentId} />
            <Detail label="Tracking Number" value={shipment?.trackingNumber} />
            <Detail label="Sender" value={shipment?.senderName} />
            <Detail label="Receiver" value={shipment?.receiverName} />
            <Detail label="Mobile Number" value={shipment?.mobileNumber} />
            <Detail label="Source" value={shipment?.source} />
            <Detail label="Destination" value={shipment?.destination} />
            <Detail label="Status" value={shipment?.status} />
          </section>

          <section id="card-style">
            <h2 id="h2">
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
            <h2 id="h2">Warehouse</h2>
            <Detail
              label="Warehouse Name"
              value={warehouse?.warehouseName || "No warehouse assigned"}
            />
            <Detail label="Location" value={warehouse?.location} />
            <Detail label="Manager" value={warehouse?.managerName} />
          </section>

        </div>
      )}
    </div>
  );
}

export default ShipmentSearch;