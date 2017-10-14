import React, { Component } from 'react';

import config from './config';
import { Article } from './Article';
import { HistoryNav } from './Nav';
import { NotFound } from './NotFound';
import { slugify } from './util';


class Post extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.params = props.match.params;

    this.state = {
      post: null,
      title: '',
      notFound: false,
    }
  }

  fetchPost() {
    fetch('/site.json')
      .then((resp) => resp.json())
      .then((blob) => {
        let found = false;
        for (let post of blob.posts) {
          let date = new Date(post.date);
          let year = date.getUTCFullYear();
          let month = date.getUTCMonth() + 1;

          let slug = post.slug;
          if (!slug) {
            slug = slugify(post.title);
          }

          if (
            slug === this.params.slug
            && year === Number(this.params.year)
            && month === Number(this.params.month)
          ) {
            this.setState({post: post})
            found = true;
            break
          }
        }

        this.setState({notFound: !found});
      });
  }

  componentDidMount() {
    this.fetchPost();
  }

  componentWillUnmount() {
    // Reset the document title to the default
    document.title = config.title;
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
      console.log(this.state.post);
      document.title = `${config.title} - ${this.state.post.title}`;
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
        let posts = blob.posts;
        let offset = 0;

        let page = parseInt(this.params.page, 10);
        if (!page) {
          page = 0;
        }
        offset = page * config.numPostsPerPage;

        // if tag is set, filter posts down to that of that tag
        if (this.params.tag) {
          posts = posts.filter(p => (p.tags.includes(this.params.tag)));
        }

        // Grab the slice of posts for this page
        let post_slice = posts.slice(offset, offset + config.numPostsPerPage);

        // Check to see if we have more posts after these
        let nextOffset = (page + 1) * config.numPostsPerPage;
        let nextPosts = posts.slice(nextOffset,
          nextOffset + config.numPostsPerPage);
        let hasMore = nextPosts.length > 0;
        this.updateHistoryNav(page, hasMore);

        this.setState({posts: post_slice});
      });
  }

  updateHistoryNav(page, hasMore) {
    let prefix = "";
    if (this.params.tag) {
      prefix = "/tag/" + this.params.tag;
    }

    // Update prev state
    let prev = null;
    if (page === 1) {
      prev = "/";
    } else if (page > 1) {
      prev = prefix + "/page/" + (page - 1);
    } else {
      prev = null;
    }

    // Update next state
    let next = null;
    if (hasMore) {
      next = prefix + "/page/" + (page + 1);
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
