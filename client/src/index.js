
import 'material-design-lite'
import 'isomorphic-fetch'
import { h, render } from 'preact'
import App from 'components/App'
import 'services/i18n'
import { install as offlineInstall } from 'offline-plugin/runtime'
import bus from 'services/guri'

bus.on('renderApp', () => render(<App />, document.getElementById('root'), document.getElementById('root').firstChild))
offlineInstall()
