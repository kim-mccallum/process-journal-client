import React, { Component } from "react";
import Chart from "chart.js";
import moment from "moment";
import STORE from "../../STORE";

// DATE HANDLING HELPER FUNCTION - PUT THIS IN THE HELPER FNS MODULE?
const dateArray = (dates) => {
  // sort in ascending order
  const sortedDates = dates.sort((a, b) => moment(a).diff(moment(b)));
  // convert to moment objects
  const momentDates = sortedDates.map((dt) => moment(dt));
  // create an empty array to hold 0/1 (no and yes)
  const days = [];
  // get first and last dates
  const dateStart = momentDates[0];
  const dateEnd = momentDates[momentDates.length - 1];
  // console.log(dateStart, dateEnd);
  // subtract start from end and while the difference is positive, check each date to see if it exists
  while (dateEnd.diff(dateStart, "days") >= 0) {
    days.push(dateStart.format("L"));
    // increment days
    dateStart.add(1, "days");
  }
  // return days;
  return [dates.length, days.length - dates.length];
};

export default class Dashboard extends Component {
  state = {
    activeButton: "",
  };
  // FETCH DATA IN HERE
  componentDidMount() {
    // pie chart
    let ctx1 = document.getElementById("dashboard-pie-chart").getContext("2d");
    let myPieChart = new Chart(ctx1, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: dateArray(STORE.dates),
            backgroundColor: [
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 99, 132, 0.2)",
            ],
            borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
          },
        ],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: ["Logged", "Not Logged"],
      },
      options: {
        title: {
          display: true,
          text: "Days logged",
        },
      },
    });
  }
  render() {
    // console.log(dateArray(STORE.dates));
    return (
      <div className="doughnut-container">
        <canvas id="dashboard-pie-chart"></canvas>
      </div>
    );
  }
}
