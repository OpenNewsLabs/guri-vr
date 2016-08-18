
import { h, Component } from 'preact'
import { Layout } from 'preact-mdl'
import Router from 'preact-router'
import Radium from 'radium'
import guri, { user } from 'services/guri'
import Header from 'components/Header'
import Home from 'components/Home'
import Login from 'components/Login'
import StoryList from 'components/StoryList'
import StoryEditor from 'components/StoryEditor'
import Guide from 'components/Guide'

@Radium
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
      <Layout fixed-header js={false}>
        <Header user={user} />
        <Layout.Content style={styles.mainContainer}>
          <Router>
            <Home path='/' />
            <Guide path='/guide' />
            <Login path='/login' />
            <StoryList path='/stories' />
            <StoryEditor path='/stories/:id' />
          </Router>
        </Layout.Content>
      </Layout>
    )
  }
}

const styles = {
  mainContainer: {
    display: 'flex'
  }
}
