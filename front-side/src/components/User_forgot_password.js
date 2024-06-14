import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function User_forgot_password() {
  const [intialValue, setInitialValue] = useState({
    email: "",
  });
  const history = useHistory();

  const UserLoginValidation = Yup.object().shape({
    email: Yup.string().required("Email is Required !"),
  });

  const handleUserLoginData = async (values, { resetForm }) => {
    try {
      let postUser = await axios.post(
        "http://localhost:3000/user/forgotpassword",
        values
      );

      if (postUser.data.flag === 0) {
        toast.error(postUser.data.msg);
      } else {
        resetForm();
        toast.success(postUser.data.msg);
        setTimeout(() => {
          history.push("/user/request");
        }, 2000);
      }
    } catch (error) {
      console.log("errror ----> ", error);
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
                      <h3 className="pb-3">Forgot password</h3>
                      <Form>
                        <div className="row gy-3 overflow-hidden">
                          <div className="col-12">
                            <div className="mb-3">
                              <label htmlFor="email" className="form-label">
                                Email
                              </label>
                              <Field
                                className="form-control"
                                name="email"
                                id="email"
                                placeholder="name@example.com"
                              />
                            </div>
                            <div className="text-danger">
                              <ErrorMessage name="email" />
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="d-grid">
                              <button
                                className="btn btn-primary btn-sm"
                                type="submit"
                              >
                                Continue
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
