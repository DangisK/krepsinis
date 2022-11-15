import "./navbar.css";
import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav>
      <div className="nav__center">
        <div className="nav__header">
          <Link to="/">
            <h1>Krepšinio entuziastai</h1>
          </Link>
        </div>
        <div className="nav__links">
          <ul className="links">
            <li>
              <Link to="/turnyrine-lentele">Turnyrinė lentelė</Link>
            </li>
            <li>
              <Link to="/tvarkarastis">Tvarkaraštis</Link>
            </li>
            <li>
              <Link to="/komandos-sudetis">Komandos sudėtis</Link>
            </li>
            <li>
              <Link to="/zaidejas">Žaidėjas</Link>
            </li>
            <li>
              <Link to="/db-lenteles">Secret!</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
