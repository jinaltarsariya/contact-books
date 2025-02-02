import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import axios from "axios";
import * as Yup from "yup";
import Navbar from "./Navbar";
import { useHistory, useLocation } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import "bootstrap/dist/css/bootstrap.min.css";

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

  const [currentPage, setCurrentPage] = useState(1);
  const contactsPerPage = 5; // Set the number of contacts per page

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
  }, [location]);

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

  console.log("contactData -> ", contactData);
  
  // Calculate current contacts to display
  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contactData?.slice(
    indexOfFirstContact,
    indexOfLastContact
  );

  // Pagination controls
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(contactData.length / contactsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          overflow: "hidden",
          position: "relative",
          marginTop: "30px",
          backgroundColor: "#EEEDEB",
        }}
        className="vh-100"
      >
        <div className="container mt-5 d-flex flex-column align-items-center">
          <div
            className="w-100 rounded p-4"
            style={{
              maxWidth: "400px",
              backgroundColor: "#80BCBD",
              backgroundPosition: "center",
            }}
          >
            {currentContacts && currentContacts.length > 0 ? (
              currentContacts.map((value, index) => {
                return (
                  <div
                    key={index}
                    className="d-flex justify-content-around align-items-center p-2 border border-light shadow my-4 bg-body rounded bg-white"
                  >
                    <div className="d-flex flex-column">
                      <h6>{value.name}</h6>
                      <h6>{value.mobileNumber}</h6>
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

        <Button
          variant="dark"
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

        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="dark"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="ms-2"
          >
            <FaAngleLeft />
          </Button>
          <Button
            variant="dark"
            onClick={handleNextPage}
            className="ms-2"
            disabled={
              currentPage === Math.ceil(contactData.length / contactsPerPage)
            }
          >
            <FaAngleRight />
          </Button>
        </div>
      </div>

      {/* add and update popup */}
      <Modal show={show} onHide={handleClose} centered>
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
                  <Button variant="dark" type="submit">
                    {updateContact ? "Update Contact" : "Save Contact"}
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      {/* delete popup */}
      <Modal show={showDeleteModal} onHide={handleDeleteClose} centered>
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
