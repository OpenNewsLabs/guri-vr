
import 'material-design-lite';
import 'isomorphic-fetch';
import { h, render } from 'preact';
import App from 'components/App';
import { loadTranslations } from 'services/i18n';
import { install as offlineInstall } from 'offline-plugin/runtime';

loadTranslations().then(() => render(<App />, document.getElementById('root')));
offlineInstall();
