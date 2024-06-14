import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function User_login() {
  const [intialValue, setInitialValue] = useState({
    username: "",
    password: "",
    remember_me: "",
  });
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    console.log("login token =-->  ", token);
    if (token) {
      console.log("login token =-->  ", token);

      localStorage.setItem("UserToken", token);
      toast.success("Login successful!");
      setTimeout(() => {
        history.push("/contact");
      }, 2500);
    }
  }, [location, history]);

  const UserLoginValidation = Yup.object().shape({
    username: Yup.string().required("Username is Required !"),
    password: Yup.string().required("Password is Required !"),
  });

  const handleUserLoginData = async (values, { resetForm }) => {
    try {
      let postUser = await axios.post(
        "http://localhost:3000/user/login",
        values
      );

      if (postUser.data.flag === 0) {
        toast.error(postUser.data.msg);
      } else {
        localStorage.setItem("UserToken", postUser.data.data);
        resetForm();
        toast.success(postUser.data.msg);
        setTimeout(() => {
          history.push("/contact");
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
        validationSchema={UserLoginValidation}
        onSubmit={handleUserLoginData}
      >
        <section className="py-3 py-md-5 py-xl-7">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-4">
                <div className="card border border-light-subtle rounded-4">
                  <div className="card-body p-3 p-md-4 p-xl-5">
                    <div className="col-12 text-center pb-4">
                      <div className="d-grid">
                        <a
                          href="http://localhost:3000/auth/google"
                          className="btn bsb-btn-2xl btn-primary"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-google"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                          </svg>
                          <span className="ms-2 fs-6">Sign in with Google</span>
                        </a>
                      </div>
                    </div>

                    <Form>
                      <div className="row gy-3 overflow-hidden">
                        <div className="col-12">
                          <div className="form-floating mb-3">
                            <Field
                              className="form-control"
                              name="username"
                              id="username"
                              placeholder="Username"
                            />
                            <label htmlFor="username" className="form-label">
                              Username
                            </label>
                          </div>
                          <div className="text-danger">
                            <ErrorMessage name="username" />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating mb-3">
                            <Field
                              type="password"
                              className="form-control"
                              name="password"
                              id="password"
                              placeholder="Password"
                            />
                            <label htmlFor="password" className="form-label">
                              Password
                            </label>
                          </div>
                          <div className="text-danger">
                            <ErrorMessage name="password" />
                          </div>
                        </div>

                        <div className="col-12 d-flex justify-content-between">
                          <div className="form-check">
                            <Field
                              className="form-check-input"
                              type="checkbox"
                              name="remember_me"
                              id="remember_me"
                            />
                            <label
                              className="form-check-label text-secondary"
                              htmlFor="remember_me"
                            >
                              Remember me
                            </label>
                          </div>
                          <div className="">
                            <a
                              href="/user/forgotpassword"
                              className="link-secondary text-decoration-none"
                            >
                              Forgot password
                            </a>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="d-grid">
                            <button
                              className="btn btn-primary btn-lg"
                              type="submit"
                            >
                              Log in
                            </button>
                          </div>
                        </div>

                        <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-center mt-4 text-center">
                          <a
                            href="/signup"
                            className="link-secondary text-decoration-none"
                          >
                            Create new account
                          </a>
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
  );
}
