import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function User_Signup() {
  const [intialValue, setInitialValue] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });
  const history = useHistory();

  const UserValidation = Yup.object().shape({
    username: Yup.string()
      .required("Username is Required !")
      .min(2, "Too Short!")
      .max(50, "Too Long!")
      .matches(
        /^[a-zA-Z0-9]+$/,
        "Username must contain only letters and numbers"
      ),
    email: Yup.string()
      .required("Email is Required !")
      .email("Invalid email")
      .matches(
        /^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address!"
      ),
    mobileNumber: Yup.string()
      .required("Mobile number is Required !")
      .matches(/^[0-9]{6,10}$/, "Mobile number must be 10 digits !"),
    password: Yup.string()
      .required("Password is Required !")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match")
      .required("Confirm password is Required !"),
  });

  const handleUserSignupData = async (values, { resetForm }) => {
    try {
      let postUser = await axios.post(
        "http://localhost:3000/user/signup",
        values
      );

      console.log("postUser --------------> ", postUser);
      console.log("postUser --------------> ", postUser.data.data);

      if (postUser.data.flag === 0) {
        toast.error(postUser.data.msg);
      } else {
        resetForm();
        toast.success(postUser.data.msg);
        localStorage.setItem("UserInfo", JSON.stringify(postUser.data.data));
        setTimeout(() => {
          history.push("/");
        }, 2500);
      }
    } catch (error) {
      console.log("errror ----> ", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#8CB9BD", minHeight: "100vh" }}>
      <ToastContainer />
      <Formik
        initialValues={intialValue}
        validationSchema={UserValidation}
        onSubmit={handleUserSignupData}
      >
        <section className="p-3 p-md-4 p-xl-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-9">
                <div className="card border-light rounded-4">
                  <div className="card-body p-3 p-md-4 p-xl-5">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="mb-4">
                          <h3 className="h2">Registration Form</h3>
                        </div>
                      </div>
                    </div>
                    <Form>
                      <div className="row gy-3 gy-md-4">
                        <div className="col-12">
                          <label htmlFor="username" className="form-label">
                            Username
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            name="username"
                            id="username"
                            placeholder="Username"
                          />
                          <div className="text-danger">
                            <ErrorMessage name="username" />
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <label htmlFor="email" className="form-label">
                            Email
                          </label>
                          <Field
                            type="email"
                            className="form-control"
                            name="email"
                            id="email"
                            placeholder="name@example.com"
                          />
                          <div className="text-danger">
                            <ErrorMessage name="email" />
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <label htmlFor="mobileNumber" className="form-label">
                            Mobile Number
                          </label>
                          <Field
                            type="text"
                            className="form-control"
                            name="mobileNumber"
                            id="mobileNumber"
                            placeholder="0123456789"
                          />
                          <div className="text-danger">
                            <ErrorMessage name="mobileNumber" />
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <label htmlFor="password" className="form-label">
                            Password
                          </label>
                          <Field
                            type="password"
                            className="form-control"
                            name="password"
                            id="password"
                            placeholder="Password"
                          />
                          <div className="text-danger">
                            <ErrorMessage name="password" />
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <label
                            htmlFor="confirmPassword"
                            className="form-label"
                          >
                            Confirm Password
                          </label>
                          <Field
                            type="password"
                            className="form-control"
                            name="confirmPassword"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                          />
                          <div className="text-danger">
                            <ErrorMessage name="confirmPassword" />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-grid">
                            <button className="btn btn-primary" type="submit">
                              Sign up
                            </button>
                          </div>
                        </div>
                      </div>
                    </Form>
                    <div className="row">
                      <div className="col-12 mt-4">
                        <p className="m-0 text-secondary text-center">
                          Already have an account?{" "}
                          <a
                            href="/"
                            className="link-primary text-decoration-none"
                          >
                            Sign in
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Formik>
    </div>
  );
}
