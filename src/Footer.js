import React, { Component } from 'react';
import Icon from 'react-fontawesome';

import { Container, Row } from './skeleton';

class Footer extends Component {
  render() {
    return (
      <div className="page-footer">
        <Container>
          <Row>
            <Icon name="copyright" /> 2017 Nick Pegg
          </Row>
          <Row>
            <a href="https://github.com/nickpegg/nickpegg.com">Source code</a>
          </Row>
        </Container>
      </div>
    );
  }
}

export { Footer };
