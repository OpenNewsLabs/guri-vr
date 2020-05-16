
import { h, Component } from 'preact'
import Router from 'preact-router'
import AsyncRoute from 'preact-async-route'
import { style } from 'glamor'
import guri, { user } from 'services/guri'

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = { user }
  }

  componentWillMount () {
    guri.on('login', user => this.setState({ user }))
    guri.on('logout', () => this.setState({ user: null }))
  }

  render (props, { user }) {
    return (
      <div {...styles.container}>
        <Router>
          <AsyncRoute path='/' getComponent={() => System.import('components/Home').then(module => module.default)} />
          <AsyncRoute path='/guide' getComponent={() => System.import('components/Guide').then(module => module.default)} />
          <AsyncRoute path='/login' getComponent={() => System.import('components/Login').then(module => module.default)} />
          <AsyncRoute path='/stories' getComponent={() => System.import('components/StoryList').then(module => module.default)} />
          <AsyncRoute path='/stories/:id' getComponent={() => System.import('components/StoryEditor').then(module => module.default)} />
        </Router>
      </div>
    )
  }
}

const styles = {
  container: style({
    minWidth: '100%'
  })
}
