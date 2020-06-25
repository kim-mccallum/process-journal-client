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
    data: {},
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
        // console.log(json);
        // coerce the data into a format to put into state to pass to chart components
        let sortedData = this.sortData(json);
        // THIS IS CORRECTLY SORTED
        console.log(sortedData);
        // I CALL THIS TO CHANGE ONE PROPERTY
        sortedData = this.setCurrentValues(sortedData);
        // sortedData IS WHAT I WANT BUT IT'S NOT GOING INTO STATE
        // I THINK I NEED TO CALL setState AS A CALLBACK AFTER setCurrentValues HAS RUN?
        console.log("HERE IS SORTED", sortedData);
        this.setState({
          data: sortedData,
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
    // console.log(entriesArray)
    entriesArray.forEach((item) => {
      // we need to know it's type
      if (item.type === "habit") {
        // if it doesn't exist, build the bare object
        if (!outObject.habit[item.variable]) {
          outObject.habit[item.variable] = {
            current: false,
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
            current: false,
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

  setCurrentValues = (sortedData) => {
    // fetch current habit and variable names - pull this from teh current response data
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
        // find the 'current' variables and the their current property to true
        console.log("here are the currents:", currentHabit, currentVariable);
        // debugger;
        // one check for habit
        if (sortedData.habit[currentHabit]) {
          console.log("we found current habit");
          sortedData.habit[currentHabit].current = true;
        }
        // another for variable - replicate the logic above
        if (sortedData.variable[currentHabit]) {
          console.log("we found current habit");
          sortedData.habit[currentVariable].current = true;
        }
      })
      // catch and log errors
      .catch((err) => {
        console.log(`Something went wrong. Here is the error: ${err}`);
      });
    return sortedData;
  };

  render() {
    console.log(this.state.data);
    // let formQuestions;
    // if (!this.state.target_name) {
    //   formQuestions = <h1>Fetching your journal questions...</h1>;
    // }
    return (
      <div className="dashboard-container">
        <div className="summary-container">
          <h2 className="greeting">
            {/* FIX THIS */}
            Welcome, {this.props.username}
          </h2>
          <p>
            SUMMARY STATS: You have logged [x] days and your habit [50%] of the
            time. You weekly average [sleep] is [6 hours]
          </p>
          <div className="stats">
            <p>Target: Sleep - 7 hour average</p>
            <p>Supporting Habit: Meditation</p>
          </div>
        </div>
        <div className="chart-container">
          {/* <DoughnutChart data={this.state.data} /> */}
          {/* <TrendChart data={this.state.data} /> */}
        </div>
      </div>
    );
  }
}
