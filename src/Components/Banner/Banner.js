import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SideNav from "../../Components/SideNav/SideNav";
import logo from "../../images/tree.svg";
import "./Banner.css";

export default class Banner extends Component {
  state = {
    sideNavVisible: false,
  };

  sideNavHandler = (e) => {
    // toggle the sideNavState
    this.setState({ sideNavVisible: !this.state.sideNavVisible });
  };

  // Set state in another way to get around setStates limits
  static getDerivedStateFromProps(props, state) {
    let obj = { sideNavVisible: state.sideNavVisible };
    if (!props.isAuth) {
      obj = { sideNavVisible: false };
    }
    return obj;
  }

  render() {
    const menu = this.props.isAuth ? (
      <FontAwesomeIcon
        className="menu-icon"
        icon={faAlignLeft}
        onClick={this.sideNavHandler}
      />
    ) : (
      <NavLink to={`/login`} className="login-link">
        Login
      </NavLink>
    );
    const sideNav =
      this.props.isAuth && this.state.sideNavVisible ? (
        <SideNav
          toggleMenu={this.state.sideNavVisible}
          logout={this.props.logout}
        />
      ) : (
        ""
      );
    return (
      <>
        <div className="banner">
          <figure className="logo-container">
            <img className="logo" src={logo} alt="trees logo" />
          </figure>
          <h1 className="app-name">Process Journal</h1>
          {menu}
        </div>
        {sideNav}
      </>
    );
  }
}
