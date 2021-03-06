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
    <>
      <fieldset className="journal-metric-fieldset">
        <h2 className="journal-metric">Goal</h2>
        <p className="description">
          The outcome you are working for. Make sure to set SMART goals
          (specific, measureable, acheivable, realistic and timely).
        </p>

        {/* GOAL - If the value exists, render it, otherwise, render an input with event handlers and dynamic attributes */}
        {props.goal ? (
          <p className="user-value">{props.goal}</p>
        ) : (
          <input
            type="text"
            name="goal"
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
      </fieldset>
      <fieldset className="journal-metric-fieldset">
        {/* VARIABLE */}
        <h2 className="journal-metric">Process Variable</h2>
        <p className="description">
          What you measure regularly to monitor progress toward your goal.
        </p>
        {props.process_variable ? (
          <p className="user-value">{props.process_variable}</p>
        ) : (
          <input
            type="text"
            name="process_variable"
            onChange={props.changeInputHandler}
          ></input>
        )}
        <ChangeMetric
          changeHandler={props.changeHandler}
          // pass the event and the value - figure out how to pass value? RESEARCH
          handleSubmit={() => props.handleSubmit()}
          id="process_variable"
          text={variableButton}
          label={"process_variable"}
        />
      </fieldset>
      <fieldset className="journal-metric-fieldset">
        {/* HABIT */}
        <h2 className="journal-metric">Habit</h2>
        <p className="description">
          The thing you regularly do or do not do that supports your process.
        </p>
        {props.habit ? (
          <p className="user-value">{props.habit}</p>
        ) : (
          <input
            type="text"
            name="habit"
            onChange={props.changeInputHandler}
          ></input>
        )}
        <ChangeMetric
          changeHandler={props.changeHandler}
          // pass the event and the value - figure out how to pass value? RESEARCH
          handleSubmit={() => props.handleSubmit()}
          id="habit"
          text={habitButton}
          label={"habit"}
        />
      </fieldset>
    </>
  );
}
