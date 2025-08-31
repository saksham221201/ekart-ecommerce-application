import React from "react";
import { useSelector } from "react-redux";

function Profile() {
  const user = useSelector((state) => state.userSlice.data);
  return (
    <div className="container mt-2">
      <h2 className="text-center text-white">Your Profile</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="email" className="form-label text-white">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={user.email}
            disabled
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label text-white">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={user.firstName + " " + user.lastName}
            disabled
          />
        </div>
        <div className="d-flex">
          <div className="mb-3 col-md-4">
            <label htmlFor="street" className="form-label text-white">
              Street
            </label>
            <input
              type="text"
              className="form-control"
              id="street"
              value={user.address.street}
              style={{ width: "60%" }}
              disabled
            />
          </div>
          <div className="mb-3 col-md-4">
            <label htmlFor="city" className="form-label text-white">
              City
            </label>
            <input
              type="text"
              className="form-control"
              id="city"
              value={user.address.city}
              style={{ width: "60%" }}
              disabled
            />
          </div>
          <div className="mb-3 col-md-4">
            <label htmlFor="zipCode" className="form-label text-white">
              Zipcode
            </label>
            <input
              type="text"
              className="form-control"
              id="zipCode"
              value={user.address.zipCode}
              style={{ width: "60%" }}
              disabled
            />
          </div>
        </div>
        <div className="d-flex">
          <div className="mb-3 col-md-6">
            <label htmlFor="state" className="form-label text-white">
              State
            </label>
            <input
              type="text"
              className="form-control"
              id="state"
              value={user.address.state}
              style={{ width: "60%" }}
              disabled
            />
          </div>
          <div className="mb-3 col-md-6">
            <label htmlFor="country" className="form-label text-white">
              Country
            </label>
            <input
              type="text"
              className="form-control"
              id="country"
              value={user.address.country}
              style={{ width: "60%" }}
              disabled
            />
          </div>
        </div>
        {/* Map - Location is Gurugram Nagarro Office */}
        <label htmlFor="location" className="text-white form-label">Location</label>
        <iframe
          className="mb-5"
          title="Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.5947576218364!2d77.07169372374582!3d28.49174839046303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d19147c86e895%3A0xf37b86c65a4e0721!2sNagarro%20Corporate%20Office%2C%20Maruti%20Udyog%2C%20Sector%2018%2C%20Gurugram%2C%20Sarhol%2C%20Haryana%20122022!5e0!3m2!1sen!2sin!4v1713260913382!5m2!1sen!2sin"
          height="450"
          style={{ border: 0, width: "100%" }}
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </form>
    </div>
  );
}

export default Profile;
