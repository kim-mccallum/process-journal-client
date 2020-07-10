import React, { Component } from "react";
import Chart from "chart.js";
import moment from "moment";
import "./TrendChart.css";

export default class Dashboard extends Component {
  state = {
    activeButton: "",
  };
  componentDidMount() {
    // call the build graph function
    this.buildGraph();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.props, prevProps);
    this.buildGraph();
  }

  buildGraph = () => {
    const trendData = this.props.data;
    // build a graph object data
    let graphData = {
      labels: [],
      datasets: [
        {
          label: this.props.currentMetrics.variable,
          data: [],
          type: "line",
          yAxisID: "A",
          backgroundColor: "rgb(242, 144, 64, .4)",
          borderColor: "rgb(215, 67, 29)",
        },
      ],
    };
    //if data exist, format them in the object
    if (trendData.variable[this.props.currentMetrics.variable]) {
      graphData.labels = trendData.variable[
        this.props.currentMetrics.variable
      ].dates.map((dt) => moment(dt).format("L"));

      graphData.datasets[0].data =
        trendData.variable[this.props.currentMetrics.variable].values;
    }
    let element = document.getElementById("dashboard-chart");
    element.remove();
    //  grab the parent and append new
    let parent = document.querySelector(".trendchart-container");
    parent.innerHTML = `<canvas id="dashboard-chart"></canvas>`;
    let ctx = document.getElementById("dashboard-chart").getContext("2d");

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
  };

  render() {
    return (
      <div className="trendchart-container">
        <canvas id="dashboard-chart"></canvas>
      </div>
    );
  }
}
