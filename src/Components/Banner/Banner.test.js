import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Banner from "./Banner";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <BrowserRouter>
      <Banner />
    </BrowserRouter>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
