import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Reset_password() {
  const [intialValue, setInitialValue] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const UserLoginValidation = Yup.object().shape({
    newPassword: Yup.string()
      .min(5, "New password must be at least 5 characters long")
      .max(15, "Password too long")
      .required("Enter a password!"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm your password!"),
  });

  const handleUserLoginData = async (values, { resetForm }) => {
    try {
      const postUser = await axios.post(
        `http://localhost:3000/user/reset/password?token=${token}`,
        values,
        { headers: { "Content-Type": "application/json" } }
      );

      if (postUser.data.flag === 0) {
        toast.error(postUser.data.msg);
      } else {
        resetForm();
        toast.success(postUser.data.msg);
        setTimeout(() => {
          history.push("/");
        }, 2000);
      }
    } catch (error) {
      console.log("errror ----> ", error.message);
    }
  };
  return (
    <>
      <div style={{ backgroundColor: "#8CB9BD", minHeight: "100vh" }}>
        <ToastContainer />
        <Formik
          initialValues={intialValue}
          validationSchema={UserLoginValidation}
          onSubmit={handleUserLoginData}
        >
          <section className="py-3 py-md-5 py-xl-7">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                  <div className="card border border-light-subtle rounded-4">
                    <div className="card-body p-3 p-md-4 p-xl-5">
                      <h3 className="pb-3">Create New password</h3>
                      <Form>
                        <div className="row gy-3 overflow-hidden">
                          <div className="col-12">
                            <div className="mb-3">
                              <label
                                htmlFor="newPassword"
                                className="form-label"
                              >
                                New Password
                              </label>
                              <Field
                                type="password"
                                className="form-control"
                                name="newPassword"
                                id="newPassword"
                                placeholder="New Password"
                              />
                            </div>
                            <div className="text-danger">
                              <ErrorMessage name="newPassword" />
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="mb-3">
                              <label
                                htmlFor="confirmPassword"
                                className="form-label"
                              >
                                Password Again
                              </label>
                              <Field
                                type="password"
                                className="form-control"
                                name="confirmPassword"
                                id="confirmPassword"
                                placeholder="Confirm Password"
                              />
                            </div>
                            <div className="text-danger">
                              <ErrorMessage name="confirmPassword" />
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="d-grid">
                              <button
                                className="btn btn-primary btn-sm"
                                type="submit"
                              >
                                Save changes and sign in
                              </button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Formik>
      </div>
    </>
  );
}
