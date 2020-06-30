import React, { Component } from "react";
import Chart from "chart.js";
import moment from "moment";

export default class Dashboard extends Component {
  state = {
    activeButton: "",
    // DON'T LEAVE THESE IN HERE! THESE SHOULD BE PASSED AS PROPS FROM DASHBOARD
    // currentMetrics: { habit: "12 hour daily nap", variable: "frisbee score" },
  };
  componentDidMount() {
    console.log(this.props);
    // transform data
    const currentMetrics = this.props.currentMetrics;
    console.log(currentMetrics);
    const trendData = this.props.data;
    let graphData = {
      labels: [],
      datasets: [
        {
          label: this.props.currentMetrics.habit,
          data: [],
          yAxisID: "B",
          backgroundColor: "#FAEBCC", // yellow
        },
        {
          label: this.props.currentMetrics.variable,
          data: [],
          type: "line",
          yAxisID: "A",
          backgroundColor: "#EBCCD1", // red
        },
      ],
    };

    if (
      trendData.habit[this.props.currentMetrics.habit] &&
      trendData.variable[this.props.currentMetrics.variable]
    ) {
      console.log("We have entries to graph!");
      graphData.labels = trendData.habit[
        this.props.currentMetrics.habit
      ].dates.map((dt) => moment(dt).format("L"));
      // put the habit values in the first position in the datasets array
      graphData.datasets[0].data =
        trendData.habit[this.props.currentMetrics.habit].values;
      // put the variable values in the second position in the datasets array
      graphData.datasets[1].data =
        trendData.variable[this.props.currentMetrics.variable].values;
    }

    //  grab the canvas and getContext
    let ctx = document.getElementById("dashboard-chart").getContext("2d");

    let myChart = new Chart(ctx, {
      type: "bar",
      data: graphData,
      // data: {
      //   // REPLACE WITH STATE
      //   // convert dates to short format
      //   labels: trendData.habit[
      //     this.props.currentMetrics.habit
      //   ].dates.map((dt) => moment(dt).format("L")),
      //   datasets: [
      //     {
      //       label: this.props.currentMetrics.habit,
      //       data: graphData.habit,
      //       yAxisID: "B",
      //       backgroundColor: "#FAEBCC", // yellow
      //     },
      //     {
      //       label: this.props.currentMetrics.variable,
      //       data: trendData.variable[this.props.currentMetrics.variable].values,
      //       type: "line",
      //       yAxisID: "A",
      //       backgroundColor: "#EBCCD1", // red
      //     },
      //   ],
      // },
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
  // componentDidUpdate(prevProps) {
  //   console.log(this.props);
  //   // transform data
  //   const currentMetrics = this.props.currentMetrics;
  //   // console.log(currentMetrics);
  //   const trendData = this.props.data;

  //   //  grab the canvas and getContext
  //   let ctx = document.getElementById("dashboard-chart").getContext("2d");

  //   let myChart = new Chart(ctx, {
  //     type: "bar",
  //     data: {
  //       // REPLACE WITH STATE
  //       // convert dates to short format
  //       labels: trendData.habit[
  //         this.state.currentMetrics.habit
  //       ].dates.map((dt) => moment(dt).format("L")),
  //       datasets: [
  //         {
  //           label: this.state.currentMetrics.habit,
  //           data: trendData.habit[this.state.currentMetrics.habit].values,
  //           yAxisID: "B",
  //           backgroundColor: "#FAEBCC", // yellow
  //         },
  //         {
  //           label: this.state.currentMetrics.variable,
  //           data: trendData.variable[this.state.currentMetrics.variable].values,
  //           type: "line",
  //           yAxisID: "A",
  //           backgroundColor: "#EBCCD1", // red
  //         },
  //       ],
  //     },
  //     options: {
  //       scales: {
  //         xAxes: [{ stacked: true }],
  //         yAxes: [
  //           {
  //             id: "A",
  //             type: "linear",
  //             position: "left",
  //           },
  //           {
  //             id: "B",
  //             type: "linear",
  //             position: "right",
  //             //   maybe remove
  //             stacked: true,
  //             ticks: {
  //               suggestedMax: 3,
  //             },
  //           },
  //         ],
  //       },
  //     },
  //   });
  // }

  render() {
    console.log(this.props);
    return (
      <div className="trendchart-container">
        <canvas id="dashboard-chart" width="600" height="300"></canvas>
      </div>
    );
  }
}
