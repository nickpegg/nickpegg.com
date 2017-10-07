import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <article>
    <header>
      <h1>404 Oh No!</h1>
    </header>
    <section>
      <p>
        You're lost, bud. Why not try going back <Link to="/">Home</Link>?
      </p>
    </section>
  </article>
)

export { NotFound }
