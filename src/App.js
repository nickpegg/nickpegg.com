import React, { Component } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-gist.css';

import { Container, Row, Column } from './skeleton';

import { Article } from './Article';
import { Footer } from './Footer';
import { Header } from './Header';
import { NavList, TagNav, HistoryNav } from './Nav';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />

        <Container>
          <Row>
            <Column width="two" className="nav">
              <NavList />
              <TagNav />
            </Column>
            <Column width="eight">
              { this.articles() }
            </Column>
          </Row>

          <HistoryNav />
        </Container>

        <Footer />
      </div>
    );
  }

  articles() {
    // TODO: This is the thing that'll fetch the articles from the JSON blob
    // based on the URL that's hit. This will return one or more Articles
    return [
      <Article
        title="This is where a blog post would go"
        date="1970-01-01"
      />,
      <Article
        title="This is another blog post!"
        date="1970-01-01"
        is_page
      />
    ];
  }

  componentDidMount() {
    // Auto-highlight all <pre><code> blocks
    hljs.initHighlightingOnLoad();
  }
}

export default App;
