import React from "react";
import { NavLink } from "react-router-dom";
import "./Landing.css";

export default function Landing() {
  return (
    <form className="form-container">
      <h1>Focus on the Process!</h1>
      <p>
        Goals are good for planning progress but an effective system of habits
        creates progress. Use this app to set up goals, measure progress and
        track habits that support your success.
      </p>
      <NavLink to={`/login`}>
        <button>Sign in</button>
      </NavLink>
      <NavLink to={`/sign-up`}>
        <button>Create an account</button>
      </NavLink>
    </form>
  );
}
