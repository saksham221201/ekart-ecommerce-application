import "./Category.css";
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductsByCategory } from "../../redux/reducers/slices/productsByCategory";
import { getCartByUserId } from "../../redux/reducers/slices/cartSlice";
import { getOrderDetails } from "../../redux/reducers/slices/orderSlice";
import OrderModal from "../../components/Modal/OrderModal";
import ConfimationModal from "../../components/Modal/ConfimationModal";
import { PLACE_ORDER_MESSAGE, PLACE_ORDER_URL, SEND_MAIL_API_URL, UPDATE_CART_MESSAGE, UPDATE_CART_URL } from "../../constants/Constant";

function Category({ showSuccessAlert, setErrorMessage }) {
  // Using useParams from react-router-dom to get the userId from the URL
  const { category } = useParams();

  // State to manage fields
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const userId = useSelector((state) => state.authSlice.user?.userId);
  // console.log(userId);

  const email = useSelector((state) => state.authSlice.user?.email);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getProductsByCategory(category));
    dispatch(getCartByUserId(userId));
    dispatch(getOrderDetails(userId));
  }, [dispatch, category, userId]);

  const products = useSelector((state) => state.productsByCategory);
  // console.log("This is Products:", products.data);
  const cart = useSelector((state) => state.cartSlice);
  // console.log("Cart:", cart);
  const orders = useSelector((state) => state.orderSlice.data);
  // console.log("Orders:", orders);

  // Function to filter out products present in the cart
  const inCart = (productId) => {
    return (
      cart.data.products.filter((product) => product.productId === productId)
        .length > 0
    );
  };

  // Function to filter out products present in the cart
  const inOrders = (productId) => {
    return orders.some((order) =>
      order.products.some((product) => product.productId === productId)
    );
  };

  // Function to Update Cart
  const updateCart = async (cartId, productId) => {
    try {
      const updateCartResponse = await fetch(
        `${UPDATE_CART_URL}${cartId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            productId: [productId],
          }),
        }
      );

      if (updateCartResponse.ok) {
        // console.log("Product added successfully to the cart from Welcome");
        dispatch(getCartByUserId(userId));
        showSuccessAlert(UPDATE_CART_MESSAGE);
      } else if (
        updateCartResponse.status === 404 ||
        updateCartResponse.status === 400
      ) {
        setErrorMessage(updateCartResponse.json.error);
      }
    } catch (error) {
      console.error("Error while updating cart", error);
      setErrorMessage(error);
    }
  };

  const placeOrder = async (productId) => {
    // console.log("Placing the order");
    try {
      const placeOrderResponse = await fetch(
        PLACE_ORDER_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: [productId],
            userId: userId,
          }),
        }
      );

      
      if (placeOrderResponse.ok) {
        const data = await placeOrderResponse.json();
        // console.log("Order placed successfully, API Response:", data);
        
        // Calling Send Mail API
        const sendMailResponse = await fetch(
          `${SEND_MAIL_API_URL}${email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subject: "Order Placed!!",
              message: `Hi,<br/><br/>
              Your order has been placed.<br/>
                <h3 class="card-title">Order Details</h3>
                <h4>Product Name: ${data.products[0].productName}}</h4> 
                <h4>Price: <b>&#8377;${data.totalPrice}</b></h4> 
                <img src=${data.products[0].imageUrl} alt="Product Image" />
                <h4>Subtotal: &#8377;${data.totalPrice} (PAID)</h4>
                Will be Delivered within 24 hours<br/><br/>
              Regards,<br/>
              EKART APPLICATION`,
            }),
          }
        );

        // eslint-disable-next-line
        const mailData = await sendMailResponse.json();
        // console.log("Send Mail API Response:", mailData);

        if (sendMailResponse.status === 200) {
          showSuccessAlert(PLACE_ORDER_MESSAGE);
        }
        dispatch(getOrderDetails(userId));
      }
    } catch (error) {
      console.error("Error in placing order", error);
      setErrorMessage(error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClickSearch = () => {
    const search = document.getElementById("search");
    const close = document.getElementById("close");
    if(search.style.visibility === "visible"){
      search.style.visibility = "hidden";
      search.style.transform = "translateX(10px)";
      close.style.transform = "translateX(-15px)";
      search.style.transition = "all 1s";
      close.style.transition = "all 1s";
      close.style.visibility = "hidden";
    } else{
      search.style.visibility = "visible";
      search.style.transform = "translateX(-5px)";
      close.style.transform = "translateX(-7px)";
      search.style.transition = "all 1s";
      close.style.transition = "all 1s";
      close.style.visibility = "visible";
    } 
  }

  const filteredProducts = products.data.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // console.log("Filtered:", filteredProducts);

  return (
    <>
      <div className="container mt-2">
        <div className="d-flex justify-content-between align-items-center">
          <Link to="/"><button className="btn btn-danger">BACK</button></Link>
          <h2 className="text-white text-center my-2 category">
            {searchQuery ? `You Searched: ${searchQuery}` : `Category: ${category}`}
          </h2>
          <div>
            <input
              type="text"
              id="search"
              className="mr-0"
              placeholder="Search Products"
              value={searchQuery}
              onChange={handleSearch}
              style={{visibility: "hidden", height: "30px"}}
            />
            <button className="btn btn-lg" onClick={() => handleClickSearch()}><i className="bi bi-search-heart-fill"></i></button>
            <button
              type="button"
              id="close"
              className="btn-close"
              onClick={() => setSearchQuery("")}
              style={{visibility: "hidden"}}
              aria-label="Close"
            ></button>
          </div>
        </div>
        <div className="row">
          {searchQuery ? (
            filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div className="col-md-4" key={product.productId}>
                  <div className="card mb-5 ms-4" style={{ width: "19rem" }}>
                    <img
                      src={product.imageUrl[0]}
                      className="card-img-top"
                      width={600}
                      height={400}
                      alt={product.productName}
                    />
                    <div className="card-body">
                      <div className="d-flex justify-content-between">
                        <Link
                          to={`/product/${product.productId}`}
                          className="text-decoration-none text-dark"
                        >
                          <h5 className="card-title">
                            <b>{product.productName}</b>
                          </h5>
                          <h6>
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                              {product.productCategory}
                            </span>
                          </h6>
                        </Link>
                        <h5>
                          <p className="badge text-bg-warning">
                            &#8377;{product.productPrice}
                          </p>
                        </h5>
                      </div>
                      <b>{product.productRating}</b>{" "}
                      <i
                        className="bi bi-star-fill"
                        style={{ color: "#F5961D" }}
                      ></i>
                      <div className="d-flex justify-content-between">
                        {inCart(product.productId) ? (
                          <Link
                            to="#"
                            style={{ color: "dark", textDecoration: "none" }}
                          >
                            <button className="btn btn-sm btn-info" disabled>
                              Added To Cart
                            </button>
                          </Link>
                        ) : inOrders(product.productId) ? (
                          <Link
                            to="#"
                            style={{ color: "dark", textDecoration: "none" }}
                          >
                            <button className="btn btn-sm btn-dark" disabled>
                              Ordered
                            </button>
                          </Link>
                        ) : (
                          <Link
                            to="#"
                            style={{ color: "dark", textDecoration: "none" }}
                          >
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() =>
                                updateCart(cart.data.cartId, product.productId)
                              }
                            >
                              Add To Cart
                            </button>
                          </Link>
                        )}
                        <Link
                          to="#"
                          style={{ color: "dark", textDecoration: "none" }}
                        >
                          <button
                            className="btn btn-sm btn-success"
                            data-bs-toggle="modal"
                            data-bs-target="#orderModal"
                            onClick={() => setSelectedProduct(product)}
                          >
                            Buy Now
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-danger" role="alert">
                No Products Available!
              </div>
            )
          ) : (
            products.data.map((product) => (
              <div className="col-md-4" key={product.productId}>
                <div className="card mb-5 ms-4" style={{ width: "20rem" }}>
                  <img
                    src={product.imageUrl[0]}
                    className="card-img-top"
                    width={600}
                    height={400}
                    alt={product.productName}
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <Link
                        to={`/product/${product.productId}`}
                        className="text-decoration-none text-dark"
                      >
                        <h5 className="card-title">
                          <b>{product.productName}</b>
                        </h5>
                        <h6>
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {product.productCategory}
                          </span>
                        </h6>
                      </Link>
                      <h5>
                        <p className="badge text-bg-warning">
                          &#8377;{product.productPrice}
                        </p>
                      </h5>
                    </div>
                    <b>{product.productRating}</b>{" "}
                    <i
                      className="bi bi-star-fill"
                      style={{ color: "#F5961D" }}
                    ></i>
                    <div className="d-flex justify-content-between">
                      {inCart(product.productId) ? (
                        <Link
                          to="#"
                          style={{ color: "dark", textDecoration: "none" }}
                        >
                          <button className="btn btn-sm btn-info" disabled>
                            Added To Cart
                          </button>
                        </Link>
                      ) : inOrders(product.productId) ? (
                        <Link
                          to="#"
                          style={{ color: "dark", textDecoration: "none" }}
                        >
                          <button className="btn btn-sm btn-dark" disabled>
                            Ordered
                          </button>
                        </Link>
                      ) : (
                        <Link
                          to="#"
                          style={{ color: "dark", textDecoration: "none" }}
                        >
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() =>
                              updateCart(cart.data.cartId, product.productId)
                            }
                          >
                            Add To Cart
                          </button>
                        </Link>
                      )}
                      <Link
                        to="#"
                        style={{ color: "dark", textDecoration: "none" }}
                      >
                        <button
                          className="btn btn-sm btn-success"
                          data-bs-toggle="modal"
                          data-bs-target={cart.data.products.length > 0 ? "#confirmModal" : "#orderModal"}
                          onClick={() => setSelectedProduct(product)}
                        >
                          Buy Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <OrderModal selectedProduct={selectedProduct} placeOrder={placeOrder} />
      <ConfimationModal />
    </>
  );
}

export default Category;
