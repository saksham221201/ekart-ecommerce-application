import "./SingleProduct.css";
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProductById } from "../../redux/reducers/slices/productByIdSlice";
import { getCartByUserId } from "../../redux/reducers/slices/cartSlice";
import { getReviewByProductId } from "../../redux/reducers/slices/reviewByIdSlice";
import OrderModal from "../../components/Modal/OrderModal";
import ConfimationModal from "../../components/Modal/ConfimationModal";
import {
  PLACE_ORDER_MESSAGE,
  PLACE_ORDER_URL,
  SEND_MAIL_API_URL,
  UPDATE_CART_MESSAGE,
  UPDATE_CART_URL,
} from "../../constants/Constant";

function SingleProduct({ showSuccessAlert, setErrorMessage }) {
  // Using useParams from react-router-dom to get the userId from the URL
  const { productId } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.productByIdSlice);
  const cart = useSelector((state) => state.cartSlice);
  const userId = useSelector((state) => state.authSlice.user?.userId);
  const user = useSelector((state) => state.userSlice.data);
  const email = useSelector((state) => state.authSlice.user?.email);
  const reviews = useSelector((state) => state.reviewByIdSlice.data);

  const navigate = useNavigate();

  // State to manage fields
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(getProductById(productId));
    dispatch(getReviewByProductId(productId));
  }, [dispatch, productId]);

  // Function to check if the product is present in the cart
  const addedToCart = (productId) => {
    return (
      cart.data.products.filter((product) => product.productId === productId)
        .length > 0
    );
  };

  // Function to Update Cart
  const updateCart = async (cartId, productId) => {
    try {
      const updateCartResponse = await fetch(`${UPDATE_CART_URL}${cartId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          productId: [productId],
        }),
      });

      if (updateCartResponse.ok) {
        // console.log("Product added successfully to the cart from Single");
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
      const placeOrderResponse = await fetch(PLACE_ORDER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: [productId],
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
            message: `Hi,<br/><br/>
              Your order has been placed.<br/>
                <h3 className="card-title">Order Details</h3>
                <h4>Product Name: ${data.products[0].productName}</h4> 
                <h4>Price: <b>&#8377;${data.totalPrice}</b></h4> 
                <img src=${data.products[0].imageUrl} alt="Product Image" />
                <h4>Subtotal: &#8377;${data.totalPrice} (PAID)</h4>
                <address>
                To be delivered at:<br/>
                ${user.address.street}<br/>
                ${user.address.city}<br/>
                ${user.address.country}<br/>
                </address>
                Will be Delivered within 24 hours<br/><br/>
              Regards,<br/>
              EKART APPLICATION<br/>
              <img src="https://lh3.googleusercontent.com/a/ACg8ocISfOd5VqZpdRzK6JmDc1IaeGtnlCGidrr8FtO2WGGonA=s288-c-rg-br100" width="50px" height="50px" alt="Application Logo" />`,
          }),
        });

        // eslint-disable-next-line
        const mailData = await sendMailResponse.json();
        // console.log("Send Mail API Response:", mailData);

        if (sendMailResponse.status === 200) {
          showSuccessAlert(PLACE_ORDER_MESSAGE);
          navigate("/");
        }
        // dispatch(getOrderDetails(userId));
      }
    } catch (error) {
      console.error("Error in placing order", error);
      setErrorMessage(error);
    }
  };

  // Styles for productDetails container
  const styles = {
    productDetailsContainer: {
      display: "flex",
    },
    left: {
      flex: 1,
      marginRight: "40px",
    },
    right: {
      flex: 2,
    },
  };

  return (
    <>
      <div className="container mt-2">
        <Link to="/">
          <button className="btn btn-danger">Back</button>
        </Link>
        <h2 className="text-center text-white">Product Details</h2>
        <div
          className="product-details-container mb-3"
          style={styles.productDetailsContainer}
        >
          <div
            id="carouselExampleCaptions"
            className="left carousel slide carousel-fade"
            style={styles.left}
          >
            <div className="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="0"
                className="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
            </div>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src={product.data.imageUrl[0]}
                  alt={product.data.productName}
                  width={500}
                  height={500}
                />
              </div>
              <div className="carousel-item">
                <img
                  src={product.data.imageUrl[1]}
                  alt={product.data.productName}
                  width={500}
                  height={500}
                />
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleCaptions"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
          <div className="right" style={styles.right}>
            <h4 className="text-white">
              <b>{product.data.productName}</b>
            </h4>
            <h4 className="text-white">
              <p className="badge text-bg-warning me-3">
                &#8377;{product.data.productPrice}
              </p>
              <b>{product.data.productRating}</b>{" "}
              <i className="bi bi-star-fill" style={{ color: "#F5961D" }}></i>
            </h4>
            <div className="embed-responsive embed-responsive-16by9">
              <iframe
                className="embed-responsive-item"
                src={`https://www.youtube.com/embed/${product.data.videoUrl}`}
                width={560}
                height={315}
                title={product.data.productName}
                allowFullScreen
                style={{ border: "2px solid white", borderRadius: "20px" }}
              ></iframe>
            </div>
            <p className="text-white fs-5 text">{product.data.description}</p>
            {addedToCart(product.data.productId) ? (
              <Link to="#" style={{ color: "dark", textDecoration: "none" }}>
                <button className="btn btn-info" disabled>
                  Added To Cart
                </button>
              </Link>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() =>
                  updateCart(cart.data.cartId, product.data.productId)
                }
              >
                <Link to="#" style={{ color: "white", textDecoration: "none" }}>
                  Add To Cart
                </Link>
              </button>
            )}

            <Link to="#" style={{ color: "white", textDecoration: "none" }}>
              <button
                className="btn btn-success mx-2"
                data-bs-toggle="modal"
                data-bs-target={
                  cart.data.products.length > 0
                    ? "#confirmModal"
                    : "#orderModal"
                }
                onClick={() => setSelectedProduct(product.data)}
              >
                Buy Now{" "}
              </button>
            </Link>
          </div>
        </div>
        <hr style={{ color: "white" }} />

        <div id="carouselExampleIndicators" className="carousel slide">
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={product.data.bannerImageUrl[0]} className="d-block w-100" alt="Banner" />
            </div>
            <div className="carousel-item">
              <img src={product.data.bannerImageUrl[1]} className="d-block w-100" alt="Banner" />
            </div>
            <div className="carousel-item">
              <img src={product.data.bannerImageUrl[2]} className="d-block w-100" alt="Banner" />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>

        <hr style={{ color: "white" }} />
        <div className="mb-3 text-white">
          <h3>What's in the Box?</h3>
          <li>Smartphone</li>
          <li>Data Cable (Type C-to-C)</li>
          <li>SIM Ejector Pin</li>
          <li>User Manual</li>
        </div>
        <hr style={{ color: "white" }} />
        <div className="mb-5">
          <div className="d-flex justify-content-between">
            <h4 className="text-white">Customer Reviews</h4>
            <button className="btn btn-warning">
              <Link
                to={`/add-review/${productId}`}
                style={{ color: "white", textDecoration: "none" }}
              >
                Add Review
              </Link>
            </button>
          </div>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div className="card my-3" key={review.reviewId}>
                <div className="card-body">
                  {review.review}{" "}
                  <i className="bi bi-pencil-fill" id="editPencil"></i>
                </div>
                <span
                  className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger"
                  style={{ marginLeft: "80px" }}
                >
                  <i className="bi bi-person-fill"></i> {review.user.email}
                </span>
                <div className="card-footer bg-dark text-white">
                  <b>{review.rating}</b>{" "}
                  <i
                    className="bi bi-star-fill"
                    style={{ color: "#F5961D" }}
                  ></i>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-danger my-2" role="alert">
              No Review Available for this Product!
            </div>
          )}
        </div>
      </div>

      <OrderModal selectedProduct={selectedProduct} placeOrder={placeOrder} />
      <ConfimationModal />
    </>
  );
}

export default SingleProduct;
