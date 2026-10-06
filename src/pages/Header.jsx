import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Header() {

  const { user, logout } = useContext(AuthContext);

  return (
    <header>

      <h1>LogisTransport</h1>

      <nav
  style={{
    display: "flex",
    gap: "25px",
    flexWrap: "wrap",
    alignItems: "center"
  }}
>
  {user && (
    <>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/shipments">Shipments</Link>
      <Link to="/warehouses">Warehouses</Link>
      <Link to="/deliveries">Deliveries</Link>
      <Link to="/track">Tracking</Link>
      <Link to="/tracking-history">Tracking History</Link>
      <Link to="/reports">Reports</Link>
      <Link to="/routes">Routes</Link>
      <Link to="/delivery-proofs">Delivery Proof</Link>
      <Link to="/shipment-search">Shipment Search</Link>
    </>
  )}
</nav>

      {user && (
        <div>

          <p>
            Logged in as: {user.email}
          </p>

          <button onClick={logout}>
            Logout
          </button>

        </div>
      )}

      <hr />

    </header>
  );
}

export default Header;