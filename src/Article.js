import hljs from 'highlight.js';
import React, { Component } from 'react';
import Icon from 'react-fontawesome';
import Markdown from 'react-markdown';
import { Link } from 'react-router-dom';

import { ListLink } from './Nav';
import { slugify } from './util';


class Article extends Component {
  render() {
    let body = "";
    let readMore = "";
    if (this.props.blurb) {
      body = this.props.article.blurb;
      readMore = (<Link to={ this.postLink() }>read more</Link>);
    } else {
      body = this.props.article.body;
    }

    return (
      <article>
        <header>
          <Link className="post-title" to={ this.postLink() }>
            <h1>{ this.props.article.title }</h1>
          </Link>
          { this.meta() }
        </header>
        <section>
          <Markdown source={ body } />
          { readMore }
        </section>
      </article>
    );
  }

  componentDidMount() {
    document.querySelectorAll('pre code').forEach(elm => {
      hljs.highlightBlock(elm);
    });
  }

  postLink() {
    let date = new Date(this.props.article.date);
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;

    if (month < 10) {
      month = '0' + month.toString();
    }

    let slug = this.props.article.slug;
    if (!slug) {
      slug = slugify(this.props.article.title);
    }

    return `/${year}/${month}/${slug}`;
  }

  meta() {
    // Also should this be hidden for pages? That will require some CSS tweaks
    let time_text = "Posted"
    if (this.props.is_page) {
      time_text = "Updated"
    }

    return (
      <div className="post-meta">
        <time>{ time_text } { this.props.article.date }</time>
        { this.tags() }
      </div>
    );
  }

  tags() {
    let tags = this.props.article.tags;
    if (!tags || tags.length === 0) {
      return;
    } else {
      return (
        <div className="post-tags"> <Icon name="tags" />
          <ul>
            {tags.map(tag => (
              <ListLink name={tag} key={tag} href={"/tag/" + tag} />
            ))}
          </ul>
        </div>
      )
    }
  }
}

export { Article };
