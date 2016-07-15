
import { h, Component } from 'preact';
import Radium from 'radium';
import codemirror from 'codemirror';
import { uploadAsset } from 'services/datalayer';
import 'codemirror/addon/mode/simple';

@Radium
export default class Editor extends Component {

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    if (this.editor) return this.editor.refresh();
    const { value, onInput } = this.props;

    this.editor = codemirror(this.base, {
      value: String(value),
      theme: 'one-dark',
      lineNumbers: true,
      indentWithTabs: false,
      tabSize: 2,
      indentUnit: 2,
      autofocus: true,
      showCursorWhenSelecting: true,
      lineWrapping: true,
      allowDropFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'audio/mpeg3', 'video/mpeg'],
      mode: 'guri'
    });
    this.editor.setCursor(this.editor.lineCount(), 0)

    onInput(this.editor.getValue());
    setTimeout(() => this.editor.refresh(), 1);

    this.editor.on('change', () => {
      this.value = this.editor.getValue();
      onInput(this.value);
    });

    this.editor.on('drop', (editor, evt) => {
      evt.stopPropagation();
      evt.preventDefault();
      const { files } = evt.dataTransfer;
      if (files && files.length) {
        uploadAsset(files[0])
          .then(({ url }) => {
            this.editor.replaceSelection(url);
            onInput(this.editor.getValue());
          });
      }
    });
  }

  render() {
    return <div style={styles.container} autofocus />;
  }
}

codemirror.defineSimpleMode('guri', {
  start: [
    {
      regex: /(audio|sound|panorama|image|picture|text|videosphere|video|voiceover|chart|model)/,
      token: "atom"
    },
    {
      regex: /([0-9]+) (seconds)/,
      token: ["number", "atom"]
    },
    {
      regex: /(#[a-fA-F0-9]{3,6}|\w) (background)/,
      token: ["string", "atom"]
    },
    {
      regex: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
      token: "string"
    },
    {
      regex: /(right|left|behind|front|tiny|small|large|huge)/,
      token: "string"
    },
    {
      regex: /\".+\"/,
      token: "string"
    }
  ]
});


const styles = {
  container: {
    flex: 0,
    height: 300,
    textAlign: 'left'
  }
};
