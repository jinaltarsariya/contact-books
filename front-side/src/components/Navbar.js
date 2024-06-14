import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { useHistory, useLocation, Link } from "react-router-dom";

export default function Navbar() {
  const history = useHistory();
  const location = useLocation();

  const handleLogOutBtn = () => {
    try {
      localStorage.removeItem("UserToken");
      history.push("/");
    } catch (error) {
      console.log("error during logout", error.message);
    }
  };

  return (
    <div>
      <ToastContainer />
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div class="container-fluid">
          <Link class="navbar-brand" to="#">
            Dashboard
          </Link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <Link class="nav-link active" aria-current="page" to="#">
                  Group
                </Link>
              </li>
              <li class="nav-item">
                <Link class="nav-link" to="/contact">
                  Contact
                </Link>
              </li>
            </ul>
            <div class="d-flex">
              <button
                class="btn btn-light"
                type="submit"
                onClick={() => handleLogOutBtn()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
