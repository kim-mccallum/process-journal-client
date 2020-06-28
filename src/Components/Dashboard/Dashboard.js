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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
        // console.log(entriesRes);
        let sortedData = this.sortData(entriesRes);
        // I THINK I SHOULD ONLY SET STATE ONCE AND USE ASYNC/AWAY OR A CALLBACK SO THAT THE CURRENT VALUES AND SORTED DATA ARE PUT INTO STATE AT THE SAME TIME.

        // THE FINAL SETSTATE
        this.setState({
          dataLoading: false,
          data: sortedData,
          currentMetrics: {
            habit: currentHabit,
            variable: currentVariable,
            goal: currentGoal,
          },
        });
      })
      // catch and log errors
      .catch((err) => {
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

  render() {
    console.log(this.state);
    console.log(this.state.dataLoading);
    // console.log(this.props.username);
    // TO DO
    // Get the current variable and habit values for the text
    // Get the average value for variables
    // Get the percent of habits
    let summaryText = !this.state.dataLoading ? (
      <p>
        You have made{" "}
        {`${
          this.state.data.habit[this.state.currentMetrics.habit].dates.length
        } `}
        journal entries with your current habit and process variable. Your
        average {this.state.currentMetrics.variable} is
        {` ${Math.floor(
          this.state.data.variable[
            this.state.currentMetrics.variable
          ].values.reduce((a, b) => Number(a) + Number(b)) /
            this.state.data.variable[this.state.currentMetrics.variable].values
              .length
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
        <p>Goal: {this.state.currentMetrics.goal}</p>
        <p>Process variable: {this.state.currentMetrics.variable}</p>
        <p>Supporting Habit: {this.state.currentMetrics.habit}</p>
      </div>
    ) : (
      <p></p>
    );
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
          {summaryText}
          {currentJournal}
        </div>
        {chartComponents}
      </div>
    );
  }
}
