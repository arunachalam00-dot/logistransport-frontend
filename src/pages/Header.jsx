import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const { user, logout } = useContext(AuthContext);

  const headerStyle = {
    margin: "20px auto",
    padding: "20px",
    maxWidth: "1200px",
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    boxShadow: "0 5px 0 #cbd5e1, 0 10px 20px rgba(0,0,0,0.12)",
    boxSizing: "border-box",
  };

  const titleStyle = {
    margin: "0 0 20px",
    padding: "18px",
    textAlign: "center",
    background: "#17365d",
    color: "#ffffff",
    border: "1px solid #102945",
    borderRadius: "10px",
    boxShadow: "0 4px 0 #0d223b, 0 7px 12px rgba(0,0,0,0.18)",
    letterSpacing: "1px",
    fontSize: "28px",
  };

  const navStyle = {
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    padding: "14px",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    boxShadow: "0 3px 0 #e2e8f0",
  };

  const linkStyle = {
    color: "#17365d",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    background: "#f8fafc",
    boxShadow: "0 3px 0 #cbd5e1",
    whiteSpace: "nowrap",
  };

  const userPanelStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "18px",
    padding: "14px 18px",
    background: "#ffffff",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    boxShadow: "0 3px 0 #e2e8f0",
  };

  const logoutStyle = {
    padding: "9px 18px",
    border: "1px solid #b91c1c",
    borderRadius: "7px",
    background: "#dc2626",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 3px 0 #991b1b",
  };

  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>LogisTransport</h1>

      {user && (
        <nav style={navStyle}>
          <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
          <Link to="/shipments" style={linkStyle}>Shipments</Link>
          <Link to="/warehouses" style={linkStyle}>Warehouses</Link>
          <Link to="/deliveries" style={linkStyle}>Deliveries</Link>
          <Link to="/track" style={linkStyle}>Tracking</Link>
          <Link to="/reports" style={linkStyle}>Reports</Link>
          <Link to="/shipment-search" style={linkStyle}>
            Shipment Search
          </Link>
        </nav>
      )}

      {user && (
        <div style={userPanelStyle}>
          <div>
            <span style={{ color: "#64748b", fontSize: "13px" }}>
              Logged in as
            </span>
            <p
              style={{
                margin: "5px 0 0",
                color: "#17365d",
                fontWeight: "700",
                overflowWrap: "anywhere",
              }}
            >
              {user.email}
            </p>
          </div>

          <button onClick={logout} style={logoutStyle}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;