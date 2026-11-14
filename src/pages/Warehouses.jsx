import { useEffect, useState } from "react";

function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [shipments, setShipments] = useState([]);

  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingWarehouseId, setEditingWarehouseId] = useState(null);

  const [shipmentId, setShipmentId] = useState("");
  const [warehouseName, setWarehouseName] = useState("");
  const [location, setLocation] = useState("");
  const [managerName, setManagerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const API_URL = "https://logistransport-backend-hp98.onrender.com/api/warehouses";
  const SHIPMENT_API_URL = "https://logistransport-backend-hp98.onrender.com/api/shipments";

  // Get the logged-in user's JWT token
  function getToken() {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.token;
    } catch {
      return null;
    }
  }

  // Common headers for authenticated requests
  function getHeaders() {
    return {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    };
  }

  // Read an API error message
  async function getErrorMessage(response) {
    const text = await response.text();

    if (!text) {
      return `Request failed (${response.status})`;
    }

    try {
      const data = JSON.parse(text);
      return data.message || data.error || text;
    } catch {
      return text;
    }
  }

  // Load all warehouses
  async function loadWarehouses() {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = await response.json();
      setWarehouses(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage("Unable to load warehouses: " + error.message);
    }
  }

  // Load shipments for the dropdown
  async function loadShipments() {
    try {
      const response = await fetch(SHIPMENT_API_URL, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      const data = await response.json();
      setShipments(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage("Unable to load shipments: " + error.message);
    }
  }

  // Load data when the page opens
  useEffect(() => {
    loadWarehouses();
    loadShipments();
  }, []);

  // Clear the form
  function clearForm() {
    setShipmentId("");
    setWarehouseName("");
    setLocation("");
    setManagerName("");
    setContactNumber("");
    setEditingWarehouseId(null);
  }

  // Open the create form
  function handleShowForm() {
    clearForm();
    setMessage("");
    setShowForm(true);
  }

  // Create a warehouse
  async function handleCreateWarehouse(event) {
    event.preventDefault();
    setMessage("");

    if (!shipmentId) {
      setMessage("Please select a shipment.");
      return;
    }

    const warehouseData = {
      shipment: {
        id: Number(shipmentId),
      },
      warehouseName,
      location,
      managerName,
      contactNumber,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(warehouseData),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setMessage("Warehouse created successfully.");
      setShowForm(false);
      clearForm();
      await loadWarehouses();
    } catch (error) {
      setMessage("Unable to create warehouse: " + error.message);
    }
  }

  // Load selected warehouse details into the form
  function handleEditWarehouse(warehouse) {
    setEditingWarehouseId(warehouse.id);
    setShipmentId(
      warehouse.shipment?.id != null
        ? String(warehouse.shipment.id)
        : ""
    );
    setWarehouseName(warehouse.warehouseName || "");
    setLocation(warehouse.location || "");
    setManagerName(warehouse.managerName || "");
    setContactNumber(warehouse.contactNumber || "");

    setMessage("");
    setShowForm(true);
  }

  // Update a warehouse
  async function handleUpdateWarehouse(event) {
    event.preventDefault();
    setMessage("");

    const warehouseData = {
      warehouseName,
      location,
      managerName,
      contactNumber,
    };

    try {
      const response = await fetch(
        `${API_URL}/${editingWarehouseId}`,
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify(warehouseData),
        }
      );

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setMessage("Warehouse updated successfully.");
      setShowForm(false);
      clearForm();
      await loadWarehouses();
    } catch (error) {
      setMessage("Unable to update warehouse: " + error.message);
    }
  }

  // Delete a warehouse
  async function handleDeleteWarehouse(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this warehouse?"
    );

    if (!confirmed) {
      return;
    }

    setMessage("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(await getErrorMessage(response));
      }

      setMessage("Warehouse deleted successfully.");
      await loadWarehouses();
    } catch (error) {
      setMessage("Unable to delete warehouse: " + error.message);
    }
  }

  // Cancel create/edit
  function handleCancel() {
    setShowForm(false);
    clearForm();
    setMessage("");
  }

 
  return (
    <div className="page">
      <h2 className="heading">Warehouse Management</h2>

      {message && (
        <div className="message">
          {message}
        </div>
      )}

      {!showForm && (
        <button
          type="button"
          className="add-button"
          onClick={handleShowForm}
        >
          + Create Warehouse
        </button>
      )}

      {showForm && (
        <form
          className="form"
          onSubmit={
            editingWarehouseId
              ? handleUpdateWarehouse
              : handleCreateWarehouse
          }
        >
          <h3>
            {editingWarehouseId
              ? "Update Warehouse"
              : "Create Warehouse"}
          </h3>

          <label className="label">Shipment</label>

          <select
            className="input"
            value={shipmentId}
            onChange={(event) => setShipmentId(event.target.value)}
            required
            disabled={Boolean(editingWarehouseId)}
          >
            <option value="">-- Select Shipment --</option>

            {shipments.map((shipment) => (
              <option
                key={shipment.id}
                value={shipment.id}
              >
                {shipment.shipmentId ||
                  shipment.trackingNumber ||
                  `Shipment ${shipment.id}`}
                {" (ID: "}
                {shipment.id}
                {")"}
              </option>
            ))}
          </select>

          {editingWarehouseId && (
            <small>
              Shipment assignment cannot be changed by the current
              backend update method.
            </small>
          )}

          <label className="label">Warehouse Name</label>
          <input
            type="text"
            className="input"
            value={warehouseName}
            onChange={(event) =>
              setWarehouseName(event.target.value)
            }
            placeholder="Enter warehouse name"
            required
          />

          <label className="label">Location</label>
          <input
            type="text"
            className="input"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Enter warehouse location"
            required
          />

          <label className="label">Manager Name</label>
          <input
            type="text"
            className="input"
            value={managerName}
            onChange={(event) =>
              setManagerName(event.target.value)
            }
            placeholder="Enter manager name"
            required
          />

          <label className="label">Contact Number</label>
          <input
            type="tel"
            className="input"
            value={contactNumber}
            onChange={(event) =>
              setContactNumber(event.target.value)
            }
            placeholder="Enter contact number"
            required
          />

          <div className="form-buttons">
            <button type="submit" className="save-button">
              {editingWarehouseId ? "Update Warehouse" : "Create Warehouse"}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th className="th">Warehouse ID</th>
              <th className="th">Shipment ID</th>
              <th className="th">Tracking Number</th>
              <th className="th">Warehouse Name</th>
              <th className="th">Location</th>
              <th className="th">Manager Name</th>
              <th className="th">Contact Number</th>
              <th className="th">Actions</th>
            </tr>
          </thead>

          <tbody>
            {warehouses.length === 0 ? (
              <tr>
                <td
                  className="td"
                  colSpan="8"
                >
                  No warehouses found.
                </td>
              </tr>
            ) : (
              warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td className="td">
                    {warehouse.id}
                  </td>

                  <td className="td">
                    {warehouse.shipment?.shipmentId ||
                      warehouse.shipment?.id ||
                      "-"}
                  </td>

                  <td className="td">
                    {warehouse.shipment?.trackingNumber || "-"}
                  </td>

                  <td className="td">
                    {warehouse.warehouseName}
                  </td>

                  <td className="td">
                    {warehouse.location}
                  </td>

                  <td className="td">
                    {warehouse.managerName}
                  </td>

                  <td className="td">
                    {warehouse.contactNumber}
                  </td>

                  <td className="td">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() => handleEditWarehouse(warehouse)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        handleDeleteWarehouse(warehouse.id)
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Warehouses;