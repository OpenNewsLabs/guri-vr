
import { h, Component } from 'preact';
import { Button, TextField } from 'preact-mdl';
import Radium from 'radium';
import { route } from 'preact-router';
import nlp from 'services/nlp';
import { fetchStory, createStory, updateStory } from 'services/datalayer';
import Previewer from 'components/Previewer';
import Editor from 'components/Editor';

const defaultText =
`

This is the GuriVR editor 🎉. You can create your VR experience by describing how you would like it to be. Every paragraph will be a scene as soon as you mention the duration. Let's start with an example:

My first scene lasts 5 seconds and has a text that says "This is my first scene. This is amazing!".

The second is 30 seconds and have just a panorama located at https://ucarecdn.com/8e6da182-c794-4692-861d-d43da2fd5507/ along with the audio https://ucarecdn.com/49f6a82b-30fc-4ab9-80b5-85f286d67830/

hint: Try with words like audio, panorama, text, videosphere, voiceover and chart
`;

@Radium
export default class StoryEditor extends Component {
  constructor(props) {
    super(props);
    const id = props.matches.id !== 'create' ? props.matches.id : null;
    const initialText = id ? '' : defaultText;

    this.state = {
      body: nlp(initialText),
      title: 'Untitled story',
      text: initialText,
      _id: id,
      loading: !!id
    };

    if (id) {
      fetchStory(id)
        .then(story =>
          this.setState(Object.assign({}, this.state, story, { loading: false })))
        .catch(error => this.setState({ loading: false }));
    }
  }

  onEditorChange(text) {
    try {
      this.setState({
        text,
        body: nlp(text)
      });
    } catch(err) {
      this.setState({ text });
    }
  }

  onSave() {
    const { body, title } = this.state;

    if (!title.length) return;

    if (this.state._id) {
      updateStory(this.state)
        .then(story => this.setState(Object.assign({}, this.state, story)));
    } else {
      createStory(this.state)
        .then(story => {
          this.setState(Object.assign({}, this.state, story));
          route(`/stories/${story._id}`);
        });
    }
  }

  onChangeTitle(evt) {
    this.setState({ title: evt.target.value });
  }

  onPreview() {
    const { body, title } = this.state;
    open(`/api/preview?title=${title}&body=${JSON.stringify(body)}`, '_blank');
  }

  onShare() {
    const { _id } = this.state;
    open(`https://s3.amazonaws.com/gurivr/s/${_id}.html`, '_blank');
  }

  render({ matches }, { text, body, title, _id, loading }) {
    return (
      <div style={styles.container}>
        {!loading ? <Editor value={text} onInput={this.onEditorChange.bind(this)} /> : null}
        <Previewer body={body} />
        <Toolbar onSave={this.onSave.bind(this)}
          onPreview={this.onPreview.bind(this)}
          onChangeTitle={this.onChangeTitle.bind(this)}
          title={title}
          id={_id}
          onShare={this.onShare.bind(this)} />
      </div>
    );
  }
}

const Toolbar = ({ onSave, onPreview, onShare, title, onChangeTitle, id }) => (
  <footer style={styles.toolbarContainer}>
    <div>
      <TextField label="title" floatingLabel={true} value={title} onChange={onChangeTitle} required />
      <Button onClick={onSave} colored>Save</Button>
    </div>
    <div>
      { id ? <Button onClick={onShare} colored>Share link</Button> : null }
      <Button onClick={onPreview} colored>Fullscreen preview</Button>
    </div>
  </footer>
);

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
};
