
import { h, Component } from 'preact'
import { route } from 'preact-router'
import { user } from 'services/guri'
import { style } from 'glamor'
import nlp from 'services/nlp'
import Hero from 'components/Home/Hero'
import Oss from 'components/Home/Oss'
import Templates from 'components/Home/Templates'
import Share from 'components/Home/Share'
import Header from 'components/Home/Header'
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
    this.applyTemplate = this.applyTemplate.bind(this)
  }

  onInput (text, template = false) {
    try {
      this.setState({
        text,
        body: nlp(text),
        mode: /ar mode|modo ra/gi.test(text) ? 'ar' : 'vr',
        template
      })
    } catch (err) {
      this.setState({ text })
    }
  }

  applyTemplate (text) {
    this.onInput(text, true)
    if (window.scrollY >= 600) {
      window.scrollTo(0, 200)
    }
  }

  goToCreate () {
    if (user) {
      route('/stories/create')
    } else {
      route('/login')
    }
  }

  render (props, { text, body, mode, template }) {
    return (
      <div {...styles.container}>
        <Header user={user} />
        <div {...styles.main}>
          <Hero template={template} body={body} text={text} mode={mode}
            onInput={this.onInput} />
          <Templates onChange={this.applyTemplate} />
          <Oss />
          <Share />
          <Footer />
        </div>
      </div>
    )
  }
}

const styles = {
  container: style({
    backgroundColor: '#673AB7',
    overflowX: 'hidden'
  }),

  main: style({
    backgroundColor: '#673AB7'
  })
}
