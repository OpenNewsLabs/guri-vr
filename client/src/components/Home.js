
import { h, Component } from 'preact'
import { route } from 'preact-router'
import { user } from 'services/guri'
import { style } from 'glamor'
import nlp from 'services/nlp'
import Editor from 'components/Editor'
import Previewer from 'components/Previewer'
import TemplateCard from 'components/TemplateCard'
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
      <div>
        <h2 {...styles.hero} dangerouslySetInnerHTML={{ __html: t('home.intro.tagline') }}></h2>
        <section {...styles.editor}>
          <Editor value={t('home.preview.text')} onInput={this.onInput} />
          <Previewer body={body} height={338} {...styles.preview} mode={mode} />
        </section>
        <img src='/images/a-loves-b.png' alt='Text loves VR' {...styles.love} />
        <h3 {...styles.templatesTitle}>{t('home.templates.start')}</h3>
        <section {...styles.templates}>
          <TemplateCard title={t('home.templates.panorama_title')}
            text={t('home.templates.panorama_desc')}
            bgUrl='/images/pano_tmpl.png' />
          <TemplateCard title={t('home.templates.chart_title')}
            text={t('home.templates.chart_desc')}
            bgUrl='/images/chart_tmpl.png' />
          <TemplateCard title={t('home.templates.voiceover_title')}
            text={t('home.templates.voiceover_desc')}
            bgUrl='/images/voiceover_tmpl.png' />
          <TemplateCard title={t('home.templates.videosphere_title')}
            text={t('home.templates.videosphere_desc')}
            bgUrl='/images/videosphere_tmpl.png' />
        </section>
        <section {...styles.feature}>
          <h2 {...styles.featureTitle}>{t('home.oss.title')}</h2>
          <p {...styles.featureDescription}
            dangerouslySetInnerHTML={{ __html: t('home.oss.description') }}></p>
        </section>
        <section {...styles.share}>
          <h2 {...styles.shareTitle}>{t('home.share.title')}</h2>
          <p {...styles.shareDescription}
            dangerouslySetInnerHTML={{ __html: t('home.share.description') }}></p>
        </section>
        <footer {...styles.footer}>
          <h3>{t('home.footer.title')}</h3>
          <p>{t('home.footer.description')}</p>
          <a href='/stories'>{t('home.footer.button')}</a>
          <p dangerouslySetInnerHTML={{ __html: t('home.footer.by') }}></p>
          <p dangerouslySetInnerHTML={{ __html: t('home.footer.design_by') }}></p>
        </footer>
      </div>
    )
  }
}

const styles = {
  hero: style({
    fontFamily: '\'Shrikhand\', cursive',
    color: '#FFDF00',
    textAlign: 'center',
    fontSize: 36,
    margin: 0,
    paddingTop: 50
  }),

  editor: style({
    paddingTop: 75,
    display: 'flex'
  }),

  templatesTitle: style({
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    paddingTop: 70
  }),

  love: style({
    width: 333,
    paddingTop: 82,
    margin: '0 auto',
    display: 'block'
  }),

  templates: style({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }),

  feature: style({
    paddingTop: 85,
    width: '90vw',
    margin: '0 auto'
  }),

  share: style({
    textAlign: 'right',
    paddingTop: 85,
    width: '90vw',
    margin: '0 auto'
  }),

  shareTitle: style({
    color: '#fff',
    fontSize: 64
  }),

  shareDescription: style({
    color: '#B7A0E1',
    fontSize: 22,
    textAlign: 'right',
    maxWidth: 750,
    float: 'right'
  }),

  featureTitle: style({
    color: '#202020',
    fontSize: 64
  }),

  featureDescription: style({
    color: '#777',
    fontSize: 22,
    maxWidth: 750
  }),

  footer: style({
    clear: 'both'
  })

}
