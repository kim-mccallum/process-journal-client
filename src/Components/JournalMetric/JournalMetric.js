import React from "react";
import ChangeMetric from "../ChangeMetric/ChangeMetric";
import "./JournalMetric.css";

export default function JournalMetric(props) {
  // // Conditional logic to create button text
  let goalButton = props.goal ? "Change this" : "Submit";
  let variableButton = props.goal ? "Change this" : "Submit";
  let habitButton = props.goal ? "Change this" : "Submit";
  // We also need to pass a changeButtonHandler???
  return (
    <div>
      <h1 className="journal-metric">Goal</h1>
      <p className="description">
        The outcome you are working for. Make sure to set SMART goals (specific,
        measureable, acheivable, realistic and timely.
      </p>
      {/* grab input value and send it to submit? HOW DO I GRAB THE VALUE */}
      {props.goal ? <p>{props.goal}</p> : <input type="text" id="goal"></input>}
      <ChangeMetric
        changeHandler={props.changeHandler}
        // pass the event and the value - figure out how to pass value? RESEARCH
        handleSubmit={() => props.handleSubmit()}
        id="goal"
        text={goalButton}
      />

      <h1 className="journal-metric">Process Variable</h1>
      <p className="description">
        What you measure regularly to monitor progress toward your goal.
      </p>
      <p>{props.processVariable}</p>
      <ChangeMetric text={variableButton} />

      <h1 className="journal-metric">Habit</h1>
      <p className="description">
        The thing you regularly do or do not do that supports your process.
      </p>
      <p>{props.habit}</p>
      <ChangeMetric text={habitButton} />
    </div>
  );
}
