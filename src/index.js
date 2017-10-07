import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { unregister as unregisterServiceWorker } from './registerServiceWorker';

import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));

// Disable the service worker to disable caching for now
// registerServiceWorker();
unregisterServiceWorker();
