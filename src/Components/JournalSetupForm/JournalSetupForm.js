import React, { Component } from "react";
import config from "../../config";
import "./JournalSetupForm.css";

export default class JournalSetupForm extends Component {
  state = {
    // form validation stuff in here LATER
    target_name: "",
    units: "",
    type: "number",
    target_description: "",
    habit_name: "",
    habit_description: "",
  };
  changeHandler = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  submitHandler = (e) => {
    e.preventDefault();
    // add some validation here?
    // destructure values in state
    const {
      target_name,
      units,
      type,
      target_description,
      habit_name,
      habit_description,
    } = this.state;
    const journalBody = {
      // change this to get this from the token
      // user_id: window.localStorage.getItem("user_id"),
      target_name,
      units,
      type,
      target_description,
      habit_name,
      habit_description,
    };
    console.log(JSON.stringify(journalBody));
    // fetch("http://localhost:8000/api/journal-settings", {
    fetch(`${config.API_ENDPOINT}/journal-settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(journalBody),
    })
      .then((res) => {
        if (!res.status === 201) {
          throw new Error({ message: "post failed for some reason" });
        }
      })
      // have an error in state and display something in a <p> for the user
      .catch((err) => console.log(err));
  };
  render() {
    console.log(this.state);
    return (
      <div className="journal-setup-container">
        <h2>Log Setup</h2>
        <p className="journal-setup-instructions">
          Start by specifying a target lifestyle factor that you would like to
          track then choose one key habit that you believe affect or support
          this target factor. Your target lifestyle factor and habit will be
          used to build your daily journal. By tracking these over time, you may
          uncover insight to help you reach your goals!
        </p>
        <form className="journal-setup-form" onSubmit={this.submitHandler}>
          <fieldset>
            <legend>
              Health, wellness or performance factor you want to target
            </legend>
            <label htmlFor="target_name">Name</label>
            <input
              type="text"
              name="target_name"
              required
              placeholder="E.g., resting heart rate"
              onChange={this.changeHandler}
            ></input>
            <label htmlFor="type">Type:</label>
            <select name="type" onChange={this.changeHandler}>
              {/* make it a required field - required? */}
              <option value="number">Number</option>
              <option value="quality-score">Quality score (e.g., 1-10)</option>
              <option value="yes-no">Yes or no</option>
            </select>
            <label htmlFor="units">Units:</label>
            <input
              type="text"
              name="units"
              required
              placeholder="BPM"
              onChange={this.changeHandler}
            ></input>
            <label htmlFor="target_description">Description:</label>
            <input
              type="text"
              name="target_description"
              required
              placeholder="taken first thing in the am"
              onChange={this.changeHandler}
            ></input>
          </fieldset>
          <fieldset>
            <legend>Supporting Habit</legend>
            <label htmlFor="habit_name">Habit</label>
            <input
              type="text"
              id="habit_name"
              name="habit_name"
              required
              placeholder="No caffeine"
              onChange={this.changeHandler}
            ></input>
            <label htmlFor="habit_description">Note</label>
            <input
              type="text"
              id="habit_description"
              name="habit_description"
              placeholder="dark chocolate excluded ofcourse"
              onChange={this.changeHandler}
            ></input>
          </fieldset>
          <button type="submit">Create Daily Log</button>
        </form>
      </div>
    );
  }
}
