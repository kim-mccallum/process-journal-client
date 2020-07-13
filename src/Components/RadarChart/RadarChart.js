import React, { Component } from "react";
// import Chart from "chart.js";
import { Radar } from "react-chartjs-2";

// to build the chart after creating canvas make this a class component
export default class RadarChart extends Component {
  componentDidMount() {
    // Nothing to do in here?
  }

  buildGraph = () => {
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
          backgroundColor: "rgb(242, 144, 64, .4)",
          borderColor: "rgb(215, 67, 29)",
        },
      ],
    };
    data.labels = Object.keys(this.props.habitData);
    data.datasets[0].data = this.calcPercentage();

    return { data, options };
  };

  calcPercentage = () => {
    let outPercents = [];
    // loop over object (keys/values)
    for (let [key, object] of Object.entries(this.props.habitData)) {
      // console.log(key, object);
      // convert to nums, reduce to sum,
      let sum = object.values.reduce((a, b) => parseInt(a) + parseInt(b), 0);
      //divide by length and multiply by 100
      let percent = (sum / object.values.length) * 100;

      outPercents.push(percent);
    }
    return outPercents;
  };

  render() {
    if (!this.props.data) {
      return null;
    }

    let graphData = this.buildGraph();
    return (
      <div className="habit-chart-container">
        {/* <canvas id="dashboard-radar-chart"></canvas> */}
        <Radar data={graphData.data} options={graphData.options} />
      </div>
    );
  }
}
