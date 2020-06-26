import React, { Component } from "react";
import Chart from "chart.js";
import moment from "moment";
import STORE from "../../STORE";

const getChartData = (habitValArray) => {
  let chartData = {
    datasets: [
      {
        data: [],
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(255, 99, 132, 0.2)"],
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
      },
    ],
    labels: ["Done", "Not done"],
  };
  // use reduce to sum over the array
  let totalDone = habitValArray.reduce((a, b) => Number(a) + Number(b));
  chartData.datasets[0].data.push(totalDone);
  chartData.datasets[0].data.push(habitValArray.length - totalDone);
  return chartData;
};

export default class DoughnutChart extends Component {
  // Don't think I need state
  state = {
    activeButton: "",
    // DON'T LEAVE THESE IN HERE! THESE SHOULD BE PASSED AS PROPS FROM DASHBOARD
    // currentMetrics: { habit: "12 hour daily nap", variable: "frisbee score" },
  };
  componentDidMount() {
    let myDatasets = getChartData([0, 1]);
    // WHY IS props.data.habit NOT DEFINED?
    // THIS CONDITIONAL SHOULD PASS SO THAT I CAN GRAPH 'REAL' DATA
    if (this.props.data.habit) {
      // ALSO HAVING TROUBLE WITH THIS NOT BEING DEFINED EITHER
      let valuesArr = this.props.data.habit[this.props.habit].values;
      myDatasets = getChartData(valuesArr);
    }
    // doughnut chart
    let ctx1 = document.getElementById("dashboard-pie-chart").getContext("2d");
    let myPieChart = new Chart(ctx1, {
      type: "doughnut",
      data: myDatasets,
      options: {
        title: {
          display: true,
          text: "Habit completion",
        },
      },
    });
  }
  render() {
    console.log(this.props);
    // CONSOLE LOGS TO EXPLORE HOW MY PROPS AND STATE ARE NOT DEFINED
    if (this.props.data.habit) {
      let valuesArr = this.props.data.habit[this.props.habit].values;
      // console.log("it is only defined sometimes?", valuesArr);
      let testData = getChartData(valuesArr);
      console.log("here is what doughnut is graphing", testData);
    }
    return (
      <div className="doughnut-container">
        <canvas id="dashboard-pie-chart"></canvas>
      </div>
    );
  }
}
