import React, { Component } from 'react';
import Icon from 'react-fontawesome';
import Markdown from 'react-markdown';

import { ListLink } from './Nav';


class Article extends Component {
  render() {
    let postLink = "";

    return (
      <article>
        <header>
          <a className="post-title" href={ postLink }>
            <h1>{ this.props.title }</h1>
          </a>
          { this.meta() }
        </header>
        <section>
          <Markdown source={ this.content() } />
          <a href={ postLink }>omg read more</a>
        </section>
      </article>
    );
  }

  meta() {
    // TODO: Fill this in with real metadata.
    // Also should this be hidden for pages? That will require some CSS tweaks
    let time_text = "Posted"
    if (this.props.is_page) {
      time_text = "Updated"
    }

    return (
      <div className="post-meta">
        <time>{ time_text } { this.props.date }</time>
        <div className="post-tags"> <Icon name="tags" />
          <ul>
            <ListLink name="tag1" href="" />
            <ListLink name="tag2" href="" />
          </ul>
        </div>
      </div>
    );
  }

  content () {
    /* TODO: Have this return the actual content of the page/post. This should
     * probably just be passed in from App.articles()
     *
     * This is just dummy filler for now to show off the styling of various
     * Markdown blocks
     */
    return (
      "Lorem ipsum `dolor sit amet`, sale fugit ea ius, ut eam alii duis, quaeque salutandi cu mea. His quot doming cu, usu labore antiopam appellantur at, in vidit democritum has. Prompta sententiae duo ut. Nam ne iisque repudiare repudiandae, an mel duis ullum posidonium.\n\n"
      + "# h1 header\n\n"
      + "```\n#!/bin/bash\necho \"This is a code block!\"\n```\n\n"
      + "## h2 header\n\n"
      + "> # Woah\n> Oh and look at this\n>\n> It's a block quote\n\n"
    );
  }
}

// Goofball article for routing testing
class RoutedArticle extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.params = props.match.params;

    this.state = {
      body: '',
      title: 'default title',
      date: 'default date',
      tags: [],
    }
  }

  render() {
    return (
      <Article title={this.state.title} date={this.state.date} />
    )
  }
}


class Articles extends Component {
  constructor(props) {
    super(props);

    // Number of Articles per page
    // TODO: Pull this from a configuration somehow
    this.per_page = 5;

    this.params = props.match.params;
    this.state = {
      articles: [],
    }

    console.log("page", this.params.page);
  }

  fetchArticles() {
    // Fetch articles from JSON blob
    fetch('/site.json')
      .then((resp) => resp.json())
      .then((blob) => {
        let offset = 0;
        if (this.params.page) {
          offset = this.params.page * this.per_page;
        }
        console.log("offset", offset);
        let posts = blob.posts.slice(offset, offset + this.per_page);

        this.setState({articles: posts});
      })
      .catch(function(error) {
        console.log("Oh no! " + error);
      });
  }

  componentDidMount() {
    this.fetchArticles();
  }

  componentWillReceiveProps(props) {
    this.params = props.match.params;
    this.fetchArticles();
  }

  render() {
    return (
      <div>
        {this.state.articles.map(article =>
          <Article
            key={article.title}
            title={article.title}
            date="1970-01-01"
          />
        )}
      </div>
    )
  }
}

export { Article, Articles, RoutedArticle };
