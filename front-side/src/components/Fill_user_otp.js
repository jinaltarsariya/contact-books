import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Fill_user_otp() {
  const [intialValue, setInitialValue] = useState({
    otp: "",
  });
  const history = useHistory();

  const UserLoginValidation = Yup.object().shape({
    otp: Yup.string().required("Please fill out this field !"),
  });

  const handleUserLoginData = async (values, { resetForm }) => {
    try {
      let postUser = await axios.post(
        "http://localhost:3000/user/request",
        values
      );

      if (postUser.data.flag === 0) {
        toast.error(postUser.data.msg);
      } else {
        resetForm();
        toast.success(postUser.data.msg);
        const token = postUser.data.data.token; // Assuming the token is returned in the response
        setTimeout(() => {
          history.push(`/user/reset/password?token=${token}`);
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
                      <h3 className="pb-3">Verification required</h3>
                      <Form>
                        <div className="row gy-3 overflow-hidden">
                          <div className="col-12">
                            <div className="mb-3">
                              <label htmlFor="otp" className="form-label">
                                Enter Otp
                              </label>
                              <Field
                                className="form-control"
                                name="otp"
                                id="otp"
                                placeholder="OTP"
                              />
                            </div>
                            <div className="text-danger">
                              <ErrorMessage name="otp" />
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
