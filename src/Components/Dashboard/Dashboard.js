import React, { Component } from "react";
// import Chart from "chart.js";
// import moment from "moment";
import TrendChart from "../TrendChart/TrendChart";
import DoughnutChart from "../DoughnutChart/DoughnutChart";
import config from "../../config";
import "./Dashboard.css";

export default class Dashboard extends Component {
  state = {
    activeButton: "",
    // USE THIS TO CONDITIONALLY RENDER THE COMPONENTS THAT NEED DATA?
    dataLoading: true,
    data: {},
    currentMetrics: "",
    error: "",
  };

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/entries`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (response.status === 400) {
          throw new Error(response.error);
        }
        return response.json();
      })
      .then((json) => {
        // transform the data into a format to put into state to pass to chart components
        // PROBLEMS HERE - TOO MANY SET STATES AND THIS IS FLAKY AND NOT WORKING - WHEN I PASS THE STATE VALUES TO THE CHILD, THEY ARE UNDEFINED
        // sortData SETS STATE
        let sortedData = this.sortData(json);
        // I THINK I SHOULD ONLY SET STATE ONCE AND USE ASYNC/AWAY OR A CALLBACK SO THAT THE CURRENT VALUES AND SORTED DATA ARE PUT INTO STATE AT THE SAME TIME.
        // setCurrentValues ALSO SETS STATE AFTER IT MAKES AN API CALL
        this.setCurrentMetrics();
        // THE FINAL SETSTATE
        this.setState({
          data: sortedData,
          dataLoading: false,
        });
      })
      .catch((err) => {
        // have a JSX <p> to render this error
        this.setState({ error: err });
      });
  }
  // Function to sort out data to store in state
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

  setCurrentMetrics = () => {
    // fetch current habit and variable names - pull this from the current response data
    let currentHabit;
    let currentVariable;

    // specify URL's
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
      // find the current variables and change the current property in the data to true
      .then(([variableRes, habitRes]) => {
        currentVariable = variableRes[0].process_variable;
        currentHabit = habitRes[0].habit;
        // SHOULD THIS RETURN THE CURRENT VALUES AND SET STATE IN COMPONENT DID MOUNT?
        console.log("here are the currents:", currentHabit, currentVariable);
        // THIS DOESN'T APPEAR TO BE WORKING
        this.setState({
          currentMetrics: { habit: currentHabit, variable: currentVariable },
        });
      })
      // catch and log errors
      .catch((err) => {
        console.log(`Something went wrong. Here is the error: ${err}`);
      });
  };

  render() {
    console.log(this.state);
    console.log(this.props.username);
    // TO DO
    // Get the current variable and habit values for the text
    // Get the average value for variables
    // Get the percent of habits

    // If the data are loading, render the charts (!dataLoading)
    let chartComponents = !this.state.dataLoading ? (
      <div className="chart-container">
        <DoughnutChart
          data={this.state.data}
          habit={this.state.currentMetrics.habit}
        />
        <TrendChart
          data={this.state.data}
          currentMetrics={this.state.currentMetrics}
        />
      </div>
    ) : (
      <h1>Data loading!</h1>
    );
    return (
      <div className="dashboard-container">
        <div className="summary-container">
          <h2 className="greeting">
            {/* FIX THIS */}
            Welcome, {this.props.username}!
          </h2>
          <p>
            SUMMARY STATS ARE NOT DONE: You have made{" "}
            {/* {this.state.data.habit[this.state.currentHabit].length}  */}
            entries and your habit [50%] of the time. You weekly average [sleep]
            is [6 hours]
          </p>
          <div className="stats">
            <p>Process variable: Sleep - 7 hour average</p>
            <p>Supporting Habit: Meditation</p>
          </div>
        </div>
        {chartComponents}
      </div>
    );
  }
}
