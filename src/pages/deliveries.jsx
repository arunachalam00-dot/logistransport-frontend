
import { useEffect, useState } from "react";
import '../index.css';

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingDeliveryId, setEditingDeliveryId] = useState(null);

  const [shipmentId, setShipmentId] = useState("");
  const [deliveryPerson, setDeliveryPerson] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [status, setStatus] = useState("");

  const API_URL = "https://logistransport-backend-hp98.onrender.com/api/deliveries";
  const SHIPMENT_API_URL = "https://logistransport-backend-hp98.onrender.com/api/shipments";

  // Get JWT token
  const getToken = () => {
    try {
      const savedUser = localStorage.getItem("user");
      const user = savedUser ? JSON.parse(savedUser) : null;
      return user?.token;
    } catch {
      return null;
    }
  };

  // Common request headers
  const getHeaders = () => ({
    Authorization: `Bearer ${getToken()}`,
    "Content-Type": "application/json",
  });

  // Load deliveries
  const loadDeliveries = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to load deliveries");
      }

      const data = await response.json();
      setDeliveries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load deliveries");
    }
  };

  // Load shipments for the shipment ID dropdown
  const loadShipments = async () => {
    try {
      const response = await fetch(SHIPMENT_API_URL, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to load shipments");
      }

      const data = await response.json();
      setShipments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load shipments for selection");
    }
  };

  // Load data when the page opens
  useEffect(() => {
    loadDeliveries();
    loadShipments();
  }, []);

  // Clear form
  const clearForm = () => {
    setShipmentId("");
    setDeliveryPerson("");
    setDeliveryDate("");
    setStatus("");
    setEditingDeliveryId(null);
  };

  // Open create form
  const handleShowForm = () => {
    clearForm();
    setMessage("");
    setShowForm(true);
  };

  // Create delivery
  const handleCreateDelivery = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!shipmentId) {
      setMessage("Please select a shipment.");
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          shipment: {
            shipmentId: shipmentId,
          },
          deliveryPerson,
          deliveryDate,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create delivery");
      }

      setMessage("Delivery created successfully");
      clearForm();
      setShowForm(false);

      await loadDeliveries();
    } catch (error) {
      console.error(error);
      setMessage("Unable to create delivery. Check the selected shipment and backend.");
    }
  };

  // Edit delivery
  const handleEditDelivery = (delivery) => {
    setEditingDeliveryId(delivery.id);
    setShipmentId(delivery.shipment?.shipmentId || "");
    setDeliveryPerson(delivery.deliveryPerson || "");
    setDeliveryDate(
      delivery.deliveryDate ? String(delivery.deliveryDate).substring(0, 10) : ""
    );
    setStatus(delivery.status || "");

    setShowForm(true);
    setMessage("");
  };

  // Update delivery
  const handleUpdateDelivery = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!shipmentId) {
      setMessage("Please select a shipment.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/${editingDeliveryId}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            shipment: {
              shipmentId: shipmentId,
            },
            deliveryPerson,
            deliveryDate,
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update delivery");
      }

      setMessage("Delivery updated successfully");
      clearForm();
      setShowForm(false);

      await loadDeliveries();
    } catch (error) {
      console.error(error);
      setMessage("Unable to update delivery. Check the selected shipment and backend.");
    }
  };

  // Delete delivery
  const handleDeleteDelivery = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this delivery?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete delivery");
      }

      setMessage("Delivery deleted successfully");
      await loadDeliveries();
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete delivery");
    }
  };

  // Cancel form
  const handleCancel = () => {
    clearForm();
    setShowForm(false);
    setMessage("");
  };

  // Styles matching Warehouse Management and Shipment Management
 

  return (
    <div className="page">
      <h2 className="heading">Delivery Management</h2>

      {/* Message */}
      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {/* Create Button */}
      {!showForm && (
        <button
          type="button"
          onClick={handleShowForm}
          className="add-button"
        >
          + Create Delivery
        </button>
      )}

      {/* Create and Update Form */}
      {showForm && (
        <form
          className="form"
          onSubmit={ editingDeliveryId ? handleUpdateDelivery : handleCreateDelivery }
        >
          <h3 className="heading">
            {editingDeliveryId
              ? "Update Delivery"
              : "Create Delivery"}
          </h3>

          {/* Shipment ID Dropdown */}
          <label className="label">
            Shipment ID
          </label>

          <select
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
            required
            className="input"
          >
            <option value="">-- Select Shipment ID --</option>

            {shipments.map((shipment) => (
              <option
                key={shipment.id}
                value={shipment.shipmentId}
              >
                {shipment.shipmentId}
                {shipment.trackingNumber
                  ? ` - ${shipment.trackingNumber}`
                  : ""}
              </option>
            ))}
          </select>

          {shipments.length === 0 && (
            <p style={{ color: "#b45309", fontSize: "13px" }}>
              No shipments are available. Create a shipment first.
            </p>
          )}

          <label className="label">
            Delivery Person
          </label>
          <input
            type="text"
            value={deliveryPerson}
            onChange={(e) => setDeliveryPerson(e.target.value)}
            placeholder="Enter delivery person"
            required
            className="input"
          />

          <label className="label">
            Delivery Date
          </label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
            className="input"
          />

          <label className="label">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className="input"
          >
            <option value="">Select status</option>
            <option value="Assigned">Assigned</option>
            <option value="Picked Up">Picked Up</option>
            <option value="Out for Delivery">
              Out for Delivery
            </option>
            <option value="Delivered">Delivered</option>
          </select>

          <div className="form-buttons">
            <button
              type="submit"
              className="save-button"
              disabled={shipments.length === 0}
            >
              {editingDeliveryId
                ? "Update Delivery"
                : "Save Delivery"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Delivery Table */}
      {deliveries.length === 0 ? (
        <div className="empty-message">
          No deliveries found.
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Delivery ID</th>
                <th className="th">Shipment ID</th>
                <th className="th">Tracking Number</th>
                <th className="th">Delivery Person</th>
                <th className="th">Delivery Date</th>
                <th className="th">Status</th>
                <th className="th">Actions</th>
              </tr>
            </thead>

            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td className="td">
                    {delivery.id}
                  </td>

                  <td className="td">
                    {delivery.shipment?.shipmentId || "-"}
                  </td>

                  <td className="td">
                    {delivery.shipment?.trackingNumber || "-"}
                  </td>

                  <td className="td">
                    {delivery.deliveryPerson}
                  </td>

                  <td className="td">
                    {delivery.deliveryDate
                      ? String(delivery.deliveryDate).substring(0, 10)
                      : "-"}
                  </td>

                  <td className="td">
                    {delivery.status}
                  </td>

                  <td className="td">
                    <button
                      type="button"
                      onClick={() => handleEditDelivery(delivery)}
                      className="edit-button"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteDelivery(delivery.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Deliveries;