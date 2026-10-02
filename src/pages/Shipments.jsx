
import { useEffect, useState } from "react";

function Shipments() {
  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;

  console.log("Logged-in user:",user);
  console.log("user role:", user?.role);

  const [shipments, setShipments] = useState([]);
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [trackingNumber, setTrackingNumber] = useState("");
  const [senderName, setSenderName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState("");

  // Edit state
  const [editingShipmentId, setEditingShipmentId] = useState(null);

  const loadShipments = () => {
    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    fetch("http://localhost:8080/api/shipments", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load shipments");
        }

        return response.json();
      })
      .then((data) => {
        setShipments(data);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Unable to load shipments");
      });
  };

  useEffect(() => {
    loadShipments();
  }, []);

  // Create shipment
  const handleCreateShipment = async (e) => {
    e.preventDefault();

    setMessage("");

    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    try {
      const response = await fetch(
        "http://localhost:8080/api/shipments",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trackingNumber: trackingNumber,
            senderName: senderName,
            receiverName: receiverName,
            source: source,
            destination: destination,
            status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create shipment");
      }

      setMessage("Shipment created successfully");

      setTrackingNumber("");
      setSenderName("");
      setReceiverName("");
      setSource("");
      setDestination("");
      setStatus("");

      setShowForm(false);

      loadShipments();

    } catch (error) {
      console.error(error);
      setMessage("Unable to create shipment");
    }
  };

  // Start editing
  const handleEditShipment = (shipment) => {
    setEditingShipmentId(shipment.id);

    setTrackingNumber(shipment.trackingNumber);
    setSenderName(shipment.senderName);
    setReceiverName(shipment.receiverName);
    setSource(shipment.source);
    setDestination(shipment.destination);
    setStatus(shipment.status);

    setMessage("");
  };

  // Update shipment
  const handleUpdateShipment = async (e) => {
    e.preventDefault();

    setMessage("");

    const savedUser = localStorage.getItem("user");
    const user = savedUser ? JSON.parse(savedUser) : null;
    const token = user?.token;

    try {
      const response = await fetch(
        `http://localhost:8080/api/shipments/${editingShipmentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            trackingNumber: trackingNumber,
            senderName: senderName,
            receiverName: receiverName,
            source: source,
            destination: destination,
            status: status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update shipment");
      }

      setMessage("Shipment updated successfully");

      setTrackingNumber("");
      setSenderName("");
      setReceiverName("");
      setSource("");
      setDestination("");
      setStatus("");

      setEditingShipmentId(null);

      loadShipments();

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

  if (!confirmDelete) {
    return;
  }

  setMessage("");

  const savedUser = localStorage.getItem("user");
  const user = savedUser ? JSON.parse(savedUser) : null;
  const token = user?.token;

  try {

    const response = await fetch(
      `http://localhost:8080/api/shipments/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete shipment");
    }

    setMessage("Shipment deleted successfully");

    loadShipments();

  } catch (error) {

    console.error(error);
    setMessage("Unable to delete shipment");

  }
};

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingShipmentId(null);

    setTrackingNumber("");
    setSenderName("");
    setReceiverName("");
    setSource("");
    setDestination("");
    setStatus("");

    setMessage("");
  };

  return (
    <div>
      <h1>Shipments</h1>

      {user?.role ==="ADMIN"  &&  !editingShipmentId && (
        <button onClick={() => setShowForm(!showForm)}>
          Create Shipment
        </button>
      )}

      {/* Create Shipment Form */}
      {user?.role === "ADMIN" && showForm && !editingShipmentId && (
        <form onSubmit={handleCreateShipment}>
          <h2>Create Shipment</h2>

          <div>
            <label>Tracking Number</label><br />
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              required
            />
          </div>

          <br />

          <div>
            <label>Sender Name</label><br />
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Enter sender name"
              required
            />
          </div>

          <br />

          <div>
            <label>Receiver Name</label><br />
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              placeholder="Enter receiver name"
              required
            />
          </div>

          <br />

          <div>
            <label>Source</label><br />
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Enter source"
              required
            />
          </div>

          <br />

          <div>
            <label>Destination</label><br />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination"
              required
            />
          </div>

          <br />

          <div>
            <label>Status</label><br />
              <label>Status</label><br />

            <select
               value={status}
               onChange={(e) => setStatus(e.target.value)}
               required
            >
             <option value="">Select status</option>
             <option value="Pending">Pending</option>
             <option value="Picked Up">Picked Up</option>
             <option value="In Transit">In Transit</option>
             <option value="Out for Delivery">Out for Delivery</option>
             <option value="Delivered">Delivered</option>
           </select>
          </div>

          <br />

          <button type="submit">Save Shipment</button>
          {" "}
          <button
            type="button"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Update Shipment Form */}
      {user?.role === "ADMIN" && editingShipmentId && (
        <form onSubmit={handleUpdateShipment}>
          <h2>Update Shipment</h2>

          <div>
            <label>Tracking Number</label><br />
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              required
            />
          </div>

          <br />

          <div>
            <label>Sender Name</label><br />
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              required
            />
          </div>

          <br />

          <div>
            <label>Receiver Name</label><br />
            <input
              type="text"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              required
            />
          </div>

          <br />

          <div>
            <label>Source</label><br />
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            />
          </div>

          <br />

          <div>
            <label>Destination</label><br />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <br />

          <div>
            <label>Status</label><br />
            <label>Status</label><br />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          >
           <option value="">Select status</option>
           <option value="Pending">Pending</option>
           <option value="Picked Up">Picked Up</option>
           <option value="In Transit">In Transit</option>
           <option value="Out for Delivery">Out for Delivery</option>
           <option value="Delivered">Delivered</option>
         </select>
          </div>

          <br />

          <button type="submit">
            Update Shipment
          </button>
          {" "}
          <button
            type="button"
            onClick={handleCancelEdit}
          >
            Cancel
          </button>
        </form>
      )}

      {message && <p>{message}</p>}

      {shipments.length === 0 && !message && (
        <p>No shipments found.</p>
      )}

      {shipments.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tracking Number</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {shipments.map((shipment) => (
              <tr key={shipment.id}>
                <td>{shipment.id}</td>
                <td>{shipment.trackingNumber}</td>
                <td>{shipment.senderName}</td>
                <td>{shipment.receiverName}</td>
                <td>{shipment.source}</td>
                <td>{shipment.destination}</td>
                <td>{shipment.status}</td>
                <td>
                    {user?.role === "ADMIN" && (
                       <>
                         <button
                            onClick={() => handleEditShipment(shipment)}
                         >
                          Edit
                        </button>

                       {" "}

                       <button
                         onClick={() => handleDeleteShipment(shipment.id)}
                       >
                        Delete
                      </button>
                     </>
                  )} 
              </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 

export default Shipments;
