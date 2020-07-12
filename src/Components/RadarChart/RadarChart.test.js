import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import RadarChart from "./RadarChart";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <BrowserRouter>
      <RadarChart />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
