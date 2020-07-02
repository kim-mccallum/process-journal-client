import React, { Component } from "react";
import Chart from "chart.js";
import moment from "moment";
import "./TrendChart.css";

export default class Dashboard extends Component {
  state = {
    activeButton: "",
    currentMetrics: this.props.currentMetrics,
  };
  componentDidMount() {
    // transform data
    const currentMetrics = this.state.currentMetrics;
    console.log(currentMetrics);
    const trendData = this.props.data;
    // build a graph object data
    let graphData = {
      labels: [],
      datasets: [
        {
          label: this.state.currentMetrics.variable,
          data: [],
          type: "line",
          yAxisID: "A",
          backgroundColor: "#EBCCD1", // red
        },
      ],
    };
    //if data exist, format them in the object
    if (trendData.variable[this.state.currentMetrics.variable]) {
      console.log("We have entries to graph!");
      graphData.labels = trendData.variable[
        this.state.currentMetrics.variable
      ].dates.map((dt) => moment(dt).format("L"));

      graphData.datasets[0].data =
        trendData.variable[this.state.currentMetrics.variable].values;
    }
    // DEAL WITH THE FACT THAT THE CHARTS DON'T RERENDER ON CHANGE
    //  grab the canvas and getContext
    // let ctx = document.getElementById("dashboard-chart").getContext("2d");
    let element = document.getElementById("dashboard-chart");
    element.remove();
    //  grab the parent and append new
    let parent = document.querySelector(".trendchart-container");
    parent.innerHTML = `<canvas id="dashboard-chart"></canvas>`;
    let ctx = document.getElementById("dashboard-chart").getContext("2d");

    console.log(graphData);

    let myChart = new Chart(ctx, {
      type: "bar",
      // put the data object in to graph
      data: graphData,
      options: {
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [
            {
              id: "A",
              type: "linear",
              position: "left",
            },
          ],
        },
      },
    });
  }

  static getDerivedStateFromProps(props, state) {
    console.log(props.currentMetrics);
    // read up on this lifecycle method:
    return { currentMetrics: props.currentMetrics };
  }

  buildGraph = () => {};

  render() {
    console.log(this.state);
    return (
      <div className="trendchart-container">
        <canvas id="dashboard-chart"></canvas>
      </div>
    );
  }
}
