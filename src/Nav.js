import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Icon from 'react-fontawesome';

import { Row } from './skeleton';
import { slugify } from './util';


class ListLink extends Component {
  render () {
    let icon = null;
    if (this.props.icon) {
      icon = <Icon name={ this.props.icon } />
    }

    return (
      <li> <Link to={ this.props.href }>{ icon } { this.props.name }</Link> </li>
    );
  }
}

class NavList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageLinks: null,
    }
  }

  componentDidMount() {
    fetch('/site.json')
      .then(resp => resp.json())
      .then(blob => {
        let links = [];
        for (let page of blob.pages) {
          let slug = page.slug;
          if (!slug) {
            slug = slugify(page.title);
          }

          if (page.parent == null) {
            let href = "/" + slug;
            links.push(<ListLink
              name={page.title}
              href={href}
              key={slug}
            />);
          }
        }

        this.setState({pageLinks: links});
      });
  }
  render() {
    return (
      <Row>
        <ul>
          <ListLink name="Home" href="/" />
          { this.state.pageLinks }
          <ListLink name="RSS" href="/rss.xml" icon="rss-square" />
        </ul>
      </Row>
    );
  }
}

class TagNav extends Component {
  constructor (props) {
    super(props);

    // TODO: fetch this number from config
    // Number of top tags to display
    this.numTop = 5;

    this.state = {
      topTags: [],
    }
  }

  fetchTopTags () {
    fetch('/site.json')
      .then(resp => resp.json())
      .then(blob => {
        let counts = new Map();

        // Count up the tags
        blob.posts.forEach(post => {
          post.tags.forEach(tag => {
            let count = counts.get(tag);
            if (count === undefined) {
              count = 0;
            }

            counts.set(tag, count + 1);
          });
        });

        // Sort the tags
        let tags = [...counts.entries()];
        tags.sort(function(t1, t2) {
          let tag1 = t1[0];
          let tag2 = t2[0];
          let count1 = t1[1];
          let count2 = t2[1]

          let diff = count2 - count1;

          if (diff !== 0) {
            return diff
          } else {
            // We have a tie, sort by the strings
            return tag1.localeCompare(tag2);
          }
        });

        // Get just the tag names
        tags = tags.map(t => t[0]);

        // Get top N
        tags = tags.slice(0, this.numTop);

        this.setState({topTags: tags});
      });
  }

  componentDidMount() {
    this.fetchTopTags();
  }

  render() {
    let tags = "";
    if (this.state.topTags.length > 0) {
      tags = (
        <div>
          <h5 className="nav-header">Top Tags</h5>
          <ul>
            {this.state.topTags.map(tag => (
              <ListLink icon="tag" key={tag} name={tag} href={"/tag/" + tag} />
            ))}
          </ul>
        </div>
      );
    }

    return (
      <Row>
        { tags }
      </Row>
    );
  }
}

const HistoryNav = (props) => {
  let left = "";
  let right = "";

  if (props.prev) {
    left = (
      <Link to={props.prev}>
        <Icon name="arrow-left" />
        <span> newer posts</span>
      </Link>
    );
  }

  if (props.next) {
    right = (
      <Link className="u-pull-right" to={props.next}>
        <span>older posts </span>
        <Icon name="arrow-right" />
      </Link>
    );
  }

  return (
    <Row>
      { left }
      { right }
    </Row>
  )
}

export { ListLink, NavList, TagNav, HistoryNav };
