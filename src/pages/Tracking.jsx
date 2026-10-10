import { useState } from "react";
import axios from "axios";

function Tracking() {

    const [trackingNumber, setTrackingNumber] = useState("");
    const [shipment, setShipment] = useState(null);
    const [error, setError] = useState("");

    const trackShipment = async () => {

        if (!trackingNumber.trim()) {
            setError("Please enter tracking number");
            setShipment(null);
            return;
        }

        try {

            setError("");
            setShipment(null);

            const response = await axios.get(
                `https://logistransport-backend-7oqv.onrender.com/api/shipments/track/${trackingNumber.trim()}`
            );

            setShipment(response.data);

        } catch (error) {

            setError("Shipment not found");
            setShipment(null);
        }
    };

    return (
        <div style={{
              maxWidth: "900px",
              margin: "30px auto",
              padding: "25px",
              background: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.12)"
             }}>

            {/* <p>
                <a href="/login">  back to Login</a>
            </p> */}

            <h1 style={{ textAlign: "center" }}>
                Track Your Shipment
            </h1>

            <p style={{ textAlign: "center" }}>
                Enter your tracking number to check shipment status
            </p>

            <div style={{
                display: "flex",
                gap: "10px",
                marginTop: "30px"
            }}>

                <input
                    type="text"
                    placeholder="Enter Tracking Number"
                    value={trackingNumber}
                    onChange={(e) =>
                        setTrackingNumber(e.target.value)
                    }
                    style={{
                        width:'1000px',
                          padding: "12px",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          fontSize: "15px",
                          outline: "none"
                          }}
                />

                <button
                    onClick={trackShipment}
                     style={{
                         padding: "12px 28px",
                         background: "#2563eb",
                         color: "white",
                         border: "none",
                         borderRadius: "8px",
                         fontSize: "15px",
                         fontWeight: "600",
                         cursor: "pointer",
                         boxShadow: "0 4px 0 #1d4ed8",
                         transition: "0.2s"
                       }}
                >
                    Track
                </button>

            </div>

            {error && (
                <p style={{
                    color: "red",
                    textAlign: "center",
                    marginTop: "20px"
                }}>
                    {error}
                </p>
            )}

            {shipment && (
                <div style={{
                    marginTop: "30px",
                    padding: "25px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>

                    <h2>Shipment Details</h2>

                    <p>
                        <strong>Tracking Number:</strong>{" "}
                        {shipment.trackingNumber}
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}
                        <span style={{fontWeight:'bold'}}></span>
                        {shipment.status}
                    </p>

                    <p>
                        <strong>Sender:</strong>{" "}
                        {shipment.senderName}
                    </p>

                    <p>
                        <strong>Receiver:</strong>{" "}
                        {shipment.receiverName}
                    </p>

                    <p>
                        <strong>Source:</strong>{" "}
                        {shipment.source}
                    </p>

                    <p>
                        <strong>Destination:</strong>{" "}
                        {shipment.destination}
                    </p>

                </div>
            )}

        </div>
    );
}

export default Tracking;