import React, { Component } from "react";
import config from "../../config";
import DatePicker from "react-datepicker";
import { NavLink } from "react-router-dom";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

export default class JournalEntryForm extends Component {
  debugger;
  state = {
    // convert this to universal time!
    date: new Date(),
    goal: "",
    process_variable: "",
    habit: "",
    variable_value: "",
    habit_value: "1",
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
      // put the values in state - CAN'T SEEM TO GET THIS DONE FOR AN OBJECT
      .then(([goalRes, variableRes, habitRes]) => {
        this.setState({
          goal: goalRes[0].goal,
          process_variable: variableRes[0].process_variable,
          habit: habitRes[0].habit,
        });
      })
      // catch and log errors
      .catch((err) => {
        // have some JSX to render error info
        console.log(`Something went wrong. Here is the error: ${err}`);
      });
  }
  // This doesn't seem to be putting the new values from the form into state
  changeHandler = (e) => {
    // not getting the values from the form
    console.log(e);
    this.setState({ [e.target.name]: e.target.value });
  };
  dateHandler = (selectedDate) => {
    // make sure this is UTC (aka universal time c?)
    this.setState({
      date: selectedDate,
    });
  };
  // Makes two fetches to Entries - One habit and the other process variable
  submitHandler = (e) => {
    e.preventDefault();
    // get your values from state
    let { process_variable, variable_value, habit, habit_value } = this.state;

    // make sure to change date UTC
    let date = moment.utc(this.state.date); //.format("DD MM YYYY hh:mm:ss");
    console.log(date);

    // set up your bodies
    const processVariableBody = {
      date,
      type: "variable",
      variable: process_variable,
      value: variable_value,
    };
    const habitBody = {
      date,
      type: "habit",
      variable: habit,
      value: habit_value,
    };
    console.log(JSON.stringify(processVariableBody));
    console.log(JSON.stringify(habitBody));

    // Post the process variable
    fetch(`${config.API_ENDPOINT}/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(processVariableBody),
    })
      .then((res) => {
        if (!res.status === 201) {
          throw new Error({ message: "post failed for some reason" });
        }
      })
      // have an error in state and display something in a <p> for the user
      .catch((err) => console.log(err));

    // Post the habit
    fetch(`${config.API_ENDPOINT}/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(habitBody),
    })
      .then((res) => {
        if (!res.status === 201) {
          throw new Error({ message: "post failed for some reason" });
        }
      })
      // have an error in state and display something in a <p> for the user
      .catch((err) => console.log(err));
  };
  render() {
    console.log(this.state);
    // render the questions
    let formQuestions;
    if (!this.state.target_name) {
      formQuestions = <h1>Fetching your journal questions...</h1>;
    }
    // pull these out of state
    formQuestions = (
      <fieldset>
        {/* Make sure this is a number */}
        <label htmlFor="variable_value">{this.state.process_variable}</label>
        <input
          type="text"
          name="variable_value"
          required
          onChange={this.changeHandler}
        ></input>

        <label htmlFor="habit_value">{this.state.habit}</label>
        <select name="habit_value" required onChange={this.changeHandler}>
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
        <button type="submit">Submit entry</button>
      </fieldset>
    );

    return (
      <div className="form-container">
        <form onSubmit={this.submitHandler}>
          <h2>Make a journal entry</h2>
          <label htmlFor="date">Entry Date:</label>
          <DatePicker
            name="date"
            className="date-selector"
            selected={this.state.date}
            onChange={this.dateHandler}
          />
          {formQuestions}
        </form>
        <button className="nav-button">
          <NavLink to={`/dashboard`} className="Nav-button">
            Go to Dashboard
          </NavLink>
        </button>
      </div>
    );
  }
}
