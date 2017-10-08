import React, { Component } from 'react';
import slugify from 'slugify';

import { Article } from './Article';
import { HistoryNav } from './Nav';
import { NotFound } from './NotFound';


class Post extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.params = props.match.params;

    this.state = {
      post: null,
      notFound: false,
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
          this.setState({notFound: true});
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
    if (this.state.notFound) {
      return <NotFound />
    }

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

      let jawn = (
        <div>
          {articles}
          <HistoryNav prev={this.state.prevHref} next={this.state.nextHref} />
        </div>
      )
      if (articles.length === 0) {
        jawn = <NotFound />;
      }

      return jawn
    } else {
      return <p></p>
    }
  }
}

export { Post, Posts };