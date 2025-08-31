import { useSelector } from "react-redux";
import "./ChangePassword.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PASSWORD_UPDATE_MESSAGE, UPDATE_USER_URL } from "../../constants/Constant";

function ChangePassword({ showSuccessAlert, setErrorMessage }) {
  const navigate = useNavigate();

  const tempPassword = useSelector((state) => state.tempPasswordSlice.password);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChangePassword = async (e) => {
    // To prevent page reload
    e.preventDefault();
    if (parseInt(currentPassword) !== tempPassword.password) {
      setErrorMessage("Current Password Incorrect");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      try {
        const updateUserResponse = await fetch(
          `${UPDATE_USER_URL}${tempPassword.userId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: tempPassword.email,
              firstName: tempPassword.firstName,
              lastName: tempPassword.lastName,
              password: newPassword,
            }),
          }
        );

        // eslint-disable-next-line
        const data = await updateUserResponse.json();
        //   console.log("API Response from Update:", data);
        if (updateUserResponse.ok) {
          showSuccessAlert(PASSWORD_UPDATE_MESSAGE);
          navigate("/login");
        }
        navigate("/login");
      } catch (error) {
        console.error("Error in updating User", error);
      }
    }
  };

  return (
    <div className="signup">
      <div className="forgotBox">
        <form onSubmit={handleChangePassword}>
          <h2>Change Password</h2>
          <div className="inputBox">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
              }}
              required
            />
            <span>Current Password</span>
            <i></i>
          </div>
          <div className="inputBox">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              required
            />
            <span>New Password</span>
            <i></i>
          </div>
          <input type="submit" value="Change Password" />
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
