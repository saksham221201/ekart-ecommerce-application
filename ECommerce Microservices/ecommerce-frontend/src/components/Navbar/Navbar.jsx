import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/reducers/slices/authSlice";
import { GET_ALL_CATEGORIES_URL, GET_ALL_BRANDS_URL, LOGOUT_SUCCESS_MESSAGE } from "../../constants/Constant";
import logoImage from "../../assets/logo.png";
import "./Navbar.css";

function Navbar(props) {
  // State to manage form fields
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const isLoggedIn = useSelector((state) => state.authSlice.isLoggedIn);
  const userId = useSelector((state) => state.authSlice.user?.userId);
  const firstName = useSelector((state) => state.userSlice.data?.firstName);
  const lastName = useSelector((state) => state.userSlice.data?.lastName);
  const numberOfProductsinCart = useSelector(
    (state) => state.cartSlice.data.products.length
  );
  const numberOfOrders = useSelector((state) => state.orderSlice.data.length);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories();
    getAllBrands();
  }, []);

  const getAllCategories = async () => {
    try {
      const categoriesResponse = await fetch(GET_ALL_CATEGORIES_URL);

      const data = await categoriesResponse.json();
      setCategories(data);
      // console.log("Data:", data);
    } catch (error) {
      console.error("Error fetching Categories", error);
    }
  };

  const getAllBrands = async () => {
    try {
      const brandsResponse = await fetch(GET_ALL_BRANDS_URL);

      const data = await brandsResponse.json();
      setBrands(data);
      // console.log("Data:", data);
    } catch (error) {
      console.error("Error fetching Brands", error);
    }
  };

  const handleLogout = () => {
    navigate("/");
    dispatch(logoutUser());
    props.showSuccessAlert(LOGOUT_SUCCESS_MESSAGE);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <img src={logoImage} id="logoImg" alt="Logo" />
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          {props.title}
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                aria-current="page"
                to="/"
                activeclassname="active"
                exact="true"
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/about"
                activeclassname="active"
                exact="true"
              >
                About
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              {isLoggedIn && <Link
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </Link>}
              <ul className="dropdown-menu">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link className="dropdown-item" to={`/category/${category}`} key={index}>
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item dropdown">
              {isLoggedIn && <Link
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Brands
              </Link>}
              <ul className="dropdown-menu">
                {brands.map((brand, index) => (
                  <li key={index}>
                    <Link className="dropdown-item" to={`/brand/${brand}`} key={index}>
                      {brand}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          {isLoggedIn ? (
            <div className="d-flex">
              <span className="text-white mt-2 mx-2">
                Hello,{" "}
                <Link to="/profile" style={{textDecoration: "none", color: "white"}}><i>
                  {firstName} {lastName}
                </i></Link>
              </span>
              <Link to="/orders">
                <button className="btn btn-success">
                  Your Orders{" "}
                  <span className="badge text-bg-warning">
                    {numberOfOrders}
                  </span>
                </button>
              </Link>
              <Link to={`/cart/${userId}`}>
                <button type="button" className="btn btn-primary mx-2">
                  Cart{" "}
                  <span className="badge text-bg-warning">
                    {numberOfProductsinCart}
                  </span>
                </button>
              </Link>
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="d-flex">
              <Link to="/login">
                <button className="btn btn-outline-success">Login</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
