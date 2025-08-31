import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Login from "./pages/Login/Login";
import About from "./pages/About/About";
import Welcome from "./pages/Welcome/Welcome";
import Signup from "./pages/Signup/Signup";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Cart from "./pages/Cart/Cart";
import SingleProduct from "./pages/SingleProduct/SingleProduct";
import Home from "./pages/Home/Home";
import MyOrders from "./pages/MyOrders/MyOrders";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import Category from "./pages/Category/Category";
import Profile from "./pages/Profile/Profile";
import AddReview from "./pages/AddReview/AddReview";
import Brand from "./pages/Brand/Brand";

function App() {
  // State to manage Alert fields
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Checking if the user is Logged In or not
  const isLoggedIn = useSelector((state) => state.authSlice.isLoggedIn);

  const showSuccessAlert = (message) => {
    setSuccessMessage(message);
    setShowAlert(true);
  };

  useEffect(() => {
    let timeout;
    if (showAlert) {
      timeout = setTimeout(() => {
        setShowAlert(false);
      }, 3000); // Hiding the alert after 3 seconds
    }

    // Clearing the error message after 3 seconds
    if (errorMessage) {
      timeout = setTimeout(() => {
        setErrorMessage("");
      }, 3000); // Hiding the error message after 3 seconds
    }

    return () => clearTimeout(timeout);
  }, [showAlert, errorMessage]);

  return (
    <Router>
      <Navbar title="Ekart" showSuccessAlert={showSuccessAlert} />
      {/* Showing the Success Alert below the Header */}
      {showAlert && (
        <div className="alert alert-success p-2 mb-0" role="alert">
          <strong>Success!!</strong> {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-danger p-2 mb-0" role="alert">
        <strong>Error!!</strong> {errorMessage}
      </div>
      )}
      
      <Routes>
        <Route path="/" element={isLoggedIn ? <Welcome showSuccessAlert={showSuccessAlert} setErrorMessage={setErrorMessage} /> : <Home />} />
        <Route path="/login" element={isLoggedIn ? <Welcome showSuccessAlert={showSuccessAlert} setErrorMessage={setErrorMessage} /> : <Login showSuccessAlert={showSuccessAlert} setErrorMessage={setErrorMessage} />} />
        <Route path="/about" element={<About />} />
        <Route path="/product/:productId" element={<SingleProduct showSuccessAlert={showSuccessAlert} setErrorMessage={setErrorMessage} />} />
        <Route path="/signup" element={<Signup showSuccessAlert={showSuccessAlert} setErrorMessage={setErrorMessage} />} />
        <Route path="/cart/:userId" element={<Cart showSuccessAlert={showSuccessAlert} setErrorMessage={setErrorMessage} />} />
        <Route path="/orders" element={<MyOrders showSuccessAlert={showSuccessAlert} setErrorMessage={setErrorMessage} />} />
        <Route path="/changePassword" element={<ChangePassword showSuccessAlert={showSuccessAlert} setErrorMessage={setErrorMessage} />} />
        <Route path="/category/:category" element={<Category showSuccessAlert={showSuccessAlert} setErrorMessage={setErrorMessage} />} />
        <Route path="/brand/:brand" element={<Brand showSuccessAlert={showSuccessAlert} setErrorMessage={setErrorMessage} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-review/:productId" element={<AddReview showSuccessAlert={showSuccessAlert} setErrorMessage={setErrorMessage} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
