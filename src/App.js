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
    // set this back to false
    isAuth: false,
    error: false,
    authLoading: false,
    username: "",
  };
  // Need to fix this because currently the token expires
  // HOW WOULD I MAKE THIS EXPIRE TOO?
  componentDidMount() {
    const token = window.localStorage.getItem("token");
    if (!token) {
      return;
    }
    // if the token exists, they have logged in successfully
    this.setState({
      isAuth: false,
    });
  }
  // Sign up function - POST requests to the signup endpoing
  signup = (formData) => {
    // Get the data for the fetch from the signup form
    // console.log(JSON.stringify(formData));
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
        console.log("okay, we made a user! Now we log them in");
        // once the user signs up, log them in
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
        // set in local storage
        window.localStorage.setItem("token", user.authToken);
        // update state
        this.setState({ isAuth: true, username: user.username });
        console.log(user.username, "is logged in!");
        // after login redirect to to journal
        this.props.history.push("/journal-setup");
        // CHANGE THIS BACK TO JOURNAL-SETUP LATER
        // this.props.history.push("/dashboard");
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
    // console.log(this.state.isAuth);
    let routes;
    routes = (
      <Switch>
        <Route exact path="/" component={Landing} />
        {/* <Route
          exact
          path="/login"
          render={() => <Login login={this.login} />}
        /> */}
        <Route
          exact
          path="/login"
          render={() => <Login error={this.state.error} login={this.login} />}
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
        <Banner isAuth={this.state.isAuth} logout={this.logout} />
        <div className="form-wrapper">{routes}</div>
      </div>
    );
  }
}

// use the withRouter to get access to history prop later
export default withRouter(App);
