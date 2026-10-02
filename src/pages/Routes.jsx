import { useEffect, useState } from "react";

function RoutesPage() {

  const [routes, setRoutes] = useState([]);

  const [form, setForm] = useState({
    routeName: "",
    source: "",
    destination: "",
    distance: "",
    status: "Active"
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

  const loadRoutes = async () => {

    try {

      const response = await fetch(
        "http://localhost:8080/api/routes",
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load routes");
      }

      const data = await response.json();

      setRoutes(data);

    } catch (error) {

      console.error(error);
      setMessage("Unable to load routes");

    }
  };

  useEffect(() => {
    loadRoutes();
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
      ? `http://localhost:8080/api/routes/${editingId}`
      : "http://localhost:8080/api/routes";

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
          ? "Route updated successfully"
          : "Route created successfully"
      );

      setForm({
        routeName: "",
        source: "",
        destination: "",
        distance: "",
        status: "Active"
      });

      setEditingId(null);

      loadRoutes();

    } catch (error) {

      console.error(error);
      setMessage("Unable to save route");

    }
  };

  const editRoute = (route) => {

    setEditingId(route.id);

    setForm({
      routeName: route.routeName,
      source: route.source,
      destination: route.destination,
      distance: route.distance,
      status: route.status
    });

    setMessage("");
  };

  const deleteRoute = async (id) => {

    const confirmed =
      window.confirm("Are you sure you want to delete this route?");

    if (!confirmed) {
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8080/api/routes/${id}`,
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

      setMessage("Route deleted successfully");

      loadRoutes();

    } catch (error) {

      console.error(error);
      setMessage("Unable to delete route");

    }
  };

  const cancelEdit = () => {

    setEditingId(null);

    setForm({
      routeName: "",
      source: "",
      destination: "",
      distance: "",
      status: "Active"
    });

    setMessage("");
  };

  return (
    <div style={{
      padding: "30px"
    }}>

      <h1>Route Management</h1>

      {message && (
        <p>{message}</p>
      )}

      <h2>
        {editingId ? "Update Route" : "Create Route"}
      </h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="routeName"
          placeholder="Route Name"
          value={form.routeName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="source"
          placeholder="Source"
          value={form.source}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={form.destination}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="distance"
          placeholder="Distance"
          value={form.distance}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button type="submit">
          {editingId ? "Update Route" : "Create Route"}
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

      <h2>Routes</h2>

      <table border="1" cellPadding="10">

        <thead>

          <tr>
            <th>ID</th>
            <th>Route Name</th>
            <th>Source</th>
            <th>Destination</th>
            <th>Distance</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {routes.map((route) => (

            <tr key={route.id}>

              <td>{route.id}</td>
              <td>{route.routeName}</td>
              <td>{route.source}</td>
              <td>{route.destination}</td>
              <td>{route.distance}</td>
              <td>{route.status}</td>

              <td>

                <button
                  onClick={() => editRoute(route)}
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteRoute(route.id)}
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

export default RoutesPage;