import React from "react";
import ChangeMetric from "../ChangeMetric/ChangeMetric";
import "./JournalMetrics.css";

export default function JournalMetric(props) {
  // // Conditional logic to create button text
  let goalButton = props.goal ? "Change this" : "Submit";
  let variableButton = props.process_variable ? "Change this" : "Submit";
  let habitButton = props.habit ? "Change this" : "Submit";
  // We also need to pass a changeButtonHandler???
  return (
    <div>
      <h1 className="journal-metric">Goal</h1>
      <p className="description">
        The outcome you are working for. Make sure to set SMART goals (specific,
        measureable, acheivable, realistic and timely.
      </p>
      {/* grab input value and send it to submit? Callback prop in JournalSetup RETURN */}
      {props.goal ? (
        <p>{props.goal}</p>
      ) : (
        <input
          type="text"
          name={props.selectedLabel}
          onChange={props.changeInputHandler}
        ></input>
      )}
      <ChangeMetric
        changeHandler={props.changeHandler}
        // pass the event and the value - figure out how to pass value? RESEARCH
        handleSubmit={() => props.handleSubmit()}
        id="goal"
        text={goalButton}
        label={"goal"}
      />

      <h1 className="journal-metric">Process Variable</h1>
      <p className="description">
        What you measure regularly to monitor progress toward your goal.
      </p>
      {props.process_variable ? (
        <p>{props.process_variable}</p>
      ) : (
        <input
          type="text"
          name={props.selectedLabel}
          onChange={props.changeInputHandler}
        ></input>
      )}
      <ChangeMetric
        text={variableButton}
        label={"process_variable"}
        changeHandler={props.changeHandler}
        // pass the event and the value - figure out how to pass value? RESEARCH
        handleSubmit={() => props.handleSubmit()}
      />

      <h1 className="journal-metric">Habit</h1>
      <p className="description">
        The thing you regularly do or do not do that supports your process.
      </p>
      {props.habit ? (
        <p>{props.habit}</p>
      ) : (
        <input
          type="text"
          name={props.selectedLabel}
          onChange={props.changeInputHandler}
        ></input>
      )}
      <ChangeMetric
        text={habitButton}
        label={"habit"}
        changeHandler={props.changeHandler}
        // pass the event and the value - figure out how to pass value? RESEARCH
        handleSubmit={() => props.handleSubmit()}
      />
    </div>
  );
}
