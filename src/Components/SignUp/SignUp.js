import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export default class SignUp extends Component {
  state = {
    password: "",
    confirmPW: "",
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitHandler = (e) => {
    e.preventDefault();
    // Before submitting, should I make sure that they match
    if (!(this.state.password === this.state.confirmPW)) {
      alert(`The passwords do not match. Try again.`);
      return;
    }
    // callback prop to make the fetch - This will send the state to the backend to create a token and pass it work
    const { username, password, email } = this.state;
    this.props.signup({
      username,
      password,
      email,
    });
  };
  render() {
    // Compare passwords in state
    let passwordMatch = this.state.password === this.state.confirmPW;

    let errorMessage = this.props.error ? (
      <p className="validationError">{`${this.props.error}`}</p>
    ) : (
      ""
    );

    return (
      <div className="form-container">
        {/* text instructions and a go back button */}
        <p>Use the form below to create a new account.</p>
        <form onSubmit={this.submitHandler}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            required
            placeholder="user name"
            onChange={this.changeHandler}
          ></input>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="email address"
            onChange={this.changeHandler}
          ></input>
          <label htmlFor="password">Password (minimum 6 characters)</label>
          <input
            type="password"
            name="password"
            required
            placeholder="password"
            onChange={this.changeHandler}
          ></input>
          <label htmlFor="confirmPW"></label>
          <input
            type="password"
            name="confirmPW"
            required
            placeholder="re-enter password"
            onChange={this.changeHandler}
          ></input>
          {/* render message here */}
          {!passwordMatch && (
            <p className="validationError">Passwords don't match</p>
          )}
          {errorMessage}
          <button type="submit">Sign up</button>
        </form>
        <NavLink to={`/login`} className="link">
          I already have an account
        </NavLink>
      </div>
    );
  }
}
