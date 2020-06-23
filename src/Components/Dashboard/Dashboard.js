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
    data: [],
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
        // coerce the data into a format to put into state to pass to chart components
        // console.log(json);
        this.setState({
          data: json,
        });
      })
      .catch((err) => {
        // have a JSX <p> to render this error
        this.setState({ error: err });
      });
  }
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
          <DoughnutChart data={this.state.data} />
          <TrendChart data={this.state.data} />
        </div>
      </div>
    );
  }
}
