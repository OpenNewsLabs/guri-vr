
import { h, Component } from 'preact'
import { route } from 'preact-router'
import { user } from 'services/guri'
import { style } from 'glamor'
import nlp from 'services/nlp'
import Hero from 'components/Home/Hero'
import Oss from 'components/Home/Oss'
import Templates from 'components/Home/Templates'
import Share from 'components/Home/Share'
import Footer from 'components/Home/Footer'
import t from 'services/i18n'

export default class Home extends Component {
  constructor (props) {
    super(props)
    const defaultEditorText = t('home.preview.text')

    this.state = {
      text: defaultEditorText,
      body: nlp(defaultEditorText),
      mode: 'vr'
    }

    this.onInput = this.onInput.bind(this)
  }

  onInput (text) {
    try {
      this.setState({
        text,
        body: nlp(text),
        mode: /ar mode|modo ra/gi.test(text) ? 'ar' : 'vr'
      })
    } catch (err) {
      this.setState({ text })
    }
  }

  goToCreate () {
    if (user) {
      route('/stories/create')
    } else {
      route('/login')
    }
  }

  render (props, { text, body, mode }) {
    return (
      <div {...styles.container}>
        <Hero body={body} mode={mode} onInput={this.onInput} />
        <Templates />
        <Oss />
        <Share />
        <Footer />
      </div>
    )
  }
}

const styles = {
  container: style({
    overflowX: 'hidden'
  })
}
