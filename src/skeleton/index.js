import React, { Component } from 'react';


// Basic Skeleton elements
//
// I should be using one of the many react-skeleton libs that are out there,
// but they're all janky in one way or another. I'll make one work and open a
// PR some day once I have a better grasp of JS, React, and how all the
// packaging exactly works.

class Container extends Component {
  render() {
    return (
      <div className="container">
        {this.props.children}
      </div>
    );
  }
}

class Row extends Component {
  render() {
    return (
      <div className="row">
        { this.props.children }
      </div>
    );
  }
}

class Column extends Component {
  render() {
    return(
      <div className={ this.props.width + " columns " + this.props.className }>
        {this.props.children}
      </div>
    );
  }
}


export { Container, Row, Column };
