
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import Tracking from "./pages/Tracking";
import TrackingHistory from "./pages/TrackingHistory";
import Warehouses from "./pages/Warehouses";
import Deliveries from "./pages/Deliveries";
import Reports from "./pages/Reports";
import RoutesPage from "./pages/Routes";
import DeliveryProof from "./pages/DeliveryProof";
import ShipmentSearch from "./pages/ShipmentSearch";
import Header from "./pages/Header";


function App() {
  const { user } = useContext(AuthContext);

  return (
    <BrowserRouter>
     <Header />
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />

        <Route
          path="/shipments"
          element={user?.role ==="ADMIN"
            ? <Shipments /> : <Navigate to="/login" />}
        />

        <Route  path="/warehouses"
            element={ user?.role === "ADMIN" ? <Warehouses />
            : <Navigate to="/track" /> }
            />

         <Route
            path="/deliveries"
            element={
              user?.role === "ADMIN"
                ? <Deliveries />
                : <Navigate to="/track" />
          }
          />

          <Route path="/reports"
                 element={
                  user?.role === "ADMIN" ? <Reports /> 
                  :<Navigate to="/track" />
                 }
                 />

            <Route path="/routes"
                 element={
                  user?.role === "ADMIN" ? <RoutesPage /> 
                  :<Navigate to="/track" />
                 }
                 />

          <Route path="/tracking-history"
                element={
                  user?.role === "ADMIN" ? <TrackingHistory />
                  :<Navigate to="/track" />
                }
                />

            <Route path="/delivery-proofs"
                   element={user?.role === "ADMIN" ? <DeliveryProof />
                   :<Navigate to="/track" />
                   }
                   />

          <Route path="/shipment-search"
                 element={user?.role === "ADMIN" ? <ShipmentSearch />
                  :<Navigate to="/track" />
                 }
                 />

            <Route path="/track" element={<Tracking />} />     

      </Routes>

    </BrowserRouter>
  );
}

export default App;
