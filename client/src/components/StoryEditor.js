
import { h, Component } from 'preact'
import { route, Link } from 'preact-router'
import { style } from 'glamor'
import nlp from 'services/nlp'
import { fetchStory, createStory, updateStory } from 'services/datalayer'
import Previewer from 'components/Previewer'
import Editor from 'components/Editor'
import Logo from 'components/Logo'
import Navbar from 'components/Navbar'
import LangSwitch from 'components/LangSwitch'
import { assetsHost } from 'services/config'
import t from 'services/i18n'

export default class StoryEditor extends Component {
  constructor (props) {
    super(props)
    const id = props.matches.id !== 'create' ? props.matches.id : null
    const initialText = id ? '' : t('editor.initial_text')

    this.state = {
      body: nlp(initialText),
      title: t('editor.initial_title'),
      text: initialText,
      mode: 'vr',
      _id: id,
      loading: !!id
    }

    if (id) {
      fetchStory(id)
        .then(story => this.setState(Object.assign({}, this.state, story, { loading: false })),
              () => this.setState({ loading: false }))
    }
  }

  onEditorChange (text) {
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

  onSave () {
    const { title } = this.state

    if (!title.length) {
      window.alert(t('editor.title_missing'))
      return
    }

    if (this.state._id) {
      updateStory(this.state)
        .then(story => this.setState(Object.assign({}, this.state, {_id: story._id})))
    } else {
      createStory(this.state)
        .then(story => {
          this.setState(Object.assign({}, this.state, { _id: story._id }))
          route(`/stories/${story._id}`)
        }).then(() => console.log(this.state, 'state'))
    }
  }

  onChangeTitle (evt) {
    this.setState({ title: evt.target.value })
  }

  onPreview () {
    const { body, title, mode } = this.state
    window.open(`/api/preview?title=${title}&mode=${mode}&body=${JSON.stringify(body)}`, '_blank')
  }

  onShare () {
    const { _id } = this.state
    window.open(`${assetsHost}/s/${_id}.html`, '_blank')
  }

  render ({ matches }, { text, body, title, _id, loading, mode }) {
    return (
      <div {...styles.container}>
        <Header />
        {!loading ? <div><Editor value={text} onInput={this.onEditorChange.bind(this)} /></div> : null}
        <Previewer body={body} mode={mode} />
        <Toolbar onSave={this.onSave.bind(this)}
          onPreview={this.onPreview.bind(this)}
          onChangeTitle={this.onChangeTitle.bind(this)}
          title={title}
          id={_id}
          onShare={this.onShare.bind(this)} />
      </div>
    )
  }
}

const Header = () => (
  <header {...styles.header}>
    <div {...styles.logoContainer}>
    <Link href='/'><Logo width='75' color='#fff' /></Link>
    </div>
    <div {...styles.navigation}>
      <Navbar color='#898989' activeColor='#ccc' />
      <div {...styles.switchContainer}>
        <LangSwitch />
      </div>
    </div>
  </header>
)

const Toolbar = ({ onSave, onPreview, onShare, title, onChangeTitle, id }) => (
  <footer {...styles.toolbarContainer}>
    <div>
      <input {...styles.title} type='text' placeholder={t('editor.title')}
        value={title} onChange={onChangeTitle} required />
      <button {...styles.button} onClick={onSave}>{t('editor.save')}</button>
    </div>
    <div>
      {id ? <button {...styles.button} onClick={onShare}>{t('editor.share')}</button> : null}
      <button {...styles.button} onClick={onPreview}>{t('editor.preview')}</button>
    </div>
  </footer>
)

const styles = {
  container: style({
    display: 'flex',
    flexDirection: 'column',
    flex: 0,
    height: '100vh'
  }),

  toolbarContainer: style({
    backgroundColor: '#eee',
    display: 'flex',
    padding: '0 10px',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    '@media(max-width: 500px)': {
      flexDirection: 'column',
      height: 120,
      alignItems: 'space-between',
      justifyContent: 'space-between'
    }
  }),

  logo: style({
    width: 220,
    height: 104,
    fill: '#5A33A2',
    '@media(max-width: 500px)': {
      width: 60,
      height: 30
    }
  }),

  navigation: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 30,
    '@media(max-width: 500px)': {
      display: 'none'
    }
  }),

  header: style({
    display: 'flex',
    backgroundColor: '#282C34',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    '@media(max-width: 500px)': {
      padding: 0
    }
  }),

  logoContainer: style({
    '@media(max-width: 500px)': {
      margin: '0 auto'
    }
  }),

  switchContainer: style({
    marginLeft: 30,
    height: 30
  }),

  title: style({
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #5A33A2',
    fontSize: 18,
    '@media(max-width: 500px)': {
      fontSize: 13
    }
  }),

  button: style({
    border: 'none',
    color: '#5A33A2',
    backgroundColor: 'transparent',
    fontSize: 18,
    cursor: 'pointer',
    marginLeft: 20,
    '@media(max-width: 500px)': {
      fontSize: 13
    }
  })
}
