import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import slugify from 'slugify';

import Icon from 'react-fontawesome';

import { Row } from './skeleton';


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
            slug = slugify(page.title).toLowerCase();
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

    this.state = {
      topTags: [
        'Tag 1',
        'Tag 2',
        'Really long tag',
        'Really really really long tag',
        'Another tag',
      ],
    }
  }

  topTags () {
  }

  render() {
    // TODO: Populate these tags from the top tags in the post
    let tags = (
      <ul>
        {this.state.topTags.map(tag => (
          <ListLink icon="tag" key={tag} name={tag} href={"/tag/" + tag} />
        ))}
      </ul>
    );

    return (
      <Row>
        <h5 className="nav-header">Top Tags</h5>
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
