import React, { Component } from "react";
import config from "../../config";
import JournalMetrics from "../JournalMetrics/JournalMetrics";
import { NavLink } from "react-router-dom";
import "./JournalSetup.css";

export default class JournalSetup extends Component {
  state = {
    goal: "",
    process_variable: "",
    habit: "",
    selectedLabel: "",
  };
  // Make a fetch to all 3 endpoints to get: goal, variable, habit to put in state
  componentDidMount() {
    // specify URL's
    const goalURL = `${config.API_ENDPOINT}/goal/current`;
    const variableURL = `${config.API_ENDPOINT}/process_variable/current`;
    const habitURL = `${config.API_ENDPOINT}/habit/current`;

    const headerObject = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    // make fetch with Promise.all -
    Promise.all([
      fetch(goalURL, headerObject),
      fetch(variableURL, headerObject),
      fetch(habitURL, headerObject),
    ])
      .then(([goalRes, varRes, habitRes]) => {
        if (!goalRes.ok) {
          return goalRes.json().then((e) => Promise.reject(e));
        }
        if (!varRes.ok) {
          return varRes.json().then((e) => Promise.reject(e));
        }
        if (!habitRes.ok) {
          return habitRes.json().then((e) => Promise.reject(e));
        }
        return Promise.all([goalRes.json(), varRes.json(), habitRes.json()]);
      })
      // put the current values in state
      .then(([goalRes, variableRes, habitRes]) => {
        this.setState({
          goal: goalRes[0].goal,
          process_variable: variableRes[0].process_variable,
          habit: habitRes[0].habit,
        });
      })
      // catch and log errors
      .catch((err) => {
        console.log(`Something went wrong. Here is the error: ${err}`);
      });
  }
  // pass this down to reset the value in state
  changeHandler = (event) => {
    console.log(event.target.name);
    // change the appropriate state value to empty and store the selected
    this.setState({
      [event.target.name]: "",
      selectedLabel: event.target.name,
    });
  };
  // grab the new input values and store them temporarily
  changeInputHandler = (event) => {
    console.log(event.target.name);

    this.setState({
      selectedLabel: event.target.name,
      [`${event.target.name}_input`]: event.target.value,
    });
  };
  // handle submit to make fetch - This function should get the value and pass it to fetch/update
  handleSubmit = (event, value) => {
    // Set up the endpoint for the selected variable to change
    const URL = `${config.API_ENDPOINT}/${this.state.selectedLabel}`;
    // create the body object using dynamic key/value
    const body = {
      // CONVERT THIS TO UTC USING MOMENT - DON'T FORGET!
      date: new Date(),
      [this.state.selectedLabel]: this.state[
        `${this.state.selectedLabel}_input`
      ],
    };
    console.log("request body: ", body);
    // Make a POST request to update this journal metric
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    }).then((res) => {
      this.setState({
        [this.state.selectedLabel]: this.state[
          `${this.state.selectedLabel}_input`
        ],
      });
    });
  };
  render() {
    return (
      <div className="setup-container">
        <h2>Your Journal</h2>
        <p className="journal-setup-instructions">
          The goal of this app is to help you identify and track the process or
          lifestyle factors that relate to your goal. To set up your process
          journal, identify a goal, specify a measurable target variable related
          to that goal and one or two key habits that support that goal. By
          regularly tracking your target variable and your habits, you can stay
          on track and develop self awareness.
        </p>
        {/* HOW DO I SELECT THIS SO THAT IT IS A FORM CONTAINER WITH A FEW MODIFICATIONS */}
        <div className="setup-item-container">
          <div className="journal-setup-items">
            <JournalMetrics
              goal={this.state.goal}
              process_variable={this.state.process_variable}
              habit={this.state.habit}
              changeHandler={this.changeHandler}
              handleSubmit={this.handleSubmit}
              changeInputHandler={this.changeInputHandler}
              selectedLabel={this.state.selectedLabel}
            />
          </div>
          <div className="button-container">
            <ul>
              {/* <li className="nav-button glow-button">
                <NavLink to={`/dashboard`} className="Nav-button">
                  Go to my Dashboard
                </NavLink>
              </li> */}
              <li className="nav-button glow-button">
                <NavLink to={`/journal-entry`} className="Nav-button">
                  Make a Journal Entry
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
