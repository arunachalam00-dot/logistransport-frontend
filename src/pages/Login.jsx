
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
      const response = await fetch("http://localhost:8080/api/auth/login", {
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
    <div style={{
        marginTop:'100px',
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
       }}>

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
              style={{
                       width: "300px",
                       padding: "12px",
                       border: "1px solid #cbd5e1",
                       borderRadius: "8px",
                       fontSize: "15px",
                       outline: "none",
                       boxSizing: "border-box"
                     }}
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
              style={{
                width: "300px",
                padding: "12px",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
               fontSize: "15px",
                outline: "none",
               boxSizing: "border-box"
             }}
            required
          />
        </div>

        <br />

        <button type="submit"
                  style={{
                           width: "300px",
                            padding: "12px",
                           backgroundColor: "#2563eb",
                           color: "white",
                           border: "none",
                           borderRadius: "8px",
                           fontSize: "16px",
                           fontWeight: "bold",
                           cursor: "pointer"
                         }}>Login</button>


       <div style={{border:'2px solid black',
                   marginTop:'30px',
                   padding:'0px 40px',
                   borderRadius:"10px",
                   backgroundColor:'white',
                   boxShadow:'0px 20px 15px rgba(0,0,10,155)',
                   fontWeight:'bold',
                   }} >
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