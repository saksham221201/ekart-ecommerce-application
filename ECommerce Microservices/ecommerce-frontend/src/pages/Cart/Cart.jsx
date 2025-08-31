import "./Cart.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import CartModal from "../../components/Modal/CartModal";
import { getCartByUserId } from "../../redux/reducers/slices/cartSlice";
import {
  PLACE_ORDER_MESSAGE,
  PLACE_ORDER_URL,
  SEND_MAIL_API_URL,
} from "../../constants/Constant";

function Cart({ showSuccessAlert, setErrorMessage }) {
  const dispatch = useDispatch();

  // Fetching cartDetails from the redux store
  const cart = useSelector((state) => state.cartSlice);
  const userId = useSelector((state) => state.authSlice.user?.userId);
  const email = useSelector((state) => state.authSlice.user?.email);

  let productDetails = "";

  cart.data.products.forEach((product) => {
    productDetails += `
      <h4>Product Name: ${product.productName}</h4> <h4>Price: <b>&#8377;${product.productPrice}</b></h4>
      <img src=${product.imageUrl} alt="Product Image" />
    `;
  });

  const navigate = useNavigate();

  // Calculating subTotal of the cart
  let subTotal = 0.0;
  cart.data.products.forEach((product) => {
    subTotal += product.productPrice;
  });

  const message = `Hi,<br/><br/>
  Your order has been placed.<br/>
    <h3 className="card-title">Order Details</h3>
    ${productDetails} <h4>Subtotal: &#8377;${subTotal} (PAID)</h4>
    <address>
    To be delivered at:<br/>
    Plot 18, Nagarro Corporate Office<br/>
    Gurgaon<br/>
    India<br/>
    </address>
    Will be Delivered within 24 hours<br/><br/>
  Regards,<br/>
  EKART APPLICATION<br/>
  <img src="https://lh3.googleusercontent.com/a/ACg8ocISfOd5VqZpdRzK6JmDc1IaeGtnlCGidrr8FtO2WGGonA=s288-c-rg-br100" width="50px" height="50px" alt="Application Logo" />`;

  const placeOrder = async (productIds) => {
    // console.log("Placing the order");
    try {
      const placeOrderResponse = await fetch(PLACE_ORDER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productIds,
          userId: userId,
        }),
      });
      // eslint-disable-next-line
      const data = await placeOrderResponse.json();
      // console.log("Order placed successfully, API Response:", data);

      if (placeOrderResponse.ok) {
        // Calling Send Mail API
        const sendMailResponse = await fetch(`${SEND_MAIL_API_URL}${email}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subject: "Order Placed!!",
            message: message,
          }),
        });

        // eslint-disable-next-line
        const mailData = await sendMailResponse.json();
        // console.log("Send Mail API Response:", mailData);

        if (sendMailResponse.status === 200) {
          showSuccessAlert(PLACE_ORDER_MESSAGE);
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error in placing order", error);
      setErrorMessage(error);
    }
  };

  // Function to Update Cart
  const removeFromCart = async (cartId, productId) => {
    try {
      const removeCartResponse = await fetch(
        `http://localhost:8084/v1/api/carts/remove/${cartId}`,
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

      if (removeCartResponse.ok) {
        // console.log("Product added successfully to the cart from Welcome");
        dispatch(getCartByUserId(userId));
        showSuccessAlert("Product Removed from the Cart Successfully");
      } else if (
        removeCartResponse.status === 404 ||
        removeCartResponse.status === 400
      ) {
        setErrorMessage(removeCartResponse.json.error);
      }
    } catch (error) {
      console.error("Error while removing product", error);
      setErrorMessage(error);
    }
  };

  return (
    <>
      <div className="container mt-2">
        <div className="d-flex justify-content-between">
          <Link to="/">
            <button className="btn btn-danger">Back</button>
          </Link>
          <h2 className="text-white cart">Your Cart</h2>
          <h4 className="text-white">
            <span className="badge text-bg-warning">
              SubTotal: &#8377;{subTotal}
            </span>
          </h4>
        </div>
        {cart && cart.data.products.length > 0 && (
          <div className="d-flex flex-row-reverse mb-2">
            <button
              className="btn btn-success proceed"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              Proceed to Buy ({cart.data.products.length}
              {cart.data.products.length > 1 ? " items" : " item"})
            </button>
          </div>
        )}
        {cart && cart.data.products.length === 0 && (
          <div className="alert alert-danger" role="alert">
            Cart is Empty! No products in the cart
          </div>
        )}
        {cart && cart.data.products.length > 0 && (
          <div className="row">
            {cart.data.products
              .filter((productId, index, self) => {
                return self.indexOf(productId) === index;
              })
              .map((products) => (
                <div
                  className="card mb-5 mx-4"
                  style={{ width: "20rem" }}
                  key={products.productId}
                >
                  <img
                    src={products.imageUrl[0]}
                    className="card-img-top"
                    alt={products.productName}
                    style={{ width: "18rem", height: "300px" }}
                  />
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <Link
                        to={`/product/${products.productId}`}
                        className="text-decoration-none text-dark"
                      >
                        <h5 className="card-title">
                          <b>{products.productName}</b>
                        </h5>
                        <h6>
                          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {products.productCategory}
                          </span>
                        </h6>
                      </Link>
                      <h5>
                        <span className="badge text-bg-warning">
                          &#8377;{products.productPrice}
                        </span>
                      </h5>
                    </div>
                    <b>{products.productRating}</b>{" "}
                    <i
                      className="bi bi-star-fill"
                      style={{ color: "#F5961D" }}
                    ></i>
                    <button
                      className="btn btn-danger col-6 mx-4 remove"
                      onClick={() =>
                        removeFromCart(cart.data.cartId, products.productId)
                      }
                      type="button"
                    >
                      Remove from Cart
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <CartModal cart={cart} subTotal={subTotal} placeOrder={placeOrder} />
    </>
  );
}

export default Cart;
