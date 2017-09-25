import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
      <div className="page-header">
        <div className="container">
          <a href="/">
            <h1>nickpegg.com</h1>
          </a>
        </div>
      </div>
    );
  }
}

export { Header };
