
import { h, Component } from 'preact';
import { Button } from 'preact-mdl';
import { route } from 'preact-router';
import Radium from 'radium';
import { user } from 'services/guri';
import nlp from 'services/nlp';
import Editor from 'components/Editor';
import Previewer from 'components/Previewer';

const defaultEditorText = `
You not need to be a coder to create VR experiences. The GuriVR editor interprets your words and creates the world you described.

Try adding some scenes. For example my first scene will last 500 seconds and display the following text: "Guri is cooooool!" and a panorama located at https://s3.amazonaws.com/gurivr/pano.jpg

Try adding more scenes!

hint: Try with words like audio, panorama, text, videosphere, voiceover and chart.
You can also drag your files into the editor and get back a url 🙀
`;

@Radium
export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: defaultEditorText,
      body: nlp(defaultEditorText)
    };
  }

  onInput(text) {
    try {
      this.setState({
        text,
        body: nlp(text)
      });
    } catch(err) {
      this.setState({ text });
    }
  }

  goToCreate() {
    if (user) {
      route('/stories/create');
    } else {
      route('/login');
    }
  }

  render(props, { text, body }) {
    return (
      <div style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.title}>GuriVR</h1>
          <p style={styles.tagline}>Describe how do you want to tell your VR experience and will do the rest</p>
          <Button style={styles.callToAction} onClick={this.goToCreate} colored raised>
            {user ? 'Create a story' : 'Login to create a story'}
          </Button>
        </div>
        <div style={styles.features}>
          <div>
            <h4>Use your own words</h4>
            <div style={styles.featureDescription}>
              <div style={styles.featureItem}>
                <Editor value={text} onInput={this.onInput.bind(this)} />
              </div>
              <div style={styles.featureItem}>
                <Previewer height={300} style={styles.preview} body={body} />
              </div>
            </div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureItem}>
              <h4>Share it everywhere</h4>
              <div style={styles.featureDescription}>
                <p style={styles.featureText}>GuriVR uses <a href="https://webvr.info">WebVR</a>, the Web Open Standard for the Virtual Reality World. This works on modern web browsers, Google Cardboard and Oculus rift among others. It also fallback for desktop browsers using drag controls. You can share your experiences as standalone websites or inside your site as an iframe.</p>
              </div>
            </div>
            <div style={styles.featureItem}>
              <h4>Open source</h4>
              <p style={styles.featureText}>This is an  <a href="https://github.com/opennewslabs/guri-vr">open source project</a> created as part of a <a href="https://opennews.org/what/fellowships/">Knight-Mozilla fellowship</a>. You can contribute and/or propose ideas you have for this project.</p>
            </div>
          </div>
        </div>
        <footer style={styles.footer}>Made with ♥️ by <a href="https://twitter.com/impronunciable">Dan Zajdband</a></footer>
      </div>
    );
  }
}

const styles = {
  container: {
    width: '90vw',
    margin: '0 5vw'
  },
  hero: {
    margin: '0 auto',
    textAlign: 'center',
    paddingBottom: 50
  },
  title: {
    marginBottom: 0
  },
  tagline: {
    fontSize: '1.3em'
  },
  callToAction: {
    marginTop: 15
  },
  feature: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  features: {
    marginBottom: 50,
    flexWrap: 'wrap'
  },
  featureDescription: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  featureItem: {
    flex: 1,
    minWidth: 350,
    textAlign: 'justify'
  },
  footer: {
    marginBottom: 20,
    textAlign: 'center'
  },
  featureText: {
    padding: 10
  },
  preview: {
    textAlign: 'left'
  }
};
