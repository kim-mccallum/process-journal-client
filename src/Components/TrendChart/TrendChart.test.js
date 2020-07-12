import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import TrendChart from "./TrendChart";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <BrowserRouter>
      <TrendChart />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
