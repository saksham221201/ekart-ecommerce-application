import React from "react";

function OrderModal({ selectedProduct, placeOrder }) {
  
  return (
    <>
      {/* Welcome Modal Starts Here */}
      <div
        className="modal fade"
        id="orderModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="orderModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="orderModalLabel">
                Order Details Preview
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {selectedProduct && (
              <div className="modal-body">
                <h5>Product Details:</h5>
                <div>
                  <p>
                    <strong>Product Name: </strong>
                    {selectedProduct.productName}
                  </p>
                </div>
                <div className="d-flex justify-content-between">
                  <p>
                    <strong>SubTotal: </strong>
                    <b>&#8377;{selectedProduct.productPrice}</b>
                  </p>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="flexRadioDefault"
                      id="flexRadioDefault2"
                      defaultChecked
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexRadioDefault2"
                    >
                      Pay via GooglePay
                    </label>
                  </div>
                </div>
                <h5>Terms and conditions for Guaranteed Delivery</h5>
                <li>
                  Guaranteed Delivery options are available on Prime Eligible
                  items in select cities.
                </li>
                <li>Only certain pin codes are eligible for these options.</li>
                <li>
                  To get your order within the Guaranteed Delivery time, you
                  need to select the respective delivery option during checkout.
                </li>
                <div
                  className="card text-bg-light my-2"
                  style={{ maxWidth: "28rem" }}
                >
                  <div className="card-header">
                    <b>Address</b>
                  </div>
                  <div className="card-body">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="address"
                        id="address"
                        defaultChecked
                      />
                      <label className="form-check-label" htmlFor="address">
                      Plot 18, Nagarro Office, Gurgaon, India
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-success"
                data-bs-dismiss="modal"
                onClick={() => placeOrder(selectedProduct.productId)}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Welcome Modal Ends Here */}
    </>
  );
}

export default OrderModal;
