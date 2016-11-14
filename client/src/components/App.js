
import { h, Component } from 'preact'
import Router from 'preact-router'
import { style } from 'glamor'
import guri, { user } from 'services/guri'
import Header from 'components/Header'
import Home from 'components/Home'
import Login from 'components/Login'
import StoryList from 'components/StoryList'
import StoryEditor from 'components/StoryEditor'
import Guide from 'components/Guide'

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
        <Header user={user} />
        <Router>
          <Home path='/' />
          <Guide path='/guide' />
          <Login path='/login' />
          <StoryList path='/stories' />
          <StoryEditor path='/stories/:id' />
        </Router>
      </div>
    )
  }
}

const styles = {
  container: style({
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: '#673AB7'
  })
}
