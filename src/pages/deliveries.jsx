
import { useEffect, useState } from "react";

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

  const API_URL = "http://localhost:8080/api/deliveries";
  const SHIPMENT_API_URL = "http://localhost:8080/api/shipments";

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
  const styles = {
    page: {
      padding: "25px",
      fontFamily: "Arial, sans-serif",
      color: "#1f2937",
      width: "100%",
      boxSizing: "border-box",
    },

    heading: {
      textAlign: "center",
      marginBottom: "25px",
      color: "#17365d",
    },

    addButton: {
      background: "#17365d",
      color: "white",
      padding: "10px 18px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      marginBottom: "20px",
      fontSize: "14px",
      fontWeight: "bold",
    },

    form: {
      width: "100%",
      maxWidth: "600px",
      boxSizing: "border-box",
      margin: "0 auto 25px",
      padding: "22px",
      border: "1px solid #cbd5e1",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
      background: "#ffffff",
    },

    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "6px",
      marginTop: "12px",
    },

    input: {
      width: "100%",
      boxSizing: "border-box",
      padding: "10px",
      border: "1px solid #94a3b8",
      borderRadius: "5px",
      fontSize: "14px",
    },

    formButtons: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginTop: "20px",
    },

    saveButton: {
      background: "#198754",
      color: "white",
      padding: "10px 18px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
    },

    cancelButton: {
      background: "#64748b",
      color: "white",
      padding: "10px 18px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },

    tableContainer: {
      width: "100%",
      overflowX: "auto",
      borderRadius: "8px",
      boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
      background: "#ffffff",
    },

    table: {
      width: "100%",
      minWidth: "850px",
      borderCollapse: "collapse",
      background: "white",
    },

    th: {
      background: "#17365d",
      color: "white",
      padding: "12px",
      border: "1px solid #cbd5e1",
      textAlign: "left",
      whiteSpace: "nowrap",
    },

    td: {
      padding: "11px",
      border: "1px solid #cbd5e1",
      textAlign: "left",
      verticalAlign: "middle",
    },

    editButton: {
      background: "#f0ad4e",
      color: "#222",
      border: "none",
      borderRadius: "4px",
      padding: "7px 12px",
      marginRight: "6px",
      marginBottom: "4px",
      cursor: "pointer",
    },

    deleteButton: {
      background: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "4px",
      padding: "7px 12px",
      cursor: "pointer",
    },

    message: {
      padding: "10px",
      marginBottom: "15px",
      background: "#f1f5f9",
      border: "1px solid #cbd5e1",
      borderRadius: "5px",
      overflowWrap: "anywhere",
    },

    emptyMessage: {
      textAlign: "center",
      padding: "20px",
      color: "#64748b",
    },
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Delivery Management</h2>

      {/* Message */}
      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}

      {/* Create Button */}
      {!showForm && (
        <button
          type="button"
          onClick={handleShowForm}
          style={styles.addButton}
        >
          + Create Delivery
        </button>
      )}

      {/* Create and Update Form */}
      {showForm && (
        <form
          style={styles.form}
          onSubmit={
            editingDeliveryId
              ? handleUpdateDelivery
              : handleCreateDelivery
          }
        >
          <h3 style={styles.heading}>
            {editingDeliveryId
              ? "Update Delivery"
              : "Create Delivery"}
          </h3>

          {/* Shipment ID Dropdown */}
          <label style={styles.label}>
            Shipment ID
          </label>

          <select
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
            required
            style={styles.input}
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

          <label style={styles.label}>
            Delivery Person
          </label>
          <input
            type="text"
            value={deliveryPerson}
            onChange={(e) => setDeliveryPerson(e.target.value)}
            placeholder="Enter delivery person"
            required
            style={styles.input}
          />

          <label style={styles.label}>
            Delivery Date
          </label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
            style={styles.input}
          />

          <label style={styles.label}>
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            style={styles.input}
          >
            <option value="">Select status</option>
            <option value="Assigned">Assigned</option>
            <option value="Picked Up">Picked Up</option>
            <option value="Out for Delivery">
              Out for Delivery
            </option>
            <option value="Delivered">Delivered</option>
          </select>

          <div style={styles.formButtons}>
            <button
              type="submit"
              style={styles.saveButton}
              disabled={shipments.length === 0}
            >
              {editingDeliveryId
                ? "Update Delivery"
                : "Save Delivery"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              style={styles.cancelButton}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Delivery Table */}
      {deliveries.length === 0 ? (
        <div style={styles.emptyMessage}>
          No deliveries found.
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Delivery ID</th>
                <th style={styles.th}>Shipment ID</th>
                <th style={styles.th}>Tracking Number</th>
                <th style={styles.th}>Delivery Person</th>
                <th style={styles.th}>Delivery Date</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {deliveries.map((delivery) => (
                <tr key={delivery.id}>
                  <td style={styles.td}>
                    {delivery.id}
                  </td>

                  <td style={styles.td}>
                    {delivery.shipment?.shipmentId || "-"}
                  </td>

                  <td style={styles.td}>
                    {delivery.shipment?.trackingNumber || "-"}
                  </td>

                  <td style={styles.td}>
                    {delivery.deliveryPerson}
                  </td>

                  <td style={styles.td}>
                    {delivery.deliveryDate
                      ? String(delivery.deliveryDate).substring(0, 10)
                      : "-"}
                  </td>

                  <td style={styles.td}>
                    {delivery.status}
                  </td>

                  <td style={styles.td}>
                    <button
                      type="button"
                      onClick={() => handleEditDelivery(delivery)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteDelivery(delivery.id)}
                      style={styles.deleteButton}
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