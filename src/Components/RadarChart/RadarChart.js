import React, { Component } from "react";
import Chart from "chart.js";

// to build the chart after creating canvas make this a class component
export default class RadarChart extends Component {
  componentDidMount() {
    this.buildGraph();
  }

  buildGraph = () => {
    let ctx = document.getElementById("dashboard-radar-chart").getContext("2d");

    let options = {
      title: {
        display: true,
        text: "Percent completion of habits",
      },
      legend: {
        display: false,
      },
      scale: {
        angleLines: {
          display: true,
        },
        ticks: {
          suggestedMin: 10,
          suggestedMax: 100,
        },
      },
    };
    let data = {
      // get an array of labels
      labels: [],
      datasets: [
        {
          // get an array of values (sum of values/length)
          data: [],
          backgroundColor: "rgb(255, 159, 64)",
          borderColor: "rgb(255, 99, 132)",
        },
      ],
    };
    data.labels = Object.keys(this.props.habitData);
    data.datasets[0].data = this.calcPercentage();
    console.log(data);

    var myRadarChart = new Chart(ctx, {
      type: "radar",
      data: data,
      options: options,
    });
  };

  calcPercentage = () => {
    let outPercents = [];
    for (let [key, object] of Object.entries(this.props.habitData)) {
      console.log(key, object);
      // convert to nums, reduce to sum,
      let sum = object.values.reduce((a, b) => parseInt(a) + parseInt(b), 0);
      //divide by length and multiply by 100
      let percent = (sum / object.values.length) * 100;

      outPercents.push(percent);
    }
    return outPercents;
  };

  render() {
    // console.log(this.props.data);
    return (
      <div className="habit-chart-container">
        <canvas id="dashboard-radar-chart"></canvas>
      </div>
    );
  }
}
