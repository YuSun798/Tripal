import React from "react";
import useToken from "../../App/useToken";
import "./RegisterLogin.css";
export default function RegisterLogin() {
  const token = useToken();
  const username = token[0]?.username;

  return username ? (
    <>
      <div className="fav">
      <li>
        <a href="/Favorites" title="Favorites">
          Favorites
        </a>
      </li>
      </div>
      <div className="status">
      <p>Welcome! {username}</p>
      </div>
    </>
  ) : (
    <li>
      <a href="/login" className="btn" title="Register / Log In">
        Register/Log In
      </a>
    </li>
  );
}
