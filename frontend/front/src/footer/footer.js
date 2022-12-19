import { UserContext } from "../context/user-context";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./footer.css";

export const Footer = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      {user.token !== "" && (
        <footer className="footer footer__links">
          <ul className="links">
            <li>
              <Link to="/">Apie projektą</Link>
            </li>
            <li>
              <Link to="/">Kontaktai</Link>
            </li>
          </ul>
        </footer>
      )}
    </>
  );
};
