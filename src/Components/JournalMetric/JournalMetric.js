import React from "react";
import ChangeMetric from "../ChangeMetric/ChangeMetric";

export default function JournalMetric(props) {
  let goalButton = props.goal ? "Change this" : "Submit";
  let variableButton = props.goal ? "Change this" : "Submit";
  let habitButton = props.goal ? "Change this" : "Submit";
  // We also need to pass a changeButtonHandler
  return (
    <div>
      <h1>Goal</h1>
      {/* grab input value and send it to submit? HOW DO I GRAB THE VALUE */}
      {props.goal ? <p>{props.goal}</p> : <input type="text" id="goal"></input>}
      <ChangeMetric
        changeHandler={props.changeHandler}
        // pass the event and the value - figure out how to pass value? RESEARCH
        handleSubmit={() => props.handleSubmit()}
        id="goal"
        text={goalButton}
      />

      <h1>Process Variable</h1>
      <p>{props.processVariable}</p>
      <ChangeMetric text={variableButton} />

      <h1>Habit</h1>
      <p>{props.habit}</p>
      <ChangeMetric text={habitButton} />
    </div>
  );
}
