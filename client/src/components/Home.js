
import { h, Component } from 'preact'
import { route } from 'preact-router'
import { user } from 'services/guri'
import { style } from 'glamor'
import nlp from 'services/nlp'
import Editor from 'components/Editor'
import Previewer from 'components/Previewer'
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
        <h2 {...styles.hero} dangerouslySetInnerHTML={{ __html: t('home.intro.tagline') }}></h2>
      </div>
    )
  }
}

const styles = {
  container: style({
    width: '90vw',
    margin: '0 5vw'
  }),

  hero: style({
    fontFamily: '\'Shrikhand\', cursive',
    color: '#FFDF00',
    textAlign: 'center',
    fontSize: 36,
    margin: 0,
    paddingTop: 50
  })
}
