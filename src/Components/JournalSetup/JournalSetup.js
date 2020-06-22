import React, { Component } from "react";
import config from "../../config";
import JournalMetric from "../JournalMetric/JournalMetric";
import "./JournalSetup.css";

export default class JournalSetup extends Component {
  state = {
    goal: "",
    processVariable: "",
    habit: "",
  };
  // Make a fetch to all 3 endpoints to get: goal, variable, habit to put in state
  componentDidMount() {
    // specify URL's
    const goalURL = `${config.API_ENDPOINT}/goals/current`;
    const variableURL = `${config.API_ENDPOINT}/process-variables/current`;
    const habitURL = `${config.API_ENDPOINT}/habits/current`;

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
      // put the values in state - CAN'T SEEM TO GET THIS DONE FOR AN OBJECT
      .then(([goalRes, variableRes, habitRes]) => {
        this.setState({
          goal: goalRes[0].goal,
          processVariable: variableRes[0].process_variable,
          habit: habitRes[0].habit,
        });
      })
      // catch and log errors
      .catch((err) => {
        console.log(`Something went wrong. Here is the error: ${err}`);
      });
  }
  // THIS IS A MESS IN HERE - SORT OUT THE LOGIC/FUCNTIONALITY
  // pass this down to - this function has one job, change goal to empty
  changeGoalHandler = (value) => {
    console.log("HELLO");
    this.setState({ goal: "" });
  };
  // handle submit to make fetch - This function should get the value and pass it to fetch/update FIX THIS HERE!
  handleSubmit = (event, value) => {
    event.preventDefault();
    console.log(event.target.id);
    // Make a POST request to update this goal - DO THIS LATER
  };
  render() {
    console.log(this.state);
    return (
      <div className="journal-setup-container">
        <h2>Your Journal</h2>
        <p className="journal-setup-instructions">
          The goal of this app is to help you identify and track the process or
          lifestyle factors that relate to your goal. To set up your process
          journal, identify a goal, specify a measurable target variable related
          to that goal and one or two key habits that support that goal. By
          regularly tracking your target variable and your habits, you can stay
          on track and develop self awareness.
        </p>
        {/* Render the JournalMetricComponent - it should encapsulate all 3 */}
        <JournalMetric
          goal={this.state.goal}
          processVariable={this.state.processVariable}
          habit={this.state.habit}
          changeHandler={this.changeGoalHandler}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}
