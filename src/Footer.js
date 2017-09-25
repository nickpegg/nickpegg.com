import React, { Component } from 'react';
import Icon from 'react-fontawesome';

import { Container } from './skeleton';

class Footer extends Component {
  render() {
    return (
      <div className="page-footer">
        <Container>
          <Icon name="copyright" /> 2017 Nick Pegg
        </Container>
      </div>
    );
  }
}

export { Footer };
