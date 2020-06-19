import React from "react";
import { NavLink } from "react-router-dom";
import "./SideNav.css";

export default function SideNav(props) {
  const activeStyle = {
    fontWeight: "bold",
    color: "red",
  };
  return (
    <nav className="app-nav" id={props.toggleMenu ? "active" : null}>
      <ul>
        <li>
          <NavLink
            to={`/dashboard`}
            className="Nav_link"
            activeClassName="activeRoute"
            activeStyle={{ color: "teal" }}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to={`/journal-entry`}
            className="Nav_link"
            activeClassName="activeRoute"
            activeStyle={{ color: "teal" }}
          >
            Make an entry
          </NavLink>
        </li>

        <li>
          <NavLink
            to={`/journal-setup`}
            className="Nav_link"
            activeClassName="activeRoute"
            activeStyle={{ color: "teal" }}
          >
            Edit journal
          </NavLink>
        </li>

        <li>
          <NavLink
            exact
            to={`/`}
            onClick={props.logout}
            className="Nav_link"
            activeClassName="activeRoute"
            activeStyle={{ color: "teal" }}
          >
            Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
