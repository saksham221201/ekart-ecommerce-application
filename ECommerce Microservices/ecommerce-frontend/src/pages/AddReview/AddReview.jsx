import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ADD_REVIEW_URL, ADD_REVIEW_MESSAGE } from "../../constants/Constant";

function AddReview({ showSuccessAlert, setErrorMessage }) {
  // Using useParams to get the productId from the URL
  const { productId } = useParams();

  const userId = useSelector((state) => state.authSlice.user?.userId);

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);

  const navigate = useNavigate();

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    // console.log("Form submitted");

    try {
      const addReviewResponse = await fetch(ADD_REVIEW_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ review, rating, productId, userId }),
      });

      const data = await addReviewResponse.json();
      // console.log("API Response:", data);

      if (addReviewResponse.ok) {
        showSuccessAlert(ADD_REVIEW_MESSAGE);
        navigate(`/product/${productId}`);
      } else if (addReviewResponse.status === 400) {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error);
    }

    // Clearing the form fields
    setReview("");
  };

  return (
    <div className="text-white container mt-2">
      <Link to={`/product/${productId}`}>
        <button className="btn btn-danger">Back</button>
      </Link>
      <h3 className="text-center">Add a Review</h3>
      <form onSubmit={handleSubmitReview}>
        <div className="form-floating text-dark">
          <textarea
            className="form-control"
            placeholder="Leave a comment here"
            id="floatingTextarea"
            style={{ height: "150px" }}
            value={review}
            onChange={(e) => {
              setReview(e.target.value);
            }}
            required
          ></textarea>
          <label htmlFor="floatingTextarea">Review</label>
        </div>
        <div className="mt-3">
          <label htmlFor="rating" className="form-label">
            Rating
          </label>
          <input
            type="number"
            step="any"
            className="form-control"
            id="rating"
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
            }}
            min={1}
            max={5}
            required
          />
        </div>
        <button type="submit" className="btn btn-success my-4">
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddReview;
