import React from "react";

// button to change metric
export default function ChangeMetric(props) {
  // on first render - 'change this' then after rerender 'submit'
  // when you click this button, the event is this button and you get the id in the callback prop

  return (
    <button
      onClick={
        props.text === "Change this" ? props.changeHandler : props.handleSubmit
      }
      id={props.id}
    >
      {props.text}
    </button>
  );
}
