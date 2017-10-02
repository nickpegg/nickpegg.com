import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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

class RouterListLink extends Component {
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
  render() {
    // TODO: populate these dynamically based on root page names
    // but keep Home first and RSS at the end
    return (
      <Row>
        <ul>
          <RouterListLink name="Home" href="/" />
          <RouterListLink name="About" href="/about" />
          <RouterListLink name="Projects" href="/projects" />
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
    let left = "";
    if (!this.props.newest) {
      left = (
          <a href="">
            <Icon name="arrow-left" />
            <span> newer posts</span>
          </a>
      )
    }
    return (
      <Row>
        { left }
        <a className="u-pull-right" href="">
          <span>older posts </span>
          <Icon name="arrow-right" />
        </a>
      </Row>
    );
  }
}

const HistoryNavStart = ({match}) => (
  <HistoryNav newest />
)

export { ListLink, NavList, TagNav, HistoryNav, HistoryNavStart };
