
import { h, Component } from 'preact';
import Radium from 'radium';
import CodeExample from 'components/CodeExample';
import t from 'services/i18n';

@Radium
export default class Guide extends Component {

  render() {
    return (
      <article style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.title}>{t('guide.title')}</h2>
        </header>
        <section>
          <h3>{t('guide.introduction.title')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('guide.introduction.first') }}></p>
          <p dangerouslySetInnerHTML={{ __html: t('guide.introduction.second') }}></p>
        </section>
        <section>
          <h3>{t('guide.getting_started.title')}</h3>
          <p dangerouslySetInnerHTML={{ __html: t('guide.getting_started.first') }}></p>
          <p>{t('guide.getting_started.second')}</p>
        </section>
        <section>
          <h3>{t('guide.scenes.title')}</h3>
          <p>{t('guide.scenes.first')}</p>
          <CodeExample text={`
This is my first scene. It lasts 4 seconds, has a skyblue background and shows a text saying "This is the first scene"

This paragraph is never interpreted because I'm not specifying the duration. This paragraphs can be used for talking about different parts of your story without generating scenes.

The last scene lasts 10 seconds and has just a text saying "The End!".
          `} />

          <p>{t('guide.scenes.second')}</p>
          <p>{t('guide.scenes.third')}</p>
        </section>
        <section>
          <h3>{t('guide.entities.title')}</h3>
          <p>{t('guide.entities.first')}</p>
          <p>{t('guide.entities.second')}</p>
          <CodeExample
            title={t('guide.entities.title')}
            text={`
I want my scene to last 30 seconds and to have a green pink background and a picture of a pokemon (why not?) located at https://gurivr.s3.amazonaws.com/c5155f5b-83eb-4729-873b-238abb916362-psyduck.png to my left, and make it tiny please. Also add a text saying "Look to your leeeeeeeft!"
            `} />
            <p>{t('guide.entities.third')}</p>
        </section>
        <section>
          <h4>{t('guide.audio.title')}</h4>
          <p>{t('guide.audio.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>audio | sound</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | {t('guide.entities.required')}</li>
            <li><span style={styles.attr}>position</span> (left, right, front, behind) | {t('guide.entities.optional')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Audio example'
            text={`
I want a  5 seconds scene showing a text saying "Hi!"
Then I want a 40 seconds scene with a white background and an audio located at https://gurivr.s3.amazonaws.com/86474203-6d3d-4d39-9342-5ed63dca56c6-santa.mp3 behind me
`} />
        </section>
        <section>
          <h4>{t('guide.panorama.title')}</h4>
          <p>{t('guide.panorama.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>panorama</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | {t('guide.entities.required')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Panorama example'
            text='My scene is 500 seconds long and shows a panorama located at https://gurivr.s3.amazonaws.com/7ec6043a-3924-4341-96ab-e8df10faaa93-pa.jpg' />
        </section>
        <section>
          <h4>{t('guide.videosphere.title')}</h4>
          <p>{t('guide.videosphere.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>videosphere</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | {t('guide.entities.required')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Videosphere example'
            text='My scene is 30 seconds long and shows a panorama located at https://ucarecdn.com/bcece0a8-86ce-460e-856b-40dac4875f15/ and a voiceover saying "This is the future. I know, is not that good"' />
        </section>
        <section>
          <h4>{t('guide.image.title')}</h4>
          <p>{t('guide.image.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>image | picture</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | {t('guide.entities.required')}</li>
            <li><span style={styles.attr}>position</span> (right, left, behind, front) | {t('guide.entities.optional')}</li>
            <li><span style={styles.attr}>scale</span> (tiny, small, large, huge) | {t('guide.entities.optional')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Image example'
            text='My scene is 500 seconds long, it has blue background, a voiceover saying "Look to your right" and a random picture of a cat from https://gurivr.s3.amazonaws.com/7ec6043a-3924-4341-96ab-e8df10faaa93-pa.jpg to my right' />
        </section>
        <section>
          <h4>{t('guide.video.title')}</h4>
          <p>{t('guide.video.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>video</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | {t('guide.entities.required')}</li>
            <li><span style={styles.attr}>position</span> (right, left, behind, front) | {t('guide.entities.optional')}</li>
            <li><span style={styles.attr}>scale</span> (tiny, small, large, huge) | {t('guide.entities.optional')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Video example'
            text='My scene is 500 seconds long, it has skyblue background and a video from https://s3.amazonaws.com/gurivr/licha.mp4 to my left' />
        </section>
        <section>
          <h4>{t('guide.text.title')}</h4>
          <p>{t('guide.text.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>text</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>text</span> (string) | {t('guide.entities.required')}</li>
            <li><span style={styles.attr}>position</span> (right, left, behind, front) | {t('guide.entities.optional')}</li>
            <li><span style={styles.attr}>scale</span> (tiny, small, large, huge) | {t('guide.entities.optional')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Text example'
            text='My scene is 500 seconds long, it has red background, a text telling me "You can read" and another text that says "Say no more" to my left' />
        </section>
        <section>
          <h4>{t('guide.duration.title')}</h4>
          <p>{t('guide.duration.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>seconds</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>duration</span> (number) | {t('guide.entities.required')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Duration example'
            text='My scene is 8 seconds long, it has blue background and text saying "This will finish soon"' />
        </section>
        <section>
          <h4>{t('guide.voiceover.title')}</h4>
          <p>{t('guide.voiceover.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>voiceover</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>text</span> (string) | {t('guide.entities.required')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Voiceover example'
            text='My scene is 8 seconds long and have a voiceover saying "If you are listening to me, your computer, then your browser supports speech synthesis."' />
        </section>
        <section>
          <h4>{t('guide.chart.title')}</h4>
          <p dangerouslySetInnerHTML={{ __html: t('guide.chart.description') }}></p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>chart</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | {t('guide.entities.required')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Chart example'
            text='My scene is 500 seconds long and have a #eee background and a chart from https://s3.amazonaws.com/gurivr/my-data.json in front of me' />
        </section>
        <section>
          <h4>{t('guide.background.title')}</h4>
          <p>{t('guide.background.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>background</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>color</span> (string or hex color) | {t('guide.entities.required')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Background example'
            text='My scene is 500 seconds long and have a #ccc background and a text saying "Calaaaar"' />
        </section>
        <section>
          <h4>{t('guide.3dmodel.title')}</h4>
          <p dangerouslySetInnerHTML={{ __html: t('guide.3dmodel.description') }}></p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>model</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | {t('guide.entities.required')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Model example'
            text="My scene is 500 seconds long, has skyblue background and a model of some trees from https://s3.amazonaws.com/gurivr/23f1972f-99c6-4f68-a0f0-392c16a02333-trees.dae you can move around with wasd 😎" />
        </section>
        <section>
          <h3>{t('guide.sharing.title')}</h3>
          <p>
            {t('guide.sharing.first')}

            <div style={styles.embed}>
              <iframe src="https://s3.amazonaws.com/gurivr/s/87298957f8e8d6a3696098d8.html" width="100%" height="300"></iframe>
            </div>

            <span dangerouslySetInnerHTML={{ __html: t('guide.sharing.second') }}></span>

            <div style={styles.embed}>
              <blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/impronunciable">@impronunciable</a> your scene is here <a href="https://t.co/n2O4S2OTh7">https://t.co/n2O4S2OTh7</a></p>&mdash; Guri VR (@guri_vr) <a href="https://twitter.com/guri_vr/status/751870382219599872">July 9, 2016</a></blockquote>
              <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
            </div>
          </p>
        </section>
      </article>
    );
  }

}

const styles = {
  container: {
    marginLeft: 50,
    marginRight: 50,
    width: '100vw',
    maxWidth: 800,
    padding: 20,
    margin: '0 auto'
  },
  header: {
    borderBottom: '1px solid #ccc'
  },
  title: {
    textAlign: 'center'
  },
  embed: {
    display: 'flex',
    justifyContent: 'center',
    margin: 15
  },
  attr: {
    backgroundColor: '#eee',
    padding: 3
  }
};
