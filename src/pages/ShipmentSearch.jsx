import { useState } from "react";

function ShipmentSearch() {

  const [shipmentId, setShipmentId] = useState("");
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  const getToken = () => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    return user?.token;
  };

  const searchShipment = async () => {

    if (!shipmentId) {
      setMessage("Please enter Shipment ID");
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8080/api/shipments/track/${shipmentId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Shipment not found");
      }

      const result = await response.json();

      setData(result);
      setMessage("");

    } catch (error) {

      console.error(error);
      setData(null);
      setMessage("Shipment not found");

    }
  };

  return (
    <div style={{ padding: "30px" }}>

      <h1>Shipment Search</h1>

      <input
        type="text"
        placeholder="Enter Shipment ID"
        value={shipmentId}
        onChange={(e) => setShipmentId(e.target.value)}
      />

      <button onClick={searchShipment}>
        Search
      </button>

      {message && <p>{message}</p>}

      {data && (
        <div>

          <h2>Shipment Details</h2>
          <p>Tracking Number: {data.shipment?.trackingNumber}</p>
          <p>Sender: {data.shipment?.senderName}</p>
          <p>Receiver: {data.shipment?.receiverName}</p>
          <p>Source: {data.shipment?.source}</p>
          <p>Destination: {data.shipment?.destination}</p>
          <p>Status: {data.shipment?.status}</p>

          <h2>Delivery Partner</h2>
          <p>
            {data.delivery
              ? data.delivery.deliveryPerson
              : "No delivery assigned"}
          </p>

          <h2>Warehouse</h2>
          <p>
            {data.warehouse
              ? data.warehouse.warehouseName
              : "No warehouse assigned"}
          </p>

          <h2>Route</h2>
          <p>
            {data.route
              ? data.route.routeName
              : "No route assigned"}
          </p>

        </div>
      )}

    </div>
  );
}

export default ShipmentSearch;