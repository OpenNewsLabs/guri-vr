
import { h, Component } from 'preact'
import Radium from 'radium'
import CodeExample from 'components/CodeExample'
import t from 'services/i18n'

@Radium
export default class Guide extends Component {

  render () {
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
          <CodeExample text={t('guide.scenes.preview')} />

          <p>{t('guide.scenes.second')}</p>
          <p>{t('guide.scenes.third')}</p>
        </section>
        <section>
          <h3>{t('guide.entities.title')}</h3>
          <p>{t('guide.entities.first')}</p>
          <p>{t('guide.entities.second')}</p>
          <CodeExample
            title={t('guide.entities.title')}
            text={t('guide.entities.preview')} />
          <p>{t('guide.entities.third')}</p>
        </section>
        <section>
          <h4>{t('guide.audio.title')}</h4>
          <p>{t('guide.audio.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>{t('guide.audio.keywords')}</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | {t('guide.entities.required')}</li>
            <li><span style={styles.attr}>position</span> (left, right, front, behind) | {t('guide.entities.optional')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Audio example'
            text={t('guide.audio.preview')} />
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
            text={t('guide.panorama.preview')} />
        </section>
        <section>
          <h4>{t('guide.videosphere.title')}</h4>
          <p>{t('guide.videosphere.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>{t('guide.videosphere.keywords')}</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | {t('guide.entities.required')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Videosphere example'
            text={t('guide.videosphere.preview')} />
        </section>
        <section>
          <h4>{t('guide.image.title')}</h4>
          <p>{t('guide.image.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>{t('guide.image.keywords')}</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | {t('guide.entities.required')}</li>
            <li><span style={styles.attr}>position</span> (right, left, behind, front) | {t('guide.entities.optional')}</li>
            <li><span style={styles.attr}>scale</span> (tiny, small, large, huge) | {t('guide.entities.optional')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Image example'
            text={t('guide.image.preview')} />
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
            text={t('guide.video.preview')} />
        </section>
        <section>
          <h4>{t('guide.text.title')}</h4>
          <p>{t('guide.text.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>{t('guide.text.keywords')}</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>text</span> (string) | {t('guide.entities.required')}</li>
            <li><span style={styles.attr}>position</span> (right, left, behind, front) | {t('guide.entities.optional')}</li>
            <li><span style={styles.attr}>scale</span> (tiny, small, large, huge) | {t('guide.entities.optional')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Text example'
            text={t('guide.text.preview')} />
        </section>
        <section>
          <h4>{t('guide.duration.title')}</h4>
          <p>{t('guide.duration.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>{t('guide.duration.keywords')}</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>duration</span> (number) | {t('guide.entities.required')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Duration example'
            text={t('guide.duration.preview')} />
        </section>
        <section>
          <h4>{t('guide.voiceover.title')}</h4>
          <p>{t('guide.voiceover.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>{t('guide.voiceover.keywords')}</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>text</span> (string) | {t('guide.entities.required')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Voiceover example'
            text={t('guide.voiceover.preview')} />
        </section>
        <section>
          <h4>{t('guide.chart.title')}</h4>
          <p dangerouslySetInnerHTML={{ __html: t('guide.chart.description') }}></p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>{t('guide.chart.keywords')}</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | {t('guide.entities.required')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Chart example'
            text={t('guide.chart.preview')} />
        </section>
        <section>
          <h4>{t('guide.background.title')}</h4>
          <p>{t('guide.background.description')}</p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>{t('guide.background.keywords')}</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>color</span> (string or hex color) | {t('guide.entities.required')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Background example'
            text={t('guide.background.preview')} />
        </section>
        <section>
          <h4>{t('guide.3dmodel.title')}</h4>
          <p dangerouslySetInnerHTML={{ __html: t('guide.3dmodel.description') }}></p>
          <p>{t('guide.entities.keywords')}: <span style={styles.attr}>{t('guide.3dmodel.keywords')}</span></p>
          <p>{t('guide.entities.attributes')}:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | {t('guide.entities.required')}</li>
          </ul>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='Model example'
            text={t('guide.3dmodel.preview')} />
        </section>
        <section>
          <h3>{t('guide.ar.title')}</h3>
          <p>{t('guide.ar.description')}</p>
          <p>{t('guide.entities.example')}</p>
          <CodeExample title='AR mode example' text={t('guide.ar.preview')} />
        </section>
        <section>
          <h3>{t('guide.sharing.title')}</h3>
          <p>
            {t('guide.sharing.first')}

            <div style={styles.embed}>
              <iframe src='https://s3.amazonaws.com/gurivr/s/87298957f8e8d6a3696098d8.html' width='100%' height='300'></iframe>
            </div>

            <span dangerouslySetInnerHTML={{ __html: t('guide.sharing.second') }}></span>

            <div style={styles.embed}>
              <blockquote class='twitter-tweet' data-lang='en'><p lang='en' dir='ltr'><a href='https://twitter.com/impronunciable'>@impronunciable</a> your scene is here <a href='https://t.co/n2O4S2OTh7'>https://t.co/n2O4S2OTh7</a></p>&mdash; Guri VR (@guri_vr) <a href='https://twitter.com/guri_vr/status/751870382219599872'>July 9, 2016</a></blockquote>
              <script async src='//platform.twitter.com/widgets.js' charset='utf-8'></script>
            </div>
          </p>
        </section>
      </article>
    )
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
}
