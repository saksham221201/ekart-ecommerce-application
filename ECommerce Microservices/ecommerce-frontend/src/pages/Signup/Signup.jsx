import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import { SIGNUP_URL, SIGNUP_MESSAGE,CREATE_CART_URL } from "../../constants/Constant";

function Signup({ showSuccessAlert, setErrorMessage }) {

  // State to manage form fields
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    // To prevent page reload
    e.preventDefault();

    try {
        const signupResponse = await fetch(SIGNUP_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({email, firstName, lastName, password})
        });
  
        const data = await signupResponse.json();
        // console.log("API Response:", data);
        
        if(signupResponse.ok){
          showSuccessAlert(SIGNUP_MESSAGE);
          navigate("/login");

          // Calling Create Cart API
          const createCartResponse = await fetch(`${CREATE_CART_URL}${data.userId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            }
          });
          const cartData = await createCartResponse.json();
          // console.log("Cart API Response:", cartData);
          
          if(createCartResponse.status === 400){
            setErrorMessage(cartData.error);
          }
        
        } else if(signupResponse.status === 400){
          setErrorMessage(data.error);
        }
      } catch (error) {
        console.error("Error:", error);
      }
  
      // Clearing the form fields
      setEmail("");
      setFirstName("");
      setLastName("");
      setPassword("");
  }

  return (
    <div className="signup">
      <div className="box">
        <form onSubmit={handleSignup}>
          <h2>Signup To Ekart</h2>
          <div className="inputBox">
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
            <span>Email</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input
              type="text"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              required
            />
            <span>FirstName</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input
              type="text"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              required
            />
            <span>LastName</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
            <span>Password</span>
            <i></i>
          </div>
          <div className="links">
            <Link to="#"></Link>
            <Link to="/login">Already a user? Login</Link>
          </div>
          <input type="submit" value="Signup" />
        </form>
      </div>
    </div>
  );
}

export default Signup;
