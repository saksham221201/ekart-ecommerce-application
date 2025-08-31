import "./MyOrders.css";
import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getOrderDetails } from "../../redux/reducers/slices/orderSlice";
import { CANCEL_ORDER_MESSAGE, CANCEL_ORDER_URL } from "../../constants/Constant";

function MyOrders({ showSuccessAlert, setErrorMessage }) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.authSlice.user?.userId);

  const orders = useSelector((state) => state.orderSlice.data);
  // console.log("This is orders from redux", orders);

  const cancelOrder = async (orderId) => {
    console.log("Cancel Order");
    try {
      const cancelOrderResponse = await fetch(`${CANCEL_ORDER_URL}${orderId}`);
      if (cancelOrderResponse.ok) {
        // console.log("Order is Cancelled!!");
        showSuccessAlert(CANCEL_ORDER_MESSAGE);
        dispatch(getOrderDetails(userId));
      } else if (
        cancelOrderResponse.status === 400 ||
        cancelOrderResponse.status === 404
      ) {
        setErrorMessage("Error in Cancelling Order");
      }
    } catch (error) {
      console.error("Error in cancelling Order", error);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateProgress = (startTime) => {
    const orderTime = new Date(startTime).getTime();
    const duration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - orderTime;
    const percentage = (elapsedTime / duration) * 100;
    return percentage > 100 ? 100 : percentage.toFixed(1); // Cap at 100%
  };

  return (
    <div className="container mt-2">
      <div className="d-flex justify-content-between mb-1">
        <Link to="/">
          <button className="btn btn-danger">Back</button>
        </Link>
        <h2 className="text-white order">Your Orders</h2>
        <div></div>
      </div>
      {orders && orders.length === 0 && (
        <div className="alert alert-danger" role="alert">
          There are no Orders in the list!! Order Now!
        </div>
      )}
      {orders &&
        orders.length > 0 &&
        (orders[0].orderStatus === "CREATED" ||
          orders[0].orderStatus === "COMPLETED" ||
          orders[0].orderStatus === "CANCELLED") && (
          <div className="row">
            {orders.map((order) =>
              order.products
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
                      <p>
                        ORDERED AT: <b>{formatDate(order.timestamp)}</b>
                      </p>
                      <b>{products.productRating}</b>{" "}
                      <i
                        className="bi bi-star-fill"
                        style={{ color: "#F5961D" }}
                      ></i>
                      <div
                        className="progress mb-2"
                        role="progressbar"
                        aria-label="Success striped example"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar progress-bar-striped bg-success"
                          style={{width: `${calculateProgress(order.timestamp)}%`}}
                        ><b>{`${calculateProgress(order.timestamp)}%`}</b></div>
                      </div>
                      {order.orderStatus === "CREATED" ? (
                        <div className="d-grid gap-2">
                          <button
                            className="btn btn-info"
                            type="button"
                            disabled
                          >
                            {order.orderStatus}
                          </button>
                          <button
                            className="btn btn-danger"
                            type="button"
                            onClick={() => cancelOrder(order.orderId)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="d-grid">
                          <button
                            className={`btn ${
                              order.orderStatus === "CANCELLED"
                                ? "btn-danger"
                                : order.orderStatus === "COMPLETED"
                                ? "btn-success"
                                : "btn-info"
                            }`}
                            type="button"
                            disabled
                          >
                            {order.orderStatus}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
    </div>
  );
}

export default MyOrders;
