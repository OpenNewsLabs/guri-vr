
import { h, Component } from 'preact'

export default class SplitPoint extends Component {
  componentWillMount () {
    this.fetchComponent()
  }

  componentWillReceiveProps () {
    console.log(this.props)
    this.fetchComponent()
  }

  fetchComponent () {
    let cb = this.linkState('child')
    const r = this.props.load()
    r.then ? r.then(cb) : cb(r)
  }

  render (props, { child }) {
    return child ? h(child.default, props) : <div class='loader'></div>
  }
}
