import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function ConfimationModal() {
  const userId = useSelector((state) => state.authSlice.user?.userId);
  return (
    <>
      {/* <!-- Confirmation Modal Starts Here --> */}
      <div
        className="modal fade"
        id="confirmModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="confimModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="confirmModalLabel">
                Check Your Cart
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              You have products in your cart. Please Buy/Clear them first.
            </div>
            <div className="modal-footer">
              <Link to={`/cart/${userId}`}><button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Go to Cart
              </button></Link>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- Confirmation Modal Ends Here --> */}
    </>
  );
}

export default ConfimationModal;
