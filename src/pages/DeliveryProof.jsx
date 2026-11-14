
import { useEffect, useState } from "react";

function DeliveryProof() {

  const [proofs, setProofs] = useState([]);

  const [form, setForm] = useState({
    shipmentId: "",
    receiverName: "",
    deliveryDate: "",
    deliveryStatus: "Delivered",
    proofFileName: ""
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

  const loadProofs = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/delivery-proofs",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load delivery proofs");
      }

      const data = await response.json();
      setProofs(data);

    } catch (error) {
      console.error(error);
      setMessage("Unable to load delivery proofs");
    }
  };

  useEffect(() => {
    loadProofs();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setForm({
      shipmentId: "",
      receiverName: "",
      deliveryDate: "",
      deliveryStatus: "Delivered",
      proofFileName: ""
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingId
      ? `http://localhost:8080/api/delivery-proofs/${editingId}`
      : "http://localhost:8080/api/delivery-proofs";

    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
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
          ? "Delivery proof updated successfully"
          : "Delivery proof created successfully"
      );

      resetForm();
      await loadProofs();

    } catch (error) {
      console.error(error);
      setMessage("Unable to save delivery proof");
    }
  };

  const editProof = (proof) => {
    setEditingId(proof.id);

    setForm({
      shipmentId: proof.shipmentId,
      receiverName: proof.receiverName,
      deliveryDate: proof.deliveryDate,
      deliveryStatus: proof.deliveryStatus,
      proofFileName: proof.proofFileName
    });

    setMessage("");
  };

  const deleteProof = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this delivery proof?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/delivery-proofs/${id}`,
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

      setMessage("Delivery proof deleted successfully");
      await loadProofs();

    } catch (error) {
      console.error(error);
      setMessage("Unable to delete delivery proof");
    }
  };

  return (
    <div style={{ padding: "30px" }}>

      <h1>Delivery Proof Management</h1>

      {message && <p>{message}</p>}

      <h2>
        {editingId ? "Update Delivery Proof" : "Create Delivery Proof"}
      </h2>

      <form onSubmit={handleSubmit}>

        <div>
          <input
            type="text"
            name="shipmentId"
            placeholder="Tracking Number"
            value={form.shipmentId}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <input
            type="text"
            name="receiverName"
            placeholder="Receiver Name"
            value={form.receiverName}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Delivery Date</label>
          <br />
          <input
            type="date"
            name="deliveryDate"
            value={form.deliveryDate}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Delivery Status</label>
          <br />
          <select
            name="deliveryStatus"
            value={form.deliveryStatus}
            onChange={handleChange}
          >
            <option value="Delivered">Delivered</option>
            <option value="Failed">Failed</option>
            <option value="Returned">Returned</option>
          </select>
        </div>

        <br />

        <div>
          <input
            type="text"
            name="proofFileName"
            placeholder="Proof File Name"
            value={form.proofFileName}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <button type="submit">
          {editingId ? "Update Proof" : "Create Proof"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setMessage("");
            }}
          >
            Cancel
          </button>
        )}

      </form>

      <hr />

      <h2>Delivery Proof Records</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tracking Number</th>
            <th>Receiver</th>
            <th>Delivery Date</th>
            <th>Status</th>
            <th>Proof File Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {proofs.map((proof) => (
            <tr key={proof.id}>
              <td>{proof.id}</td>
              <td>{proof.shipmentId}</td>
              <td>{proof.receiverName}</td>
              <td>{proof.deliveryDate}</td>
              <td>{proof.deliveryStatus}</td>
              <td>{proof.proofFileName}</td>
              <td>
                <button onClick={() => editProof(proof)}>
                  Edit
                </button>

                <button onClick={() => deleteProof(proof.id)}>
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

export default DeliveryProof;