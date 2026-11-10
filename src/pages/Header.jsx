
import { NavLink } from "react-router-dom";
import "../index.css";

function Header() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.clear();
    window.location.replace("/login");
  };

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
    borderRadius: "10px",
    fontSize: "28px",
    letterSpacing: "1px",
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
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#ffffff" : "#17365d",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    background: isActive ? "#17365d" : "#f8fafc",
    whiteSpace: "nowrap",
  });

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
  };

  const logoutStyle = {
    padding: "9px 18px",
    border: "1px solid #b91c1c",
    borderRadius: "7px",
    background: "#dc2626",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
  };

  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>LogisTransport</h1>

      {user && (
        <>
          <nav style={navStyle}>
            <NavLink to="/dashboard" style={linkStyle}>Dashboard</NavLink>
            <NavLink to="/shipments" style={linkStyle}>Shipments</NavLink>
            <NavLink to="/warehouses" style={linkStyle}>Warehouses</NavLink>
            <NavLink to="/deliveries" style={linkStyle}>Deliveries</NavLink>
            <NavLink to="/track" style={linkStyle}>Tracking</NavLink>
            <NavLink to="/reports" style={linkStyle}>Reports</NavLink>
            <NavLink to="/shipment-search" style={linkStyle}>
              Shipment Search
            </NavLink>
          </nav>

          <div style={userPanelStyle}>
            <div>
              <span style={{ color: "#64748b", fontSize: "13px" }}>
                Logged in as
              </span>

              <p style={{
                margin: "5px 0 0",
                color: "#17365d",
                fontWeight: "700",
                overflowWrap: "anywhere",
              }}>
                {user.email}
              </p>
            </div>

            <button style={logoutStyle} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
