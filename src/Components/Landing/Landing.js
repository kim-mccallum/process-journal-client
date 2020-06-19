import React from "react";
import { NavLink } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <form className="form-container">
      <p>
        Welcome to Life Logger. This custom journal application is designed to
        help you see the big picture and stop 'losing the forest for the trees'.
        Make daily logs of habits and metrics habits related to your individual
        goals and Life Logger will help you find insight into how your habits
        and activities affect your happiness, performance or... whatever you
        want to track!
      </p>
      <NavLink to={`/login`}>
        <button>Sign in</button>
      </NavLink>
      <NavLink to={`/login`}>
        <button>Sign in with demo account</button>
      </NavLink>
      <NavLink to={`/sign-up`}>
        <button>Create an account</button>
      </NavLink>
    </form>
  );
}
