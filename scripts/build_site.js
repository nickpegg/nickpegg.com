#!/usr/bin/env node

'use strict';
const fs = require('mz/fs');
const path = require('path');
const yaml = require('js-yaml');


async function build() {
  let site = {
    pages: [],
    posts: [],
    tags: [],
  };

  site.pages = await fs.readdir('_pages')
    .then(files => (
      Promise.all(files.map(f => fs.readFile(path.join('_pages', f), 'utf8')))
    ))
    .then(files => {
      return files.map(contents => {
        let [_, meta, body] = contents.split("---\n");
        let page = yaml.safeLoad(meta);

        if (page.parent === undefined) {
          page.parent = null;
        }

        page.body = body.trim();
        return page;
      })
    })
    .catch(err => console.log('Failure while fetching pages:', err));

  [site.posts, site.tags] = await fs.readdir('_posts')
    .then(files => (
      Promise.all(files.map(f => fs.readFile(path.join('_posts', f), 'utf8')))
    ))
    .then(files => {
      let tags = new Set();
      let posts = files.map(contents => {
        let parts = contents.split("---\n");
        let post = yaml.safeLoad(parts[0]);

        if (parts.length === 2) {
          post.blurb = parts[1];
          post.body = post.blurb;
        } else if (parts.length === 3) {
          post.blurb = parts[1];
          post.body = parts.slice(1).join("\n");
        }

        if (post.tags === undefined) {
          post.tags = [];
        }

        post.tags.forEach(tag => {
          tags.add(tag);
        });

        return post;
      })

      return [posts, tags];
    })
    .catch(err => console.log('Failure while fetching posts:', err));

  site.pages.sort((a, b) => a.title.localeCompare(b.title));
  // sort posts newest to oldest
  site.posts.sort((a, b) => (b.date - a.date));
  site.tags = Array.from(site.tags.values());

  fs.writeFile('public/site.json', JSON.stringify(site))
    .catch(err => console.log('Unable to write site.json:', err));
}

build();
