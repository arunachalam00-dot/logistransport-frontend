
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

 

  return (
    <header className="header-style">
      <h1 className="title-style">LogisTransport</h1>

      {user && (
        <>
          <nav className="nav-style">
            <NavLink to="/dashboard" className="link-style">Dashboard</NavLink>
            <NavLink to="/shipments" className="link-style">Shipments</NavLink>
            <NavLink to="/warehouses" className="link-style">Warehouses</NavLink>
            <NavLink to="/deliveries" className="link-style">Deliveries</NavLink>
            <NavLink to="/track" className="link-style">Tracking</NavLink>
            <NavLink to="/reports" className="link-style">Reports</NavLink>
            <NavLink to="/shipment-search" className="link-style">
              Shipment Search
            </NavLink>
          </nav>

          <div className="user-panel-style">
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

            <button className="logout-style" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
