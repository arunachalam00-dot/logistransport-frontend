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
                `https://logistransport-backend-hp98.onrender.com/api/shipments/track/${trackingNumber.trim()}`
            );

            setShipment(response.data);

        } catch (error) {

            setError("Shipment not found");
            setShipment(null);
        }
    };

    return (
        <div id="shipment-box">


            <h1 style={{ textAlign: "center" }}>
                Track Your Shipment
            </h1>

            <p style={{ textAlign: "center" }}>
                Enter your tracking number to check shipment status
            </p>

            <div id="track-div">

                <input
                    type="text"
                    placeholder="Enter Tracking Number (e.g. TRK001)"
                    value={trackingNumber}
                    onChange={(e) =>
                        setTrackingNumber(e.target.value)
                    }
                    id="track-search"
                />

                <button
                    onClick={trackShipment}
                    id="track-button"
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
                <div id="shipment-details">

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