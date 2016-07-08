
import 'material-design-lite';
import 'isomorphic-fetch';
import { h, render } from 'preact';
import App from 'components/App';

render(<App />, document.getElementById('root'));

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
}

