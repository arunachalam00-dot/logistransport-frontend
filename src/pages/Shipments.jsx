
import { useEffect, useState } from "react";

function Shipments() {
  const [shipments, setShipments] = useState([]);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingShipmentId, setEditingShipmentId] = useState(null);

  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipmentId, setShipmentId] = useState("");
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("");

  const API_URL = "https://logistransport-backend-7oqv.onrender.com/api/shipments";

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

  // Load shipments
  const loadShipments = async () => {
    try {
      const response = await fetch(API_URL, {
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
      setMessage("Unable to load shipments");
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  // Clear form
  const clearForm = () => {
    setTrackingNumber("");
    setShipmentId("");
    setSenderName("");
    setReceiverName("");
    setSource("");
    setDestination("");
    setStatus("");
    setEditingShipmentId(null);
  };

  // Open create form
  const handleShowForm = () => {
    clearForm();
    setMessage("");
    setShowForm(true);
  };

  // Create shipment
  const handleCreateShipment = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          trackingNumber,
          shipmentId,
          senderName,
          receiverName,
          source,
          destination,
          status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create shipment");
      }

      setMessage("Shipment created successfully");
      clearForm();
      setShowForm(false);
      await loadShipments();
    } catch (error) {
      console.error(error);
      setMessage("Unable to create shipment");
    }
  };

  // Edit shipment
  const handleEditShipment = (shipment) => {
    setEditingShipmentId(shipment.id);
    setTrackingNumber(shipment.trackingNumber || "");
    setShipmentId(shipment.shipmentId || "");
    setSenderName(shipment.senderName || "");
    setReceiverName(shipment.receiverName || "");
    setSource(shipment.source || "");
    setDestination(shipment.destination || "");
    setStatus(shipment.status || "");

    setShowForm(true);
    setMessage("");
  };

  // Update shipment
  const handleUpdateShipment = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${editingShipmentId}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            trackingNumber,
            shipmentId,
            senderName,
            receiverName,
            source,
            destination,
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update shipment");
      }

      setMessage("Shipment updated successfully");
      clearForm();
      setShowForm(false);
      await loadShipments();
    } catch (error) {
      console.error(error);
      setMessage("Unable to update shipment");
    }
  };

  // Delete shipment
  const handleDeleteShipment = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shipment?"
    );

    if (!confirmDelete) return;

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to delete shipment");
      }

      setMessage("Shipment deleted successfully");
      await loadShipments();
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete shipment");
    }
  };

  // Cancel form
  const handleCancel = () => {
    clearForm();
    setShowForm(false);
    setMessage("");
  };

  // Styles matching Warehouse Management
  const styles = {
    page: {
      padding: "25px",
      fontFamily: "Arial, sans-serif",
      color: "#1f2937",
      boxSizing: "border-box",
      width: "100%",
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
      outline: "none",
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
      minWidth: "1050px",
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
      <h2 style={styles.heading}>Shipment Management</h2>

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
          + Create Shipment
        </button>
      )}

      {/* Create and Update Form */}
      {showForm && (
        <form
          style={styles.form}
          onSubmit={
            editingShipmentId
              ? handleUpdateShipment
              : handleCreateShipment
          }
        >
          <h3 style={styles.heading}>
            {editingShipmentId
              ? "Update Shipment"
              : "Create Shipment"}
          </h3>

          <label style={styles.label}>
            Tracking Number
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            required
            style={styles.input}
          />

          <label style={styles.label}>
            Shipment ID
          </label>
          <input
            type="text"
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
            placeholder="Enter shipment ID"
            required
            style={styles.input}
          />

          <label style={styles.label}>
            Sender Name
          </label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Enter sender name"
            required
            style={styles.input}
          />

          <label style={styles.label}>
            Receiver Name
          </label>
          <input
            type="text"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            placeholder="Enter receiver name"
            required
            style={styles.input}
          />

          <label style={styles.label}>
            Source
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter source"
            required
            style={styles.input}
          />

          <label style={styles.label}>
            Destination
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
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
            <option value="Pending">Pending</option>
            <option value="Picked Up">Picked Up</option>
            <option value="In Transit">In Transit</option>
            <option value="Out for Delivery">
              Out for Delivery
            </option>
            <option value="Delivered">Delivered</option>
          </select>

          <div style={styles.formButtons}>
            <button
              type="submit"
              style={styles.saveButton}
            >
              {editingShipmentId
                ? "Update Shipment"
                : "Save Shipment"}
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

      {/* Shipment Table */}
      {shipments.length === 0 ? (
        <div style={styles.emptyMessage}>
          No shipments found.
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Tracking Number</th>
                <th style={styles.th}>Shipment ID</th>
                <th style={styles.th}>Sender</th>
                <th style={styles.th}>Receiver</th>
                <th style={styles.th}>Source</th>
                <th style={styles.th}>Destination</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td style={styles.td}>
                    {shipment.id}
                  </td>

                  <td style={styles.td}>
                    {shipment.trackingNumber}
                  </td>

                  <td style={styles.td}>
                    {shipment.shipmentId}
                  </td>

                  <td style={styles.td}>
                    {shipment.senderName}
                  </td>

                  <td style={styles.td}>
                    {shipment.receiverName}
                  </td>

                  <td style={styles.td}>
                    {shipment.source}
                  </td>

                  <td style={styles.td}>
                    {shipment.destination}
                  </td>

                  <td style={styles.td}>
                    {shipment.status}
                  </td>

                  <td style={styles.td}>
                    <button
                      type="button"
                      onClick={() => handleEditShipment(shipment)}
                      style={styles.editButton}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteShipment(shipment.id)
                      }
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

export default Shipments;