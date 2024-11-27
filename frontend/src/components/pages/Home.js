import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

function Home({ setIsAuthenticated }) {
  const [userData, setUserData] = useState({});
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const parseJwt = (token) => {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const getToken = () => {
    return sessionStorage.getItem("token");
  };

  useEffect(() => {
    const token = getToken();
    const payloadData = parseJwt(token);
    setUserData(payloadData);
  }, []);

  const fetchUser  = async () => {
    setError("");
    try {
      const url = `${BASE_URL}/users`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`, // Correctly pass the token here
        },
      });

      if (!response.ok) {
        const errorMessage =
          (await response.json()).message || "User  Fetch Error";
        setError(errorMessage);
        return;
      }

      const responseData = await response.json();
      console.log(responseData);
      setUsers(responseData.users);
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options); // Format the date as MM/DD/YYYY
  };

  return (
    <div className="Home">
      <h1>Dashboard</h1>
      <div className="dashboard">
        <div>Welcome! {userData.email}</div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="users-btn">
        <button onClick={() => fetchUser ()}>Get Users</button>
        <button onClick={() => setUsers([])}>Clear Data</button>
      </div>
      {users.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Date of Birth</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{formatDate(user.dob)}</td> {/* Format the DOB */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Home;