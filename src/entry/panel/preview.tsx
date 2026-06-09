if (typeof window !== 'undefined' && (!window.chrome || !window.chrome.runtime || !window.chrome.runtime.id)) {
  (window as any).chrome = {
    runtime: {
      id: 'mock-extension-id'
    }
  };
}

import { render } from 'preact';
import App from './App';
import '@src/index.css';

const root = document.getElementById('root');

if (root) {
  render(<App />, root);
}
