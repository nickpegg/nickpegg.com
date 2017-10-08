import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import hljs from 'highlight.js';
import 'highlight.js/styles/github-gist.css';

import { Container, Row, Column } from './skeleton';

import { Post, Posts } from './Article';
import { Footer } from './Footer';
import { Header } from './Header';
import { NavList, TagNav } from './Nav';
import { NotFound } from './NotFound';


class App extends Component {
  constructor(props) {
    super(props);
    this.title = 'Nick Pegg';
  }

  render() {
    return (
      <Router>
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
                  { /* Page routes */ }
                  <Route path="/about" component={About} />

                  { /* Post routes */ }
                  <Route path="/page/:page" component={Posts} />
                  <Route path="/:year/:month/:slug" component={Post} />

                  { /* 404 fallback */ }
                  <Route component={NotFound} />
                </Switch>
              </Column>
            </Row>

          </Container>

          <Footer />

        </div>
      </Router>
    );
  }

  componentDidMount() {
    document.title = this.title;

    // Auto-highlight all <pre><code> blocks
    hljs.initHighlightingOnLoad();

  }
}

// Dummy About page just for playing around with ReactRouter
class About extends Component {
  render () {
    return (
      <article>
        <header>
          <h1>About me</h1>
        </header>
        <section>
          <p>
            Wowzers, this is an about page!
          </p>
        </section>
      </article>
    )
  }
}

export default App;
