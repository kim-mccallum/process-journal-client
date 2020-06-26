import React, { Component } from "react";
import Chart from "chart.js";
import moment from "moment";

export default class Dashboard extends Component {
  state = {
    activeButton: "",
    trendData: [],
  };

  componentDidUpdate(prevProps) {
    console.log(this.props);
    // transform data
    const currentMetrics = this.props.currentMetrics;
    console.log(currentMetrics);
    const trendData = this.props.data;

    //  grab the canvas and getContext
    let ctx = document.getElementById("dashboard-chart").getContext("2d");

    // create datasets array
    let datasetsArray = [];
    Object.keys(trendData).map((key, index) => {
      if (index === 1) {
        datasetsArray.push({
          label: key,
          data: trendData[key],
          type: "line",
          yAxisID: "A",
          backgroundColor: "#EBCCD1",
        });
      } else {
        datasetsArray.push({
          label: key,
          data: trendData[key],
          yAxisID: "B",
          backgroundColor: "#D6E9C6",
        });
      }
    });
    let myChart = new Chart(ctx, {
      type: "bar",
      data: {
        // REPLACE WITH STATE
        // convert dates to short format
        labels: trendData.dates.map((dt) => moment(dt).format("L")),
        datasets: datasetsArray,
      },
      options: {
        scales: {
          xAxes: [{ stacked: true }],
          yAxes: [
            {
              id: "A",
              type: "linear",
              position: "left",
            },
            {
              id: "B",
              type: "linear",
              position: "right",
              //   maybe remove
              stacked: true,
              ticks: {
                suggestedMax: 3,
              },
            },
          ],
        },
      },
    });
  }

  render() {
    console.log(this.props);
    return (
      <div className="trendchart-container">
        <canvas id="dashboard-chart" width="600" height="300"></canvas>
      </div>
    );
  }
}
