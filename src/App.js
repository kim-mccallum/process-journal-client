import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import Banner from "./Components/Banner/Banner";
import Landing from "./Components/Landing/Landing";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import JournalSetup from "./Components/JournalSetup/JournalSetup";
import JournalEntryForm from "./Components/JournalEntryForm/JournalEntryForm";
import config from "./config";
import "./App.css";

export default class App extends Component {
  // just authentication here
  state = {
    isAuth: false,
    error: false,
    authLoading: false,
    username: "",
  };
  // SIGN UP FUNCTION - TO BE PASSED TO THE SIGNUP COMPONENT - THIS IS THE FETCH TO THE SIGNUP ENDPOINT
  signup = (formData) => {
    // Just get the data for the fetch
    console.log(JSON.stringify(formData));
    // fetch("http://localhost:8000/api/users", {
    fetch(`${config.API_ENDPOINT}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 400) {
          throw new Error(response.error);
        }
        return response.json();
      })
      .then((user) => {
        // probably redirect to login or dashboard with the token
        // once the user signs up, log them in
        console.log("okay, we made a user! Now we log them in");
        this.login(formData);
      })
      .catch((err) => {
        // have a JSX <p> to render this error
        this.setState({ error: err });
      });
  };

  login = (formData) => {
    fetch(`${config.API_ENDPOINT}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.status === 400) {
          throw new Error(response.error);
        }
        return response.json();
      })
      .then((user) => {
        // probably redirect to login or dashboard with the token
        // set in local storage
        window.localStorage.setItem("token", user.authToken);
        // update
        this.setState({ isAuth: true, username: user.username });
        console.log(user.username, "is logged in!");
      })
      .catch((err) => {
        // have a JSX <p> to render this error
        this.setState({ error: err });
      });
  };
  logout = () => {
    this.setState({ isAuth: false });
    window.localStorage.removeItem("token");
  };

  render() {
    let routes;
    routes = (
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route
          exact
          path="/login"
          render={() => <Login login={this.login} />}
        />
        <Route
          exact
          path="/sign-up"
          render={(routeProps) => (
            <SignUp signup={this.signup} {...routeProps} />
          )}
        />
      </Switch>
    );
    if (this.state.isAuth) {
      routes = (
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/journal-setup" component={JournalSetup} />
          <Route exact path="/journal-entry" component={JournalEntryForm} />
          <Route
            exact
            path="/dashboard"
            component={(routeProps) => (
              <Dashboard
                routeProps={routeProps}
                username={this.state.username}
              />
            )}
          />
        </Switch>
      );
    }
    return (
      <div className="App">
        {/* PASS ISAUTH FOR CONDITIONAL RENDERING */}
        <Banner isAuth={this.state.isAuth} logout={this.logout} />
        {routes}
      </div>
    );
  }
}
