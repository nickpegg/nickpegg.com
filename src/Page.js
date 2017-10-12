import hljs from 'highlight.js';
import React, { Component } from 'react';
import Markdown from 'react-markdown';

import { NotFound } from './NotFound';
import { slugify } from './util';


class Page extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.params = props.match.params;

    this.state = {
      page: null,
      notFound: false,
    }
  }

  fetchPage() {
    fetch('/site.json')
      .then(resp => resp.json())
      .then(blob => {
        for (let page of blob.pages) {
          let slug = page.slug;
          if (!slug) {
            slug = slugify(page.title);
          }

          if (slug === this.params.slug) {
            this.setState({
              page: page,
              notFound: false,
            })
            return
          }
        }

        this.setState({
          page: null,
          notFound: true,
        });
      });
  }

  componentDidMount() {
    this.fetchPage();
    document.querySelectorAll('pre code').forEach(elm => {
      hljs.highlightBlock(elm);
    });
  }

  componentWillReceiveProps(props) {
    this.params = props.match.params;
    this.fetchPage();
  }

  render() {
    if (this.state.notFound) {
      return <NotFound />
    }

    if (this.state.page) {
      return (
        <article>
          <header>
            <h1>{ this.state.page.title }</h1>
          </header>
          <section>
            <Markdown source={ this.state.page.body } />
          </section>
        </article>
      )
    } else {
      return <p></p>
    }
  }
}

export { Page };
