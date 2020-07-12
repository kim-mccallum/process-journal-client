import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import ChangeMetric from "./ChangeMetric";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <BrowserRouter>
      <ChangeMetric />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
