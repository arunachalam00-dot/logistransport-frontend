import { useEffect, useState } from "react";

function Warehouses() {

  const [warehouses, setWarehouses] = useState([]);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingWarehouseId, setEditingWarehouseId] = useState(null);

  const [warehouseName, setWarehouseName] = useState("");
  const [location, setLocation] = useState("");
  const [managerName, setManagerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");

  const getToken = () => {

    const savedUser = localStorage.getItem("user");

    const user = savedUser
      ? JSON.parse(savedUser)
      : null;

    return user?.token;
  };

  // Load warehouses
  const loadWarehouses = async () => {

    const token = getToken();

    try {

      const response = await fetch(
        "http://localhost:8080/api/warehouses",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load warehouses");
      }

      const data = await response.json();

      setWarehouses(data);

    } catch (error) {

      console.error(error);
      setMessage("Unable to load warehouses");

    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  // Create warehouse
  const handleCreateWarehouse = async (e) => {

    e.preventDefault();

    setMessage("");

    const token = getToken();

    try {

      const response = await fetch(
        "http://localhost:8080/api/warehouses",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            warehouseName,
            location,
            managerName,
            contactNumber,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create warehouse");
      }

      setMessage("Warehouse created successfully");

      clearForm();

      setShowForm(false);

      loadWarehouses();

    } catch (error) {

      console.error(error);
      setMessage("Unable to create warehouse");

    }
  };

  // Start editing
  const handleEditWarehouse = (warehouse) => {

    setEditingWarehouseId(warehouse.id);

    setWarehouseName(warehouse.warehouseName);
    setLocation(warehouse.location);
    setManagerName(warehouse.managerName);
    setContactNumber(warehouse.contactNumber);

    setMessage("");
  };

  // Update warehouse
  const handleUpdateWarehouse = async (e) => {

    e.preventDefault();

    setMessage("");

    const token = getToken();

    try {

      const response = await fetch(
        `http://localhost:8080/api/warehouses/${editingWarehouseId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            warehouseName,
            location,
            managerName,
            contactNumber,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update warehouse");
      }

      setMessage("Warehouse updated successfully");

      clearForm();

      setEditingWarehouseId(null);

      loadWarehouses();

    } catch (error) {

      console.error(error);
      setMessage("Unable to update warehouse");

    }
  };

  // Delete warehouse
  const handleDeleteWarehouse = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this warehouse?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");

    const token = getToken();

    try {

      const response = await fetch(
        `http://localhost:8080/api/warehouses/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete warehouse");
      }

      setMessage("Warehouse deleted successfully");

      loadWarehouses();

    } catch (error) {

      console.error(error);
      setMessage("Unable to delete warehouse");

    }
  };

  // Clear form
  const clearForm = () => {

    setWarehouseName("");
    setLocation("");
    setManagerName("");
    setContactNumber("");
  };

  // Cancel edit
  const handleCancel = () => {

    clearForm();

    setShowForm(false);

    setEditingWarehouseId(null);

    setMessage("");
  };

  return (
    <div>

      <h1>Warehouses</h1>

      {!editingWarehouseId && (
        <button
          onClick={() => setShowForm(!showForm)}
        >
          Create Warehouse
        </button>
      )}

      {/* Create Form */}

      {showForm && !editingWarehouseId && (

        <form onSubmit={handleCreateWarehouse}>

          <h2>Create Warehouse</h2>

          <div>
            <label>Warehouse Name</label><br />

            <input
              type="text"
              value={warehouseName}
              onChange={(e) =>
                setWarehouseName(e.target.value)
              }
              placeholder="Enter warehouse name"
              required
            />
          </div>

          <br />

          <div>
            <label>Location</label><br />

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              placeholder="Enter location"
              required
            />
          </div>

          <br />

          <div>
            <label>Manager Name</label><br />

            <input
              type="text"
              value={managerName}
              onChange={(e) =>
                setManagerName(e.target.value)
              }
              placeholder="Enter manager name"
              required
            />
          </div>

          <br />

          <div>
            <label>Contact Number</label><br />

            <input
              type="text"
              value={contactNumber}
              onChange={(e) =>
                setContactNumber(e.target.value)
              }
              placeholder="Enter contact number"
              required
            />
          </div>

          <br />

          <button type="submit">
            Save Warehouse
          </button>

          {" "}

          <button
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>

        </form>
      )}

      {/* Update Form */}

      {editingWarehouseId && (

        <form onSubmit={handleUpdateWarehouse}>

          <h2>Update Warehouse</h2>

          <div>
            <label>Warehouse Name</label><br />

            <input
              type="text"
              value={warehouseName}
              onChange={(e) =>
                setWarehouseName(e.target.value)
              }
              required
            />
          </div>

          <br />

          <div>
            <label>Location</label><br />

            <input
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
              required
            />
          </div>

          <br />

          <div>
            <label>Manager Name</label><br />

            <input
              type="text"
              value={managerName}
              onChange={(e) =>
                setManagerName(e.target.value)
              }
              required
            />
          </div>

          <br />

          <div>
            <label>Contact Number</label><br />

            <input
              type="text"
              value={contactNumber}
              onChange={(e) =>
                setContactNumber(e.target.value)
              }
              required
            />
          </div>

          <br />

          <button type="submit">
            Update Warehouse
          </button>

          {" "}

          <button
            type="button"
            onClick={handleCancel}
          >
            Cancel
          </button>

        </form>
      )}

      {message && <p>{message}</p>}

      {warehouses.length === 0 && !message && (
        <p>No warehouses found.</p>
      )}

      {warehouses.length > 0 && (

        <table border="1">

          <thead>

            <tr>
              <th>ID</th>
              <th>Warehouse Name</th>
              <th>Location</th>
              <th>Manager</th>
              <th>Contact</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {warehouses.map((warehouse) => (

              <tr key={warehouse.id}>

                <td>{warehouse.id}</td>

                <td>{warehouse.warehouseName}</td>

                <td>{warehouse.location}</td>

                <td>{warehouse.managerName}</td>

                <td>{warehouse.contactNumber}</td>

                <td>

                  <button
                    onClick={() =>
                      handleEditWarehouse(warehouse)
                    }
                  >
                    Edit
                  </button>

                  {" "}

                  <button
                    onClick={() =>
                      handleDeleteWarehouse(warehouse.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default Warehouses;