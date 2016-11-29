
import { h } from 'preact'
import { style, merge } from 'glamor'
import t from 'services/i18n'

export default () => (
  <div {...styles.container}>
    <a {...merge(styles.link, styles.title)} href='#introduction'>{t('guide.introduction.title')}</a>
    <a {...merge(styles.link, styles.title)} href='#getting-started'>{t('guide.getting_started.title')}</a>
    <a {...merge(styles.link, styles.title)} href='#scenes'>{t('guide.scenes.title')}</a>

    <a {...merge(styles.link, styles.title)} href='#entities'>{t('guide.entities.title')}</a>
    <a {...styles.link} href='#audio'>{t('guide.audio.title')}</a>
    <a {...styles.link} href='#panorama'>{t('guide.panorama.title')}</a>
    <a {...styles.link} href='#videosphere'>{t('guide.videosphere.title')}</a>
    <a {...styles.link} href='#image'>{t('guide.image.title')}</a>
    <a {...styles.link} href='#video'>{t('guide.video.title')}</a>
    <a {...styles.link} href='#text'>{t('guide.text.title')}</a>
    <a {...styles.link} href='#duration'>{t('guide.duration.title')}</a>
    <a {...styles.link} href='#voiceover'>{t('guide.voiceover.title')}</a>
    <a {...styles.link} href='#chart'>{t('guide.chart.title')}</a>
    <a {...styles.link} href='#sky'>{t('guide.sky.title')}</a>
    <a {...styles.link} href='#background'>{t('guide.background.title')}</a>
    <a {...styles.link} href='#3dmodel'>{t('guide.3dmodel.title')}</a>

    <div {...styles.separator}></div>
    <a {...merge(styles.link, styles.title)} href='#speech-recognition'>{t('guide.speech_recognition.title')}</a>
    <a {...merge(styles.link, styles.title)} href='#search'>{t('guide.search.title')}</a>
    <a {...merge(styles.link, styles.title)} href='#ar'>{t('guide.ar.title')}</a>
    <a {...merge(styles.link, styles.title)} href='#sharing'>{t('guide.sharing.title')}</a>

  </div>
)

const styles = {
  container: style({
    flex: 0,
    minWidth: 120,
    '@media(max-width: 700px)': {
      width: '100vw',
      fontSize: 30,
      flex: 1
    }
  }),

  title: style({
    color: '#000000',
    textTransform: 'none',
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 20,
    ':hover': {
      color: '#000000',
      textDecoration: 'none'
    }
  }),

  link: style({
    color: 'rgba(0, 0, 0, .34)',
    textTransform: 'uppercase',
    fontSize: 18,
    textDecoration: 'none',
    display: 'block',
    marginTop: 10,
    ':hover': {
      color: 'rgba(0, 0, 0, .65)',
      textDecoration: 'underline'
    }
  }),

  separator: style({
    marginBottom: 40
  })
}
