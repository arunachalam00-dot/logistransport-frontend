
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await fetch("https://logistransport-backend-hp98.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        login(data);

        setMessage("Login successful");
        console.log("Login response:", data);
      } else {
        setMessage("Invalid Email or Password");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
      console.error(error);
    }
  };

  return (
    <div id="login">

      <h1 >Logistics & Parcel Tracking System</h1>

      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            id="email"
            required
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            id="password"
            required
          />
        </div>

        <br />

        <button type="submit" id="login-btn">Login</button>


 <div id="tracking" >
    <p>
      <a href="/track"> Track Your Shipment</a>
    </p>
  </div>
        
  </form>

    {message && <p>{message}</p>}
  </div>
  );
}


export default Login;