import React, { Component } from "react";
// import Chart from "chart.js";
// import moment from "moment";
import TrendChart from "../TrendChart/TrendChart";
import DoughnutChart from "../DoughnutChart/DoughnutChart";
import RadarChart from "../RadarChart/RadarChart";
import { NavLink, withRouter } from "react-router-dom";
import config from "../../config";
import "./Dashboard.css";

class Dashboard extends Component {
  state = {
    activeButton: "",
    dataLoading: true,
    data: {},
    currentMetrics: "",
    error: "",
    entriesAvailable: false,
    habitSelect: "currentHabit", //or all habits
    variableSelect: "",
  };
  // Promise.all and fetch everything at the same time and then put it all one place for one setState({})
  componentDidMount() {
    // fetch current habit and variable names - pull this from the current response data
    let currentHabit;
    let currentVariable;
    let currentGoal;

    // specify URL's
    const variableURL = `${config.API_ENDPOINT}/process_variable/current`;
    const habitURL = `${config.API_ENDPOINT}/habit/current`;
    const goalURL = `${config.API_ENDPOINT}/goal/current`;
    const entriesURL = `${config.API_ENDPOINT}/entries`;

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
      fetch(goalURL, headerObject),
      fetch(entriesURL, headerObject),
    ])
      .then(([varRes, habitRes, goalRes, entriesRes]) => {
        if (!varRes.ok) {
          return varRes.json().then((e) => Promise.reject(e));
        }
        if (!habitRes.ok) {
          return habitRes.json().then((e) => Promise.reject(e));
        }
        if (!goalRes.ok) {
          return goalRes.json().then((e) => Promise.reject(e));
        }
        if (!entriesRes.ok) {
          return entriesRes.json().then((e) => Promise.reject(e));
        }
        return Promise.all([
          varRes.json(),
          habitRes.json(),
          goalRes.json(),
          entriesRes.json(),
        ]);
      })
      // find the current variables and change the current property in the data to true
      .then(([variableRes, habitRes, goalRes, entriesRes]) => {
        currentVariable = variableRes[0].process_variable;
        currentHabit = habitRes[0].habit;
        currentGoal = goalRes[0].goal;

        // SHOULD THIS RETURN THE CURRENT VALUES AND SET STATE IN COMPONENT DID MOUNT?
        console.log(
          "here are the currents:",
          currentHabit,
          currentVariable,
          currentGoal
        );

        let sortedData = this.sortData(entriesRes);
        console.log(sortedData);
        // Match should be true/false
        let matchHabit = this.checkForHabitEntries(sortedData, currentHabit);
        let matchVariable = this.checkForVariableEntries(
          sortedData,
          currentVariable
        );
        // if there are no entries, redirect to make one - this isn't running due to an error
        this.checkForEntries(sortedData);

        // THE FINAL SETSTATE
        this.setState({
          dataLoading: false,
          data: sortedData,
          currentMetrics: {
            habit: currentHabit,
            variable: currentVariable,
            goal: currentGoal,
          },
          habitEntriesAvailable: matchHabit,
          variableEntriesAvailable: matchVariable,
          variableSelect: currentVariable,
        });
      })
      // catch and log errors
      // maybe just redirect to journal-entries
      .catch((err) => {
        this.props.history.push("/journal-entry");
        console.log(`Something went wrong. Here is the error: ${err}`);
      });
  }

  // Function to sort out data to prior to storing it in state
  // Take an array of entries and sort them into an object with nested habit and variable objects:
  sortData = (entriesArray) => {
    // an object to push the unique habit/variables to
    let outObject = { habit: {}, variable: {} };
    // loop through array
    entriesArray.forEach((item) => {
      // we need to know it's type
      if (item.type === "habit") {
        // if it doesn't exist, build the bare object
        if (!outObject.habit[item.variable]) {
          outObject.habit[item.variable] = {
            dates: [],
            values: [],
          };
        }
        // otherwise just push the dates and values - we need to know index?
        outObject.habit[item.variable].dates.push(item.date);
        outObject.habit[item.variable].values.push(item.value);
        // go through these and if !item.name create a key
      }
      if (item.type === "variable") {
        // if it doesn't exist, build the bare object
        if (!outObject.variable[item.variable]) {
          outObject.variable[item.variable] = {
            dates: [],
            values: [],
          };
        }
        // otherwise just push the dates and values
        outObject.variable[item.variable].dates.push(item.date);
        outObject.variable[item.variable].values.push(item.value);
      }
    });
    return outObject;
  };
  checkForEntries = (sortedData) => {
    // see if there are entries
    let counter = 0;
    Object.values(sortedData).forEach((item) => {
      if (Object.keys(item).length === 0) {
        counter += 1;
      }
    });
    if (counter === 2) {
      this.props.history.push("/journal-entry");
    }
    // if not, redirect to journal entry
  };
  // Call this function to see if the current habit and variable exist in the data
  checkForHabitEntries = (sortedData, currentHabit) => {
    let match = false;
    if (sortedData.habit[currentHabit]) {
      match = true;
    }
    // I wanted this to return true or false not undefined
    console.log(`We have current habit entries? ${match}`);
    return match;
  };

  checkForVariableEntries = (sortedData, currentVariable) => {
    let match = false;
    if (sortedData.variable[currentVariable]) {
      match = true;
    }
    // I wanted this to return true or false not undefined
    console.log(`We have current variable entries? ${match}`);
    return match;
  };
  changeHandler = (e) => {
    if (e.target.name === "variableSelect") {
      this.setState({
        [e.target.name]: e.target.value,
        currentMetrics: {
          ...this.state.currentMetrics,
          variable: e.target.value,
        },
      });
    }
    if (e.target.name === "habitSelect") {
      this.setState({
        habitSelect: e.target.value,
      });
    }
  };

  render() {
    console.log(this.state.entriesAvailable);

    // Only summarize their data if they have entries
    let noHabitEntriesMessage = !this.state.habitEntriesAvailable ? (
      <div className="error-message-container">
        <h2 className="data-error">
          There is no data for your current habit! Use the button below to visit
          your journal and make some entries.
        </h2>
        <button className="nav-button glow-button">
          <NavLink to={`/journal-entry`}>Go to Journal Entries</NavLink>
        </button>
      </div>
    ) : (
      ""
    );

    let noVariableEntriesMessage = !this.state.variableEntriesAvailable ? (
      <div className="error-message-container">
        <h2 className="data-error">
          There is no data for your current variable! Use the button below to
          visit your journal and make some entries.
        </h2>
        <button className="nav-button glow-button">
          <NavLink to={`/journal-entry`}>Go to Journal Entries</NavLink>
        </button>
      </div>
    ) : (
      ""
    );

    // Get the percent of habits and the average value for variables
    let summaryText =
      !this.state.dataLoading &&
      this.state.habitEntriesAvailable &&
      this.state.variableEntriesAvailable ? (
        <p>
          You have made
          {` ${
            this.state.data.habit[this.state.currentMetrics.habit].dates.length
          } `}
          journal entries with your current habit and process variable. Your
          average {this.state.currentMetrics.variable} is
          {` ${Math.floor(
            this.state.data.variable[
              this.state.currentMetrics.variable
            ].values.reduce((a, b) => Number(a) + Number(b)) /
              this.state.data.variable[this.state.currentMetrics.variable]
                .values.length
          )} `}{" "}
          and you have completed your habit{" "}
          {` ${this.state.data.habit[
            this.state.currentMetrics.habit
          ].values.reduce((a, b) => Number(a) + Number(b))} times.`}
        </p>
      ) : (
        <p></p>
      );

    let currentJournal = !this.state.dataLoading ? (
      <div className="stats">
        <h3 className="stats-label">
          Currently, you are set up to track these:
        </h3>
        <p>Goal: {this.state.currentMetrics.goal}</p>
        <p>Process variable: {this.state.currentMetrics.variable}</p>
        <p>Supporting Habit: {this.state.currentMetrics.habit}</p>
      </div>
    ) : (
      <p></p>
    );
    // set up an array of values for selection
    let variableSelectArr = this.state.data.variable
      ? Object.keys(this.state.data.variable)
      : [];
    // If the data are loading, don't try to render the charts
    let chartComponents = !this.state.dataLoading ? (
      <div className="chart-container">
        <div className="flex-chart-container">
          <fieldset>
            <label htmlFor="habitSelect">Change habit graph</label>
            <select
              name="habitSelect"
              id="habitSelect"
              onChange={this.changeHandler}
            >
              {/* make this allHabits if they don't have habit data */}
              {/* THIS IS WRONG  = this is where we need the logic*/}
              {this.state.habitEntriesAvailable ? (
                <option value="currentHabit">Current Habit</option>
              ) : (
                ""
              )}

              {this.state.data.habit &&
              Object.keys(this.state.data.habit).length > 1 ? (
                <option value="allHabits">All Habits</option>
              ) : null}
            </select>
          </fieldset>
          {this.state.habitSelect === "currentHabit" &&
          this.state.habitEntriesAvailable ? (
            <DoughnutChart
              data={this.state.data}
              habit={this.state.currentMetrics.habit}
            />
          ) : (
            <RadarChart habitData={this.state.data.habit} />
          )}
        </div>
        <div className="flex-chart-container">
          <fieldset>
            {" "}
            <label htmlFor="variableSelect">
              Change process variable graph
            </label>
            <select
              name="variableSelect"
              id="variableSelect"
              onChange={this.changeHandler}
              value={this.state.variableSelect}
            >
              {/* options need to be an array of vars */}
              {variableSelectArr.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </fieldset>
          <TrendChart
            data={this.state.data}
            currentMetrics={this.state.currentMetrics}
          />
        </div>
      </div>
    ) : (
      ""
    );

    return (
      <div className="dashboard-container">
        <div className="summary-container">
          <h2 className="greeting">
            Welcome, {window.sessionStorage.getItem("username")}!
          </h2>
          {summaryText}
          {currentJournal}
          {/* if no entries or data is loading */}
          {noHabitEntriesMessage}
          {noVariableEntriesMessage}
        </div>

        {chartComponents}
      </div>
    );
  }
}

export default withRouter(Dashboard);
