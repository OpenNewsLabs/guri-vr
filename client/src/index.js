
import 'material-design-lite';
import 'isomorphic-fetch';
import { h, render } from 'preact';
import App from 'components/App';
import { install as offlineInstall } from 'offline-plugin/runtime';

render(<App />, document.getElementById('root'));

offlineInstall();
