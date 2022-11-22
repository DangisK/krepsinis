import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

export const Footer = () => {
  return (
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
  );
};
