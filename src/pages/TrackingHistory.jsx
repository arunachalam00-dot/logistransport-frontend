import { useEffect, useState } from "react";

function TrackingHistory() {

  const [trackingRecords, setTrackingRecords] = useState([]);

  const [form, setForm] = useState({
    shipmentId: "",
    location: "",
    status: "Pending",
    trackingDate: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const getToken = () => {

    const savedUser = localStorage.getItem("user");

    const loggedInUser = savedUser
      ? JSON.parse(savedUser)
      : null;

    return loggedInUser?.token;
  };

  const loadTracking = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/api/tracking",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load tracking records");
      }

      const data = await response.json();

      setTrackingRecords(data);

    } catch (error) {

      console.error(error);
      setMessage("Unable to load tracking records");

    }
  };

  useEffect(() => {
    loadTracking();
  }, []);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const url = editingId
      ? `http://localhost:8080/api/tracking/${editingId}`
      : "http://localhost:8080/api/tracking";

    const method = editingId ? "PUT" : "POST";

    try {

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Operation failed");
      }

      setMessage(
        editingId
          ? "Tracking updated successfully"
          : "Tracking created successfully"
      );

      setForm({
        shipmentId: "",
        location: "",
        status: "Pending",
        trackingDate: ""
      });

      setEditingId(null);

      loadTracking();

    } catch (error) {

      console.error(error);
      setMessage("Unable to save tracking record");

    }
  };

  const editTracking = (tracking) => {

    setEditingId(tracking.id);

    setForm({
      shipmentId: tracking.shipmentId,
      location: tracking.location,
      status: tracking.status,
      trackingDate: tracking.trackingDate
    });

    setMessage("");
  };

  const deleteTracking = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this tracking record?"
      );

    if (!confirmed) {
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8080/api/tracking/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      setMessage("Tracking deleted successfully");

      loadTracking();

    } catch (error) {

      console.error(error);
      setMessage("Unable to delete tracking record");

    }
  };

  const cancelEdit = () => {

    setEditingId(null);

    setForm({
      shipmentId: "",
      location: "",
      status: "Pending",
      trackingDate: ""
    });

    setMessage("");
  };

  return (
    <div style={{ padding: "30px" }}>

      <h1>Tracking History</h1>

      {message && (
        <p>{message}</p>
      )}

      <h2>
        {editingId
          ? "Update Tracking"
          : "Create Tracking Record"}
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="shipmentId"
          placeholder="Tracking Number"
          value={form.shipmentId}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Picked Up">Picked Up</option>
          <option value="In Transit">In Transit</option>
          <option value="Out for Delivery">
            Out for Delivery
          </option>
          <option value="Delivered">Delivered</option>
        </select>

        <input
          type="date"
          name="trackingDate"
          value={form.trackingDate}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editingId
            ? "Update Tracking"
            : "Create Tracking"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}

      </form>

      <hr />

      <h2>Tracking Records</h2>

      <table border="1" cellPadding="10">

        <thead>

          <tr>
            <th>ID</th>
            <th>Tracking Number</th>
            <th>Location</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {trackingRecords.map((tracking) => (

            <tr key={tracking.id}>

              <td>{tracking.id}</td>
              <td>{tracking.shipmentId}</td>
              <td>{tracking.location}</td>
              <td>{tracking.status}</td>
              <td>{tracking.trackingDate}</td>

              <td>

                <button
                  onClick={() =>
                    editTracking(tracking)
                  }
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteTracking(tracking.id)
                  }
                >
                  Delete
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default TrackingHistory;