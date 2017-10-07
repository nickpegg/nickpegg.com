import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch
} from 'react-router-dom';

import hljs from 'highlight.js';
import 'highlight.js/styles/github-gist.css';

import { Container, Row, Column } from './skeleton';

import { Articles, RoutedArticle } from './Article';
import { Footer } from './Footer';
import { Header } from './Header';
import { NavList, TagNav, HistoryNav, HistoryNavStart } from './Nav';


class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Header />

          <Container>
            <Row>
              <Column width="two" className="nav">
                <NavList />
                <TagNav />
              </Column>
              <Column width="eight">
                <Switch>
                  <Route exact path="/" component={Articles} />
                  { /* Page routes */ }
                  <Route path="/about" component={About} />

                  { /* Article routes */ }
                  <Route path="/page/:page" component={Articles} />
                  <Route path="/:year/:month/:title" component={RoutedArticle} />

                  { /* 404 fallback */ }
                  <Route component={FourOhFour} />
                </Switch>
              </Column>
            </Row>

            { /* Display HistoryNav if this is a series of articles */ }
            <Route exact path="/" component={HistoryNavStart} />
            <Route exact path="/page/:page" component={HistoryNav} />
          </Container>

          <Footer />

        </div>
      </Router>
    );
  }

  componentDidMount() {
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

class FourOhFour extends Component {
  render () {
    return (
      <article>
        <header>
          <h1>404 Oh No!</h1>
        </header>
        <section>
          <p>
            You're lost, bud. Why not try going back <Link to="/">Home</Link>?
          </p>
        </section>
      </article>
    )
  }
}

export default App;
