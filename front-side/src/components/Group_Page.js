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

export default function Group_Page() {
  const [groupData, setGroupData] = useState([]);
  const [updateGroup, setUpdateGroup] = useState(null);
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const [initialValues, setInitialValues] = useState({
    name: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const groupsPerPage = 5; // Set the number of contacts per page

  const handleClose = () => {
    setShow(false);
    setUpdateGroup(null); // Reset updateGroup state when closing modal
  };
  const handleShow = () => setShow(true);
  const handleDeleteClose = () => setShowDeleteModal(false);

  const handleDeleteShow = (contact) => {
    setGroupToDelete(contact);
    setShowDeleteModal(true);
  };

  const history = useHistory();
  const location = useLocation();

  const groupValidation = Yup.object().shape({
    name: Yup.string()
      .required("Group Name is required")
      .min(3, "Too Short!")
      .max(25, "Too Long!")
      .matches(
        /^[a-zA-Z]+(?: [a-zA-Z]+)*$/,
        "Group Name can only contain letters and single spaces between words"
      ),
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
        "http://localhost:3000/group/list",
        headerToken
      );
      setGroupData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlegroupData = async (values, { resetForm }) => {
    try {
      const headerToken = {
        headers: {
          token: localStorage.getItem("UserToken"),
        },
      };

      let response = await axios.post(
        "http://localhost:3000/group/create",
        values,
        headerToken
      );

      setGroupData([...groupData, response.data.data]);
      resetForm();
      fetchData();
      handleClose();
    } catch (error) {
      console.log("error ---> ", error.message);
    }
  };

  const handleGroupUpdate = async (values, { resetForm }) => {
    try {
      const headerToken = {
        headers: {
          token: localStorage.getItem("UserToken"),
        },
      };
      let response = await axios.put(
        `http://localhost:3000/group/update?groupId=${values._id}`,
        values,
        headerToken
      );

      setGroupData((groupData) =>
        groupData.map((value) =>
          value._id === values._id ? response.data : value
        )
      );

      if (response.data.flag === 0) {
        alert(response.data.msg);
      }
      setUpdateGroup(null);
      resetForm();
      fetchData();
      handleClose();
    } catch (error) {
      console.log("error ---> ", error);
    }
  };

  const handleGroupDelete = async () => {
    try {
      const headerToken = {
        headers: {
          token: localStorage.getItem("UserToken"),
        },
      };

      await axios.delete(
        `http://localhost:3000/group/delete?groupId=${groupToDelete._id}`,
        headerToken
      );
      fetchData();
      handleDeleteClose();
    } catch (error) {
      console.log("Error deleting user:", error.message);
    }
  };

  // Calculate current contacts to display
  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroup = groupData?.slice(indexOfFirstGroup, indexOfLastGroup);

  // Pagination controls
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < Math.ceil(groupData?.length / groupsPerPage)) {
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
            {currentGroup && currentGroup.length > 0 ? (
              currentGroup.map((value, index) => {
                return (
                  <div
                    key={index}
                    className="d-flex justify-content-around align-items-center p-2 border border-light shadow my-4 bg-body rounded bg-white"
                  >
                    <h6 className="m-0">{value.name}</h6>
                    <div className="text-end">
                      <button
                        type="button"
                        className="btn btn-dark m-1 btn-sm"
                        onClick={() => {
                          setUpdateGroup(value);
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
              currentPage === Math.ceil(groupData.length / groupsPerPage)
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
            {updateGroup ? "Update Group" : "Add Group"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={updateGroup ? updateGroup : initialValues}
            onSubmit={updateGroup ? handleGroupUpdate : handlegroupData}
            validationSchema={groupValidation}
            enableReinitialize={true}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Group Name
                  </label>
                  <Field
                    id="name"
                    name="name"
                    placeholder="Group Name"
                    className="form-control"
                  />
                  <div className="text-danger">
                    <ErrorMessage name="name" />
                  </div>
                </div>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="dark" type="submit">
                    {updateGroup ? "Update Group" : "Save Group"}
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
          <Modal.Title>Delete Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this Group?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleGroupDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
