import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import JournalSetup from "./JournalSetup";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <BrowserRouter>
      <JournalSetup />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
