import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/reducers/slices/authSlice";
import { setTempPassword } from "../../redux/reducers/slices/tempPasswordSlice";
import { clearTempPassword } from "../../redux/reducers/slices/tempPasswordSlice";
import { getUserById } from "../../redux/reducers/slices/userSlice";
import cryptoRandomString from "crypto-random-string";
import { USER_EMAIL_URL, SEND_MAIL_API_URL, MAIL_SEND_MESSAGE, LOGIN_URL, LOGIN_MESSAGE } from "../../constants/Constant";

function Login({ showSuccessAlert, setErrorMessage }) {
  // State to manage form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  const temporaryPassword = parseInt(cryptoRandomString({
    length: 6,
    type: 'numeric'
  }));

  const message = `Hi,<br/><br/>
  Your Temporary Password is <strong>${temporaryPassword}</strong>.<br/>
  Please use this password to Login and change it.<br/><br/>
  Regards,<br/>
  EKART APPLICATION<br/>
  <img src="https://lh3.googleusercontent.com/a/ACg8ocISfOd5VqZpdRzK6JmDc1IaeGtnlCGidrr8FtO2WGGonA=s288-c-rg-br100" width="50px" height="50px" alt="Application Logo" />`;

  const navigate = useNavigate();

  // Using dispatch to save the user details in redux store
  const dispatch = useDispatch();

  const handleForgotEmail = async (e) => {
    // To prevent page reload
    e.preventDefault();

    try {
      const getUserByEmailResponse = await fetch(
        `${USER_EMAIL_URL}${forgotEmail}`
      );
      const data = await getUserByEmailResponse.json();
      // console.log("Get API Response:", data);

      if (getUserByEmailResponse.ok) {
        const tempData = {
          userId: data.userId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          password: temporaryPassword,
        };

        // Calling Send Mail API
        const sendMailResponse = await fetch(
          `${SEND_MAIL_API_URL}${data.email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              subject: "Change Password",
              message: message,
            }),
          }
        );

        const mailData = await sendMailResponse.json();
        // console.log("Send Mail API Response:", mailData);

        if (sendMailResponse.status === 200) {
          showSuccessAlert(MAIL_SEND_MESSAGE);
          dispatch(setTempPassword({ user: tempData }));
          navigate("/changePassword");
        } else if (sendMailResponse.status === 400) {
          setErrorMessage(mailData.error);
        }
      } else if (getUserByEmailResponse.status === 404) {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }

    // Clearing the form fields
    setForgotEmail("");
  };

  const handleLogin = async (e) => {
    // To prevent page reload
    e.preventDefault();

    try {
      const loginResponse = await fetch(
        LOGIN_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await loginResponse.json();
      // console.log("API Response:", data);

      if (loginResponse.ok) {
        dispatch(loginUser({ user: data }));
        dispatch(getUserById(data.userId));
        dispatch(clearTempPassword());
        showSuccessAlert(LOGIN_MESSAGE);
        navigate("/");
      } else if (loginResponse.status === 404 || loginResponse.status === 400) {
        setErrorMessage(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage(error);
    }

    // Clearing the form fields
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div className="login">
        <div className="loginBox">
          <form onSubmit={handleLogin}>
            <h2>Login To Ekart</h2>
            <div className="inputBox">
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                required
              />
              <span>Email</span>
              <i></i>
            </div>
            <div className="inputBox">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
              <span>Password</span>
              <i></i>
            </div>
            <div className="links">
              <Link data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                Forgot Password
              </Link>
              <Link to="/signup">No Account? Signup</Link>
            </div>
            <input type="submit" value="Login" />
          </form>
        </div>
      </div>

      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Forgot Password?
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleForgotEmail}>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Please enter valid Email"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#staticBackdrop"
                >
                  Submit
                </button>
              </form>
            </div>
            <div className="modal-footer">
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
    </>
  );
}

export default Login;
