import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Login.css";

// class component with state and copy everything form SignUp and it'll be a different callback
export default class Login extends Component {
  state = {};
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
    // console.log(this.state);
  };
  submitHandler = (e) => {
    e.preventDefault();
    // figure out how to submit this later
    const { username, password } = this.state;
    this.props.login({
      username,
      password,
    });
  };
  render() {
    let errorMessage = this.props.error ? (
      <p className="validationError">Invalid username or password</p>
    ) : (
      ""
    );
    // console.log(errorMessage);
    return (
      <div className="form-container">
        <form onSubmit={this.submitHandler}>
          <p>
            Sign in to your account. If you just want to check out the app, feel
            free to sign in with the provided demo account to look around.
            Please don't change any variables in here yet.
          </p>
          <p className="demo-credentials">Demo username: demo</p>
          <p className="demo-credentials">Demo password: demopassword</p>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            required
            placeholder="user name"
            onChange={this.changeHandler}
          ></input>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            required
            placeholder="password"
            onChange={this.changeHandler}
          ></input>
          <button type="submit">Sign in</button>
        </form>
        {errorMessage}
        <NavLink to={`/sign-up`} className="link">
          Create an account
        </NavLink>
      </div>
    );
  }
}
