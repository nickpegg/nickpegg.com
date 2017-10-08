import React, { Component } from 'react';
import Icon from 'react-fontawesome';
import Markdown from 'react-markdown';
import { Link } from 'react-router-dom';
import slugify from 'slugify';

import { ListLink, HistoryNav } from './Nav';
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


class Post extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.params = props.match.params;

    this.state = {
      post: null
    }
  }

  fetchPost() {
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
            this.setState({post: post})
            found = true;
            break
          }
        }

        if (!found) {
          console.log('post not found');
          /* TODO: return 404 */
        }
      });
  }

  componentDidMount() {
    this.fetchPost();
  }

  componentWillReceiveProps(props) {
    this.params = props.match.params;
    this.fetchPost();
  }

  render() {
    if (this.state.post) {
      return (
        <Article
          article={this.state.post}
        />
      )
    } else {
      return (
        <p></p>
      )
    }
  }
}

class Posts extends Component {
  constructor(props) {
    super(props);

    // Number of Articles per page
    // TODO: Pull this from a configuration somehow
    this.perPage = 4;

    this.params = props.match.params;
    this.state = {
      posts: null,
      prevHref: null,
      nextHref: null,
    }
  }

  update() {
    this.fetchPosts();
  }

  fetchPosts() {
    // Fetch posts from JSON blob
    fetch('/site.json')
      .then((resp) => resp.json())
      .then((blob) => {
        let offset = 0;
        let page = parseInt(this.params.page, 10);
        if (!page) {
          page = 0;
        }

        offset = page * this.perPage;
        let posts = blob.posts.slice(offset, offset + this.perPage);

        // Check to see if we have more posts after these
        let nextOffset = (page + 1) * this.perPage;
        let nextPosts = blob.posts.slice(nextOffset,
          nextOffset + this.perPage);
        let hasMore = nextPosts.length > 0;
        this.updateHistoryNav(page, hasMore);

        this.setState({posts: posts});
      });
  }

  updateHistoryNav(page, hasMore) {
    console.log("page" ,page);
    console.log("more?", hasMore);
    // Update prev state
    let prev = null;
    if (page === 1) {
      prev = "/";
    } else if (page > 1) {
      prev = "/page/" + (page - 1);
    } else {
      prev = null;
    }

    // Update next state
    let next = null;
    if (hasMore) {
      next = "/page/" + (page + 1);
    } else {
      next = null;
    }

    this.setState({
      nextHref: next,
      prevHref: prev,
    })
  }

  componentDidMount() {
    this.update();
  }

  componentWillReceiveProps(props) {
    this.params = props.match.params;
    this.update();
  }

  render() {
    if (this.state.posts != null) {
      let articles = this.state.posts.map(post =>
        <Article
          key={post.title}
          article={post}
          blurb
        />
      );

      let jawn = articles;
      if (articles.length === 0) {
        jawn = <NotFound />;
      }

      return (
        <div>
          { jawn }
          <HistoryNav prev={this.state.prevHref} next={this.state.nextHref} />
        </div>
      )
    } else {
      return <p></p>
    }
  }
}

export { Article, Post, Posts };
