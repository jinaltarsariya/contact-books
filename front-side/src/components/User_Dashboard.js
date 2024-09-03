import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function User_Dashboard() {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const user = JSON?.parse(localStorage?.getItem("UserInfo"));
    setUserInfo(user);
  }, []);

  return (
    <>
      <Navbar />
      <div
        className="d-flex flex-column flex-md-row vh-100 overflow-hidden mt-5"
        style={{ backgroundColor: "#EEEDEB" }}
      >
        <div className="container d-flex justify-content-center align-items-center flex-grow-1 p-4">
          {userInfo ? (
            <div
              className="card text-center border-dark w-100"
              style={{ maxWidth: "500px" }}
            >
              <div className="card-body">
                <img
                  src={
                    "https://cdn-icons-png.freepik.com/256/64/64572.png?semt=ais_hybrid" ||
                    "default-image-url.jpg"
                  }
                  alt={`${userInfo.username}'s profile`}
                  className="rounded-circle mb-4"
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
                <h2 className="card-title">Welcome, {userInfo.username}!</h2>
                <p className="card-text m-2">
                  <strong>Email:</strong> {userInfo.email}
                </p>
                <p className="card-text">
                  <strong>Mobile Number:</strong> {userInfo.mobileNumber}
                </p>
              </div>
            </div>
          ) : (
            <p>Loading user information...</p>
          )}
        </div>
      </div>
    </>
  );
}
