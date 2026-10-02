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
                `http://localhost:8080/api/shipments/track/${trackingNumber.trim()}`
            );

            setShipment(response.data);

        } catch (error) {

            setError("Shipment not found");
            setShipment(null);
        }
    };

    return (
        <div style={{
            maxWidth: "700px",
            margin: "50px auto",
            padding: "30px",
            fontFamily: "Arial"
        }}>

            <p>
                <a href="/login">  back to Login</a>
            </p>

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
                        flex: 1,
                        padding: "12px",
                        fontSize: "16px"
                    }}
                />

                <button
                    onClick={trackShipment}
                    style={{
                        padding: "12px 20px",
                        fontSize: "16px",
                        cursor: "pointer"
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