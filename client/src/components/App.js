
import { h, Component } from 'preact'
import Router from 'preact-router'
import { style } from 'glamor'
import guri, { user } from 'services/guri'
import SplitPoint from 'components/SplitPoint'

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
          <SplitPoint key={0} path='/' load={() => System.import('components/Home')} />
          <SplitPoint key={1} path='/guide' load={() => System.import('components/Guide')} />
          <SplitPoint key={2} path='/login' load={() => System.import('components/Login')} />
          <SplitPoint key={3} path='/stories' load={() => System.import('components/StoryList')} />
          <SplitPoint key={4} path='/stories/:id' load={() => System.import('components/StoryEditor')} />
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
