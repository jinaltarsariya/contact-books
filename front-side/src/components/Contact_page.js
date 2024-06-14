import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import Navbar from "./Navbar";
import { useHistory, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function Contact_page() {
  const [contactData, setContactData] = useState([]);
  const [updateContact, setUpdateContact] = useState(null);
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const [initialValues, setInitialValues] = useState({
    name: "",
    mobileNumber: "",
  });

  const handleClose = () => {
    setShow(false);
    setUpdateContact(null); // Reset updateContact state when closing modal
  };
  const handleShow = () => setShow(true);
  const handleDeleteClose = () => setShowDeleteModal(false);
  const handleDeleteShow = (contact) => {
    setContactToDelete(contact);
    setShowDeleteModal(true);
  };

  const history = useHistory();
  const location = useLocation();

  const ContactValidation = Yup.object().shape({
    name: Yup.string()
      .required("Contact Name is required")
      .min(2, "Too Short!")
      .max(30, "Too Long!"),
    mobileNumber: Yup.string()
      .matches(/^[0-9]{6,10}$/, "Mobile Number must be 6 to 10 digits")
      .required("Mobile Number is required"),
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");

    let getToken = localStorage.getItem("UserToken");
    if (!getToken) {
      // history.push("/");
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const headerToken = {
        headers: {
          token: localStorage.getItem("UserToken"),
        },
      };
      const response = await axios.get(
        "http://localhost:3000/contact",
        headerToken
      );
      setContactData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleContactData = async (values, { resetForm }) => {
    try {
      const headerToken = {
        headers: {
          token: localStorage.getItem("UserToken"),
        },
      };

      let response = await axios.post(
        "http://localhost:3000/contact/create",
        values,
        headerToken
      );

      setContactData([...contactData, response.data.data]);
      resetForm();
      fetchData();
      handleClose();
    } catch (error) {
      console.log("error ---> ", error.message);
    }
  };

  const handleContactUpdate = async (values, { resetForm }) => {
    try {
      const headerToken = {
        headers: {
          token: localStorage.getItem("UserToken"),
        },
      };
      let response = await axios.put(
        `http://localhost:3000/contact/update?contactId=${values._id}`,
        values,
        headerToken
      );

      setContactData((contactData) =>
        contactData.map((value) =>
          value._id === values._id ? response.data : value
        )
      );

      if (response.data.flag === 0) {
        alert(response.data.msg);
      }
      setUpdateContact(null);
      resetForm();
      fetchData();
      handleClose();
    } catch (error) {
      console.log("error ---> ", error);
    }
  };

  const handleContactDelete = async () => {
    try {
      const headerToken = {
        headers: {
          token: localStorage.getItem("UserToken"),
        },
      };

      await axios.delete(
        `http://localhost:3000/contact/delete?contactId=${contactToDelete._id}`,
        headerToken
      );
      fetchData();
      handleDeleteClose();
    } catch (error) {
      console.log("Error deleting user:", error.message);
    }
  };

  return (
    <>
      <Navbar />
      {/* <div style={{ minHeight: "100vh", position: "relative" }}>
        <div className="container py-5 d-flex flex-column align-items-center">
          <div
            className="border border-3 p-4 mt-5 mb-3 w-100 rounded"
            style={{
              maxWidth: "400px",

              backgroundImage:
                'url("https://img.freepik.com/premium-photo/bookrelated-icons-arranged-seamless-pattern-generative-ai_883586-213688.jpg")',
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h3 className="text-center text-decoration-underline mb-3 text-light">
              Contact List
            </h3>
            <div className="rounded">
              <table
                className="text-light"
                style={{
                  backdropFilter: "blur(2px) saturate(69%)",
                  backgroundColor: "rgba(96, 56, 56, 0.48)",
                  borderRadius: "12px",
                  border: "1px solid rgba(209, 213, 219, 0.3)",
                }}
              >
                <tbody>
                  {contactData && contactData.length > 0 ? (
                    contactData.map((value, index) => {
                      return (
                        <tr key={value._id}>
                          <td className="w-100">
                            <div className="d-flex flex-column">
                              <div>{value.name}</div>
                              <div>{value.mobileNumber}</div>
                            </div>
                          </td>
                          <td className="text-end">
                            <button
                              type="button"
                              className="btn btn-dark m-1 btn-sm"
                              onClick={() => {
                                setUpdateContact(value);
                                handleShow();
                              }}
                            >
                              Update
                            </button>
                            <button
                              type="button"
                              className="btn btn-dark m-1 btn-sm"
                              onClick={() => handleDeleteShow(value)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr className="text-center">
                      <td colSpan="3">
                        <h3 className="py-3">No Contact available</h3>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleShow}
          className="btn btn-dark"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          Create New Contact
        </Button>
      </div> */}

      <div
        style={{ minHeight: "100vh", position: "relative", marginTop: "50px" }}
      >
        <div className="container py-5 d-flex flex-column align-items-center">
          <div
            className="mb-3 w-100 rounded p-5"
            style={{
              maxWidth: "400px",
              backgroundImage:
                'url("https://img.freepik.com/premium-photo/bookrelated-icons-arranged-seamless-pattern-generative-ai_883586-213688.jpg")',
              backgroundPosition: "center",
            }}
          >
            <div
              className="rounded"
              style={{
                backdropFilter: "blur(2px) saturate(69%)",
                backgroundColor: "rgba(96, 56, 56, 0.48)",
                borderRadius: "12px",
                border: "1px solid rgba(209, 213, 219, 0.3)",
              }}
            >
              {contactData && contactData.length > 0 ? (
                contactData.map((value, index) => {
                  return (
                    <div
                      key={value._id}
                      className="d-flex justify-content-between align-items-center p-2"
                      style={{
                        borderBottom:
                          index !== contactData.length - 1
                            ? "1px solid rgba(209, 213, 219, 0.3)"
                            : "none",
                      }}
                    >
                      <div className="d-flex flex-column text-light">
                        <div>{value.name}</div>
                        <div>{value.mobileNumber}</div>
                      </div>
                      <div className="text-end">
                        <button
                          type="button"
                          className="btn btn-dark m-1 btn-sm"
                          onClick={() => {
                            setUpdateContact(value);
                            handleShow();
                          }}
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          className="btn btn-dark m-1 btn-sm"
                          onClick={() => handleDeleteShow(value)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-3 text-light">
                  <h3>No Contact available</h3>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={handleShow}
          className="btn btn-dark"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
        >
          Create New Contact
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {updateContact ? "Update Contact" : "Add Contact"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={updateContact ? updateContact : initialValues}
            onSubmit={updateContact ? handleContactUpdate : handleContactData}
            validationSchema={ContactValidation}
            enableReinitialize={true}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Contact Name
                  </label>
                  <Field
                    id="name"
                    name="name"
                    placeholder="Contact Name"
                    className="form-control"
                  />
                  <div className="text-danger">
                    <ErrorMessage name="name" />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="mobileNumber" className="form-label">
                    Mobile Number
                  </label>
                  <Field
                    id="mobileNumber"
                    name="mobileNumber"
                    placeholder="1234567890"
                    className="form-control"
                  />
                  <div className="text-danger">
                    <ErrorMessage name="mobileNumber" />
                  </div>
                </div>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" type="submit">
                    {updateContact ? "Update Contact" : "Save Contact"}
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleDeleteClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this contact?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleContactDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
