import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import RadarChart from "./RadarChart";

it.only("renders without crashing", () => {
  // create a dummy data object and if I really want to test it
  const dummyData = {
    habit1: {
      dates: ["2020-06-01T12:24:27.000Z", "2020-06-02T12:24:27.000Z"],
      values: ["1", "0"],
    },
    habit2: {
      dates: ["2020-06-01T12:24:27.000Z", "2020-06-02T12:24:27.000Z"],
      values: ["1", "0"],
    },
  };
  const div = document.createElement("div");
  ReactDOM.render(
    // creates a context - if you don't have it, you get errors as this component is inside a route
    <BrowserRouter>
      {/* pass the dummy data as a prop to RadarChart */}
      <RadarChart habitData={dummyData} />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
