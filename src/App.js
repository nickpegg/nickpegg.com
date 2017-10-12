import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter
} from 'react-router-dom';

import 'highlight.js/styles/github-gist.css';

import { Container, Row, Column } from './skeleton';

import { Footer } from './Footer';
import { Header } from './Header';
import { NavList, TagNav } from './Nav';
import { NotFound } from './NotFound';
import { Post, Posts } from './Post';
import { Page } from './Page';


class App extends Component {
  constructor(props) {
    super(props);
    this.title = 'Nick Pegg';
  }

  render() {
    return (
      <Router>
        <ScrollToTop>
          <div className="App">
            <Header title={this.title} />

            <Container>
              <Row>
                <Column width="two" className="nav">
                  <NavList />
                  <TagNav />
                </Column>
                <Column width="eight">
                  <Switch>
                    <Route exact path="/" component={Posts} />

                    { /* Post routes */ }
                    <Route exact path="/page/:page" component={Posts} />
                    <Route exact path="/tag/:tag" component={Posts} />
                    <Route exact path="/tag/:tag/page/:page" component={Posts} />

                    <Route path="/:year/:month/:slug" component={Post} />

                    { /* Page routes */ }
                    <Route path="/:slug" component={Page} />

                    { /* 404 fallback */ }
                    <Route component={NotFound} />
                  </Switch>
                </Column>
              </Row>

            </Container>

            <Footer />

          </div>
        </ScrollToTop>
      </Router>
    );
  }

  componentDidMount() {
    document.title = this.title;
  }
}

class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children
  }
}
ScrollToTop = withRouter(ScrollToTop);


export default App;
