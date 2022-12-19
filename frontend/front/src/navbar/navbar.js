import "./navbar.css";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";

export const Navbar = ({ onLogout }) => {
  const { user } = useContext(UserContext);
  const navigateTo = useNavigate();

  return (
    <>
      {user.token !== "" && (
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
                  <Link to="/komandos">Komandos</Link>
                </li>
                <li>
                  <Link to="/turnyrai">Turnyrai</Link>
                </li>
                {user.roles.find((role) => role === "Admin") && (
                  <li>
                    <Link to="/db-lenteles">Secret!</Link>
                  </li>
                )}
                <li>
                  <Link to="/turnyrine-lentele">Turnyrinė lentelė</Link>
                </li>
                <li>
                  <Link to="/tvarkarastis">Tvarkaraštis</Link>
                </li>
                <li>
                  <a onClick={onLogout}>Atsijungti</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};
