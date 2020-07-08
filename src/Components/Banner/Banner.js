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
    return (
      <>
        <div className="banner">
          <figure className="logo-container">
            <img className="logo" src={logo} alt="trees logo" />
          </figure>
          <h1 className="app-name">Process Journal</h1>
          {menu}
        </div>
        <SideNav
          toggleMenu={this.state.sideNavVisible}
          logout={this.props.logout}
        />
      </>
    );
  }
}
