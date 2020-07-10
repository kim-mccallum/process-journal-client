import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Dashboard from "./Components/Dashboard/Dashboard";
import Banner from "./Components/Banner/Banner";
import Landing from "./Components/Landing/Landing";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";
import JournalSetup from "./Components/JournalSetup/JournalSetup";
import JournalEntryForm from "./Components/JournalEntryForm/JournalEntryForm";
import config from "./config";
import "./App.css";

class App extends Component {
  // just authentication here
  state = {
    isAuth: false,
    error: false,
    authLoading: false,
    username: "",
  };
  // Need to fix this because currently the token expires
  componentDidMount() {
    const token = window.sessionStorage.getItem("token");
    // add check to ensure it is not expired
    if (!token) {
      return;
    }
    // if the token exists, they have logged in successfully
    this.setState({
      isAuth: true,
    });
  }
  // Sign up function - POST requests to the signup endpoing
  signup = (formData) => {
    // Get the data for the fetch from the signup form
    fetch(`${config.API_ENDPOINT}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((e) => {
            console.log(e.error);
            throw new Error(e.error);
          });
        }
        return response.json();
      })
      .then((user) => {
        // once the user signs up, log them in
        this.login(formData);
      })
      .catch((err) => {
        // have a JSX <p> to render this error
        this.setState({
          error: err,
        });
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
        // add this to any endpoint -
        // if (response.status === 401) {
        //   console.log("Logging out");
        //   window.sessionStorage.removeItem("token");
        //   window.sessionStorage.removeItem("username");
        //   this.props.history.push("/login");
        // }
        return response.json();
      })
      .then((user) => {
        // get the expiration from the payload - set a timer and remove it just before it expires
        // create the expiration here in login
        // in ComponentDidMount see if there is a token and see if it is expired before setting isAuth: true
        // console.log(user);
        window.sessionStorage.setItem("token", user.authToken);
        window.sessionStorage.setItem("username", user.username);
        // update state
        this.setState({ isAuth: true });
        console.log(user.username, "is logged in!");
        // after login redirect to to journal
        this.props.history.push("/journal-setup");
      })
      .catch((err) => {
        // have a JSX <p> to render this error
        this.setState({ error: err });
      });
  };
  logout = () => {
    this.setState({ isAuth: false });
    window.sessionStorage.removeItem("token");
    window.sessionStorage.removeItem("username");
  };

  render() {
    let routes;
    routes = (
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route
          exact
          path="/login"
          render={() => <Login error={this.state.error} login={this.login} />}
        />
        <Route
          exact
          path="/sign-up"
          render={(routeProps) => (
            <SignUp
              signup={this.signup}
              error={this.state.error}
              {...routeProps}
            />
          )}
        />
      </Switch>
    );
    // if you are already logged in, login is not rendered!
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
                // username={this.state.username}
              />
            )}
          />
        </Switch>
      );
    }
    return (
      <div className="App">
        <Banner isAuth={this.state.isAuth} logout={this.logout} />
        <div className="form-wrapper">{routes}</div>
      </div>
    );
  }
}

// use the withRouter to get access to history prop later
export default withRouter(App);
