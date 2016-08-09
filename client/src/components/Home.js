
import { h, Component } from 'preact';
import { Button } from 'preact-mdl';
import { route } from 'preact-router';
import Radium from 'radium';
import { user } from 'services/guri';
import nlp from 'services/nlp';
import Editor from 'components/Editor';
import Previewer from 'components/Previewer';
import t from 'services/i18n';

const defaultEditorText = `
You not need to be a coder to create VR experiences. The GuriVR editor interprets your words and creates the world you described.

Try adding some scenes. For example my first scene will last 500 seconds and display an image located at https://s3.amazonaws.com/gurivr/logo.svg along with a text saying: "Guri is cool!" to my left and a panorama located at https://s3.amazonaws.com/gurivr/pano.jpg

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
      body: nlp(defaultEditorText),
      mode: 'vr'
    };
  }

  onInput(text) {
    try {
      this.setState({
        text,
        body: nlp(text),
        mode: /ar mode/gi.test(text) ? 'ar' : 'vr'
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

  render(props, { text, body, mode }) {
    return (
      <div style={styles.container}>
        <div style={styles.hero}>
          <h1 style={styles.title}>GuriVR</h1>
          <p style={styles.tagline}>{t('home.intro.tagline')}</p>
          <Button style={styles.callToAction} onClick={this.goToCreate} colored raised>
            {user ? t('home.intro.create') : t('home.intro.login')}
          </Button>
        </div>
        <div style={styles.features}>
          <div>
            <h4>{t('home.preview.title')}</h4>
            <div style={styles.featureDescription}>
              <div style={styles.featureItem}>
                <Editor value={text} onInput={this.onInput.bind(this)} />
              </div>
              <div style={styles.featureItem}>
                <Previewer height={300} style={styles.preview} body={body} mode={mode} />
              </div>
            </div>
          </div>
          <div style={styles.feature}>
            <div style={styles.featureItem}>
              <h4>{t('home.share.title')}</h4>
              <div style={styles.featureDescription}>
                <p style={styles.featureText} dangerouslySetInnerHTML={{ __html: t('home.share.description') }}></p>
              </div>
            </div>
            <div style={styles.featureItem}>
              <h4>{t('home.oss.title')}</h4>
              <p style={styles.featureText} dangerouslySetInnerHTML={{ __html: t('home.oss.description') }}></p>
            </div>
          </div>
        </div>
        <footer style={styles.footer}>{t('home.by')} <a href="https://twitter.com/impronunciable">Dan Zajdband</a></footer>
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
