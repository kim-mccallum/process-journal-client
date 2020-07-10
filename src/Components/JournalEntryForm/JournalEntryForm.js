import React, { Component } from "react";
import config from "../../config";
import DatePicker from "react-datepicker";
import { Link, NavLink } from "react-router-dom";
import moment from "moment";

import "react-datepicker/dist/react-datepicker.css";

export default class JournalEntryForm extends Component {
  debugger;
  state = {
    // date conversion happens in the submit
    date: new Date(),
    process_variable: "",
    habit: "",
    variable_value: "",
    habit_value: "1",
    error: "",
  };
  // Make a fetch to all 3 endpoints to get: goal, variable, habit to put in state
  componentDidMount() {
    // specify URL's
    const variableURL = `${config.API_ENDPOINT}/process_variable/current`;
    const habitURL = `${config.API_ENDPOINT}/habit/current`;

    const headerObject = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
    };
    // make fetch with Promise.all -
    Promise.all([
      fetch(variableURL, headerObject),
      fetch(habitURL, headerObject),
    ])
      .then(([varRes, habitRes]) => {
        if (!varRes.ok) {
          return varRes.json().then((e) => Promise.reject(e));
        }
        if (!habitRes.ok) {
          return habitRes.json().then((e) => Promise.reject(e));
        }
        return Promise.all([varRes.json(), habitRes.json()]);
      })
      .then(([variableRes, habitRes]) => {
        if (variableRes.length > 0 && habitRes.length > 0) {
          this.setState({
            process_variable: variableRes[0].process_variable,
            habit: habitRes[0].habit,
            message: "",
          });
        } else {
          this.setState({ message: "Journal has not yet been set up!" });
        }
      })
      // catch and log errors
      // IMPROVE THIS ERROR - IF THEY DON'T HAVE A GOAL/PROCESS_VARIABLE/HABIT, LET THEM KNOW
      .catch((err) => {
        this.setState({
          error: `Something went wrong. Here is the error: ${err}`,
        });
      });
  }
  // This doesn't seem to be putting the new values from the form into state
  changeHandler = (e) => {
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

    //if variable_value is not a number
    if (isNaN(variable_value)) {
      // set an error message in state
      this.setState({ error: "Variable value must be a number." });
      this.setState({
        error: `Your input for ${this.state.process_variable} must be a number.`,
      });
      // return from the function
      return;
    }

    // make sure to change date UTC
    let date = moment.utc(this.state.date);

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
    // console.log(JSON.stringify(processVariableBody));
    // console.log(JSON.stringify(habitBody));

    // Post the process variable
    fetch(`${config.API_ENDPOINT}/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        // Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(processVariableBody),
    })
      .then((res) => {
        if (!res.ok) {
          console.log(res.status); //returns 404 when given a bad endpoint
          throw new Error(`Request failed with status: ${res.status}`);
        }
      })
      // have an error in state and display something in a <p> for the user
      .catch((err) => {
        this.setState({
          error: `Something went wrong. Here is the error: ${err}`,
        });
      });

    // Post the habit
    fetch(`${config.API_ENDPOINT}/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify(habitBody),
    })
      .then((res) => {
        if (!res.status === 201) {
          throw new Error(`Request failed with status: ${res.status}`);
        }
        //redirect to dashboard
        this.props.history.push("/dashboard");
      })
      // have an error in state and display something in a <p> for the user
      .catch((err) => {
        this.setState({
          error: `Something went wrong. Here is the error: ${err}`,
        });
      });
  };
  render() {
    let errorMessage = this.state.error ? (
      <p className="validationError">{this.state.error}</p>
    ) : (
      ""
    );

    // render the questions
    let formContent = !this.state.message ? (
      <>
        <label htmlFor="date">Journal Entry Date:</label>
        <DatePicker
          name="date"
          className="date-selector"
          selected={this.state.date}
          onChange={this.dateHandler}
        />
        <fieldset>
          {/* Make sure this is a number */}
          <label htmlFor="variable_value">{`Process variable: ${this.state.process_variable}`}</label>
          <input
            type="text"
            name="variable_value"
            required
            onChange={this.changeHandler}
          ></input>

          <label htmlFor="habit_value">{`Habit:  ${this.state.habit}. Did you complete it?`}</label>
          <select name="habit_value" required onChange={this.changeHandler}>
            <option value="1">Yes</option>
            <option value="0">No</option>
          </select>
          <button type="submit">Submit Entry</button>
        </fieldset>
        <div className="button-container">
          <ul>
            <li className="nav-button glow-button">
              <NavLink to={`/dashboard`} className="Nav-button" disabled>
                Go to Dashboard
              </NavLink>
            </li>
          </ul>
        </div>
      </>
    ) : (
      <>
        <p>{this.state.message}</p>
        <br />
        <div className="button-container">
          <ul>
            <li className="nav-button glow-button">
              <Link to={`/journal-setup`} className="Nav-button" disabled>
                Setup your journal
              </Link>
            </li>
          </ul>
        </div>
      </>
    );

    return (
      <div className="form-container">
        <form onSubmit={this.submitHandler}>
          <h2>Make a journal entry</h2>
          {errorMessage}

          {formContent}
        </form>
      </div>
    );
  }
}
