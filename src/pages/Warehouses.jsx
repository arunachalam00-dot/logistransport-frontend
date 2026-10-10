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

  const API_URL = "http://localhost:8080/api/warehouses";
  const SHIPMENT_API_URL = "http://localhost:8080/api/shipments";

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

  const styles = {
    page: {
      padding: "25px",
      fontFamily: "Arial, sans-serif",
      color: "#1f2937",
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
    },
    form: {
      maxWidth: "600px",
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
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      background: "white",
      minWidth: "850px",
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
    },
    editButton: {
      background: "#f0ad4e",
      color: "#222",
      border: "none",
      borderRadius: "4px",
      padding: "7px 12px",
      marginRight: "6px",
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
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Warehouse Management</h2>

      {message && (
        <div style={styles.message}>
          {message}
        </div>
      )}

      {!showForm && (
        <button
          type="button"
          style={styles.addButton}
          onClick={handleShowForm}
        >
          + Create Warehouse
        </button>
      )}

      {showForm && (
        <form
          style={styles.form}
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

          <label style={styles.label}>Shipment</label>

          <select
            style={styles.input}
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

          <label style={styles.label}>Warehouse Name</label>
          <input
            type="text"
            style={styles.input}
            value={warehouseName}
            onChange={(event) =>
              setWarehouseName(event.target.value)
            }
            placeholder="Enter warehouse name"
            required
          />

          <label style={styles.label}>Location</label>
          <input
            type="text"
            style={styles.input}
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Enter warehouse location"
            required
          />

          <label style={styles.label}>Manager Name</label>
          <input
            type="text"
            style={styles.input}
            value={managerName}
            onChange={(event) =>
              setManagerName(event.target.value)
            }
            placeholder="Enter manager name"
            required
          />

          <label style={styles.label}>Contact Number</label>
          <input
            type="tel"
            style={styles.input}
            value={contactNumber}
            onChange={(event) =>
              setContactNumber(event.target.value)
            }
            placeholder="Enter contact number"
            required
          />

          <div style={styles.formButtons}>
            <button type="submit" style={styles.saveButton}>
              {editingWarehouseId ? "Update Warehouse" : "Create Warehouse"}
            </button>

            <button
              type="button"
              style={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Warehouse ID</th>
              <th style={styles.th}>Shipment ID</th>
              <th style={styles.th}>Tracking Number</th>
              <th style={styles.th}>Warehouse Name</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Manager Name</th>
              <th style={styles.th}>Contact Number</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {warehouses.length === 0 ? (
              <tr>
                <td
                  style={styles.td}
                  colSpan="8"
                >
                  No warehouses found.
                </td>
              </tr>
            ) : (
              warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td style={styles.td}>
                    {warehouse.id}
                  </td>

                  <td style={styles.td}>
                    {warehouse.shipment?.shipmentId ||
                      warehouse.shipment?.id ||
                      "-"}
                  </td>

                  <td style={styles.td}>
                    {warehouse.shipment?.trackingNumber || "-"}
                  </td>

                  <td style={styles.td}>
                    {warehouse.warehouseName}
                  </td>

                  <td style={styles.td}>
                    {warehouse.location}
                  </td>

                  <td style={styles.td}>
                    {warehouse.managerName}
                  </td>

                  <td style={styles.td}>
                    {warehouse.contactNumber}
                  </td>

                  <td style={styles.td}>
                    <button
                      type="button"
                      style={styles.editButton}
                      onClick={() => handleEditWarehouse(warehouse)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      style={styles.deleteButton}
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