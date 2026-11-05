import { Link, useNavigate } from "react-router-dom";
import '../index.css';

function Header() {
  const navigate = useNavigate();

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

  const linkStyle = ({ isActive}) => ({
    color: isActive ? "white" : "#17365d",
    backgrundColour: isActive ? "green" : "#f8fafc" ,
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    background: "#f8fafc",
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
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/shipments" style={linkStyle}>Shipments</Link>
            <Link to="/warehouses" style={linkStyle}>Warehouses</Link>
            <Link to="/deliveries" style={linkStyle}>Deliveries</Link>
            <Link to="/track" style={linkStyle}>Tracking</Link>
            <Link to="/reports" style={linkStyle}>Reports</Link>
            <Link to="/shipment-search" style={linkStyle}>Shipment Search </Link>
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

            <button className="logoutStyle" onClick={handleLogout} >
              Logout
            </button>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;