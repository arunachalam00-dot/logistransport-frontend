
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
  const [mobileNumber, setMobileNumber] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("");

  const API_URL = "https://logistransport-backend-hp98.onrender.com/api/shipments";

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
    setMobileNumber("");
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
          mobileNumber,
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
    setMobileNumber(shipment.mobileNumber || "");
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
            mobileNumber,
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

 

  return (
    <div className="page">
      <h2 className="heading">Shipment Management</h2>

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
          + Create Shipment
        </button>
      )}

      {/* Create and Update Form */}
      {showForm && (
        <form
          className="form"
          onSubmit={
            editingShipmentId
              ? handleUpdateShipment
              : handleCreateShipment
          }
        >
          <h3 className="heading">
            {editingShipmentId
              ? "Update Shipment"
              : "Create Shipment"}
          </h3>

          <label className="label">
            Tracking Number
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Enter tracking number"
            required
            className="input"
          />

          <label className="label">
            Shipment ID
          </label>
          <input
            type="text"
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
            placeholder="Enter shipment ID"
            required
            className="input"
          />

          <label className="label">
            Sender Name
          </label>
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Enter sender name"
            required
            className="input"
          />

          <label className="label">
            Receiver Name
          </label>
          <input
            type="text"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
            placeholder="Enter receiver name"
            required
            className="input"
          />

          <label className="label">
            Mobile Number
          </label>
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="Enter Receiver Mobile Number"
            required
            className="input"
            />

          <label className="label">
            Source
          </label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Enter source"
            required
            className="input"
          />

          <label className="label">
            Destination
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
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
            <option value="Pending">Pending</option>
            <option value="Picked Up">Picked Up</option>
            <option value="In Transit">In Transit</option>
            <option value="Out for Delivery">
              Out for Delivery
            </option>
            <option value="Delivered">Delivered</option>
          </select>

          <div className="form-buttons">
            <button
              type="submit"
              className="save-button"
            >
              {editingShipmentId
                ? "Update Shipment"
                : "Save Shipment"}
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

      {/* Shipment Table */}
      {shipments.length === 0 ? (
        <div className="empty-message">
          No shipments found.
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th className="th">ID</th>
                <th className="th">Tracking Number</th>
                <th className="th">Shipment ID</th>
                <th className="th">Sender</th>
                <th className="th">Receiver</th>
                <th className="th">Mobile Number</th>
                <th className="th">Source</th>
                <th className="th">Destination</th>
                <th className="th">Status</th>
                <th className="th">Actions</th>
              </tr>
            </thead>

            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td className="td">
                    {shipment.id}
                  </td>

                  <td className="td">
                    {shipment.trackingNumber}
                  </td>

                  <td className="td">
                    {shipment.shipmentId}
                  </td>

                  <td className="td">
                    {shipment.senderName}
                  </td>

                  <td className="td">
                    {shipment.receiverName}
                  </td>

                  <td className="td">
                    {shipment.mobileNumber}
                    </td>

                  <td className="td">
                    {shipment.source}
                  </td>

                  <td className="td">
                    {shipment.destination}
                  </td>

                  <td className="td">
                    {shipment.status}
                  </td>

                  <td className="td">
                    <button
                      type="button"
                      onClick={() => handleEditShipment(shipment)}
                      className="edit-button"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteShipment(shipment.id)
                      }
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

export default Shipments;