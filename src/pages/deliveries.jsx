import { useEffect, useState } from "react";

function Deliveries() {

  const [deliveries, setDeliveries] = useState([]);
  const [message, setMessage] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingDeliveryId, setEditingDeliveryId] = useState(null);

  const [shipmentId, setShipmentId] = useState("");
  const [deliveryPerson, setDeliveryPerson] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [status, setStatus] = useState("");

  const getToken = () => {

    const savedUser = localStorage.getItem("user");

    const user = savedUser
      ? JSON.parse(savedUser)
      : null;

    return user?.token;
  };

  const loadDeliveries = async () => {

    const token = getToken();

    try {

      const response = await fetch(
        "http://localhost:8080/api/deliveries",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load deliveries");
      }

      const data = await response.json();

      setDeliveries(data);

    } catch (error) {

      console.error(error);
      setMessage("Unable to load deliveries");

    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const handleCreateDelivery = async (e) => {

    e.preventDefault();

    setMessage("");

    const token = getToken();

    try {

      const response = await fetch(
        "http://localhost:8080/api/deliveries",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shipmentId,
            deliveryPerson,
            deliveryDate,
            status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create delivery");
      }

      setMessage("Delivery created successfully");

      clearForm();

      setShowForm(false);

      loadDeliveries();

    } catch (error) {

      console.error(error);
      setMessage("Unable to create delivery");

    }
  };

  const handleEditDelivery = (delivery) => {

    setEditingDeliveryId(delivery.id);

    setShipmentId(delivery.shipmentId);
    setDeliveryPerson(delivery.deliveryPerson);
    setDeliveryDate(delivery.deliveryDate);
    setStatus(delivery.status);

    setMessage("");
  };

  const handleUpdateDelivery = async (e) => {

    e.preventDefault();

    setMessage("");

    const token = getToken();

    try {

      const response = await fetch(
        `http://localhost:8080/api/deliveries/${editingDeliveryId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shipmentId,
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

      setEditingDeliveryId(null);

      loadDeliveries();

    } catch (error) {

      console.error(error);
      setMessage("Unable to update delivery");

    }
  };

  const handleDeleteDelivery = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this delivery?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");

    const token = getToken();

    try {

      const response = await fetch(
        `http://localhost:8080/api/deliveries/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete delivery");
      }

      setMessage("Delivery deleted successfully");

      loadDeliveries();

    } catch (error) {

      console.error(error);
      setMessage("Unable to delete delivery");

    }
  };

  const clearForm = () => {

    setShipmentId("");
    setDeliveryPerson("");
    setDeliveryDate("");
    setStatus("");
  };

  const handleCancel = () => {

    clearForm();

    setShowForm(false);

    setEditingDeliveryId(null);

    setMessage("");
  };

  return (
    <div>

      <h1>Deliveries</h1>

      {!editingDeliveryId && (
        <button
          onClick={() => setShowForm(!showForm)}
        >
          Create Delivery
        </button>
      )}

      {showForm && !editingDeliveryId && (

        <form onSubmit={handleCreateDelivery}>

          <h2>Create Delivery</h2>

          <div>
            <label>Shipment ID</label><br />

            <input
              type="text"
              value={shipmentId}
              onChange={(e) =>
                setShipmentId(e.target.value)
              }
              placeholder="Enter shipment ID"
              required
            />
          </div>

          <br />

          <div>
            <label>Delivery Person</label><br />

            <input
              type="text"
              value={deliveryPerson}
              onChange={(e) =>
                setDeliveryPerson(e.target.value)
              }
              placeholder="Enter delivery person"
              required
            />
          </div>

          <br />

          <div>
            <label>Delivery Date</label><br />

            <input
              type="date"
              value={deliveryDate}
              onChange={(e) =>
                setDeliveryDate(e.target.value)
              }
              required
            />
          </div>

          <br />

          <div>
            <label>Status</label><br />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              required
            >
              <option value="">Select status</option>
              <option value="Assigned">Assigned</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Out for Delivery">
                Out for Delivery
              </option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <br />

          <button type="submit">
            Save Delivery
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

      {editingDeliveryId && (

        <form onSubmit={handleUpdateDelivery}>

          <h2>Update Delivery</h2>

          <div>
            <label>Shipment ID</label><br />

            <input
              type="text"
              value={shipmentId}
              onChange={(e) =>
                setShipmentId(e.target.value)
              }
              required
            />
          </div>

          <br />

          <div>
            <label>Delivery Person</label><br />

            <input
              type="text"
              value={deliveryPerson}
              onChange={(e) =>
                setDeliveryPerson(e.target.value)
              }
              required
            />
          </div>

          <br />

          <div>
            <label>Delivery Date</label><br />

            <input
              type="date"
              value={deliveryDate}
              onChange={(e) =>
                setDeliveryDate(e.target.value)
              }
              required
            />
          </div>

          <br />

          <div>
            <label>Status</label><br />

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              required
            >
              <option value="">Select status</option>
              <option value="Assigned">Assigned</option>
              <option value="Picked Up">Picked Up</option>
              <option value="Out for Delivery">
                Out for Delivery
              </option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <br />

          <button type="submit">
            Update Delivery
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

      {deliveries.length === 0 && !message && (
        <p>No deliveries found.</p>
      )}

      {deliveries.length > 0 && (

        <table border="1">

          <thead>

            <tr>
              <th>ID</th>
              <th>Shipment ID</th>
              <th>Delivery Person</th>
              <th>Delivery Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>

            {deliveries.map((delivery) => (

              <tr key={delivery.id}>

                <td>{delivery.id}</td>

                <td>{delivery.shipmentId}</td>

                <td>{delivery.deliveryPerson}</td>

                <td>{delivery.deliveryDate}</td>

                <td>{delivery.status}</td>

                <td>

                  <button
                    onClick={() =>
                      handleEditDelivery(delivery)
                    }
                  >
                    Edit
                  </button>

                  {" "}

                  <button
                    onClick={() =>
                      handleDeleteDelivery(delivery.id)
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

export default Deliveries;