import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <div className="page-header">
        <div className="container">
          <Link to="/">
            <h1>{ this.props.title }</h1>
          </Link>
        </div>
      </div>
    );
  }
}

export { Header };
