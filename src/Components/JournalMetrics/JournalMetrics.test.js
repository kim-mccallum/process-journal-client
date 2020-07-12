import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import JournalMetrics from "./JournalMetrics";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <BrowserRouter>
      <JournalMetrics />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
