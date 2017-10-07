import React, { Component } from 'react';
import Icon from 'react-fontawesome';
import Markdown from 'react-markdown';
import { Link } from 'react-router-dom';
import slugify from 'slugify';

import { ListLink } from './Nav';
import { NotFound } from './NotFound';


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

  postLink() {
    let date = new Date(this.props.article.date);
    let year = date.getUTCFullYear();
    let month = date.getUTCMonth() + 1;

    let slug = this.props.article.slug;
    if (!slug) {
      slug = slugify(this.props.article.title);
    }

    return `/${year}/${month}/${slug}`;
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
        <time>{ time_text } { this.props.article.date }</time>
        { this.tags() }
      </div>
    );
  }

  tags() {
    let tags = this.props.article.tags;
    if (tags.length === 0) {
      return;
    } else {
      return (
        <div className="post-tags"> <Icon name="tags" />
          <ul>
            {tags.map(tag => (
              <ListLink name={tag} key={tag} href="" />
            ))}
          </ul>
        </div>
      )
    }
  }
}


class FullArticle extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.params = props.match.params;

    this.state = {
      article: null
    }
  }

  fetchArticle() {
    fetch('/site.json')
      .then((resp) => resp.json())
      .then((blob) => {
        let found = false;
        for (let post of blob.posts) {
          let slug = post.slug;
          if (!slug) {
            slug = slugify(post.title);
          }

          if (slug === this.params.slug) {
            this.setState({article: post})
            found = true;
            break
          }
        }

        if (!found) {
          console.log('article not found');
          /* TODO: return 404 */
        }
      });
  }

  componentDidMount() {
    this.fetchArticle();
  }

  componentWillReceiveProps(props) {
    this.params = props.match.params;
    this.fetchArticle();
  }

  render() {
    if (this.state.article) {
      return (
        <Article
          article={this.state.article}
        />
      )
    } else {
      return (
        <p>Loading...</p>
      )
    }
  }
}

class Articles extends Component {
  constructor(props) {
    super(props);

    // Number of Articles per page
    // TODO: Pull this from a configuration somehow
    this.per_page = 4;

    this.params = props.match.params;
    this.state = {
      articles: null,
    }
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
        let posts = blob.posts.slice(offset, offset + this.per_page);

        this.setState({articles: posts});
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
    if (this.state.articles != null) {
      let articles = this.state.articles.map(article =>
        <Article
          key={article.title}
          article={article}
          blurb
        />
      );

      let jawn = articles;
      if (articles.length === 0) {
        jawn = <NotFound />;
      }

      return (
        <div>{ jawn }</div>
      )
    } else {
      return <p>Loading...</p>
    }
  }
}

export { Article, FullArticle, Articles };
