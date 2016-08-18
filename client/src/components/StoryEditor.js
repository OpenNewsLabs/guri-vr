
import { h, Component } from 'preact'
import { Button, TextField } from 'preact-mdl'
import Radium from 'radium'
import { route } from 'preact-router'
import nlp from 'services/nlp'
import { fetchStory, createStory, updateStory } from 'services/datalayer'
import Previewer from 'components/Previewer'
import Editor from 'components/Editor'
import { assetsHost } from 'services/config'
import t from 'services/i18n'

@Radium
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
        mode: /ar mode/gi.test(text) ? 'ar' : 'vr'
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
      <div style={styles.container}>
        {!loading ? <Editor value={text} onInput={this.onEditorChange.bind(this)} /> : null}
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

const Toolbar = ({ onSave, onPreview, onShare, title, onChangeTitle, id }) => (
  <footer style={styles.toolbarContainer}>
    <div>
      <TextField label={t('editor.title')} value={title} onChange={onChangeTitle} required floatingLabel />
      <Button onClick={onSave} colored>{t('editor.save')}</Button>
    </div>
    <div>
      {id ? <Button onClick={onShare} colored>{t('editor.share')}</Button> : null}
      <Button onClick={onPreview} colored>{t('editor.preview')}</Button>
    </div>
  </footer>
)

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1
  },
  toolbarContainer: {
    backgroundColor: '#eee',
    display: 'flex',
    padding: '0 10px',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}
