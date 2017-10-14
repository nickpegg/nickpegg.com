#!/usr/bin/env python

"""
CLI command to manage my site

Imports posts from Posty, builds YAML files into JSON blobs, etc.

This may be the start of Posty 2.0, who knows.
"""

import click
from dateutil import parser as date_parser
import json
import markdown
import os
import shutil
import sys
import yaml


@click.group()
def cli():
    pass


@cli.command()
def init():
    """
    Initialize a site in the current directory
    """
    for directory in ('_media', '_pages', '_posts'):
        if not os.path.exists(directory):
            os.mkdir(directory)


@cli.command()
@click.option(
    '--path',
    help='Path to output JSON file',
    default='site.json',
    show_default=True
)
def build(path):
    """
    Build posts and pages JSON files

    Takes all of the YAML in _pages and _posts, combines them into JSON blobs
    and writes them out to disk.
    """
    if not all([os.path.exists('_pages'), os.path.exists('_posts')]):
        raise click.UsageError('You must run `init` first!')

    tags = set()
    blob = {
        'pages': [],
        'posts': [],
        'tags': [],
    }

    pages = []
    for filename in os.listdir('_pages'):
        contents = open(os.path.join('_pages', filename)).read()
        _, meta_yaml, body = contents.split("---\n")
        page = yaml.load(meta_yaml)

        # page['body'] = render(body.strip())
        page['body'] = body.strip()
        page.setdefault('parent')

        pages.append(page)
    blob['pages'] = sorted(pages, key=lambda x: x['title'].lower())

    posts = []
    for filename in os.listdir('_posts'):
        contents = open(os.path.join('_posts', filename)).read()
        parts = contents.split("---\n")

        post = yaml.load(parts[0])
        post['date'] = post['date'].isoformat()
        post.setdefault('tags', [])

        if len(parts[1:]) == 1:
            post['blurb'] = parts[1]
            post['body'] = parts[1]
        elif len(parts[1:]) == 2:
            post['blurb'] = parts[1]
            post['body'] = "\n".join(parts[1:])
        else:
            raise click.UsageError("Got too many YAML documents in {}".format(filename))

        # post['blurb'] = render(post['blurb'].strip())
        # post['body'] = render(post['body'].strip())
        post['blurb'] = post['blurb'].strip()
        post['body'] = post['body'].strip()

        for tag in post['tags']:
            tags.add(tag)

        posts.append(post)
    blob['posts'] = sorted(posts, key=lambda x: x['date'], reverse=True)

    blob['tags'] = list(tags)

    with open(path, 'w') as f:
        f.write(json.dumps(blob))


@cli.command()
@click.option(
    '--path',
    help='path to the Posty site',
    required=True
)
def posty_import(path):
    """
    Import posts and pages from an existing Posty 1.x site

    All YAML files are read in and in the case of posts, a blurb is generated
    if one doesn't already exist by singling out the first paragraph.
    """
    if not all(os.path.exists('_pages'), os.path.exists('_posts')):
        raise click.UsageError('You must run `init` first!')

    click.echo('Importing site at {} ...'.format(path))

    # Simply copy pages over, nothing special to do
    for page in os.listdir(os.path.join(path, '_pages')):
        orig_path = os.path.join(path, '_pages', page)
        new_path = os.path.join('_pages', page)
        shutil.copy(orig_path, new_path)

    old_posts_path = os.path.join(path, '_posts')
    for post in os.listdir(old_posts_path):
        old_post = open(os.path.join(old_posts_path, post)).read()
        click.echo(post)
        new_post = convert_from_posty(old_post)

        with open(os.path.join('_posts', post), 'w') as f:
            f.write(new_post)

    click.echo('Done!')


# Utility functions
def convert_from_posty(old_post):
    """
    Converts an old Posty post (a string) into a new-style post with a blurb
    and everything. Returns a string containing the three YAML documents.
    """
    old_post = old_post.replace("\r\n", "\n")
    docs = old_post.split("---\n")
    new_post = ''

    # Convert the metadata
    meta = yaml.load(docs[1])
    meta.setdefault('tags', [])
    new_post += yaml.dump(meta)

    # Create a blurb out of the first paragraph
    body = docs[2].strip().split("\n\n")
    blurb = body[0]
    rest_of_post = "\n\n".join(body[1:])

    new_post += "---\n"
    new_post += blurb

    # Drop in the rest of the post
    new_post += "\n---\n"
    new_post += rest_of_post

    return new_post


def render(thing):
    """
    Renders a specific thing using Markdown
    """
    return markdown.markdown(thing, extensions=[
        'markdown.extensions.fenced_code',
    ])


if __name__ == '__main__':
    cli()
