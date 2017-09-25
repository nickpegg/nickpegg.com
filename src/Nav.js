import React, { Component } from 'react';

import Icon from 'react-fontawesome';

import { Row } from './skeleton';


class ListLink extends Component {
  render () {
    let icon = null;
    if (this.props.icon) {
      icon = <Icon name={ this.props.icon } />
    }

    return (
      <li> <a href={ this.props.href }>{ icon } { this.props.name }</a> </li>
    );
  }
}

class NavList extends Component {
  render() {
    return (
      <Row>
        <ul>
          <ListLink name="Home" href="/" />
          <ListLink name="About" href="/about" />
          <ListLink name="Projects" href="/projects" />
          <ListLink name="RSS" href="/rss.xml" icon="rss-square" />
        </ul>
      </Row>
    );
  }
}

class TagNav extends Component {
  render() {
    // TODO: Populate these tags from the top tags in the post
    let tags = (
      <ul>
        <ListLink icon="tag" name="Tag 1" href="" />
        <ListLink icon="tag" name="Tag 2" href="" />
        <ListLink icon="tag" name="Really long tag" href="" />
        <ListLink icon="tag" name="Really really really long tag" href="" />
        <ListLink icon="tag" name="Another tag" href="" />
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

class HistoryNav extends Component {
  render() {
    return (
      <Row>
        <a href="">
          <Icon name="arrow-left" />
          <span> newer posts</span>
        </a>
        <a className="u-pull-right" href="">
          <span>older posts </span>
          <Icon name="arrow-right" />
        </a>
      </Row>
    );
  }
}

export { ListLink, NavList, TagNav, HistoryNav };
