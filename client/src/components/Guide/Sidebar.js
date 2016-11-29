
import { h } from 'preact'
import { style, merge } from 'glamor'
import t from 'services/i18n'

export default () => (
  <div {...styles.container}>
    <a {...merge(styles.link, styles.title)} href='#introduction'>{t('guide.introduction.title')}</a>
    <a {...merge(styles.link, styles.title)} href='#getting-started'>{t('guide.getting_started.title')}</a>
    <a {...merge(styles.link, styles.title)} href='#scenes'>{t('guide.scenes.title')}</a>

    <a {...merge(styles.link, styles.title)} href='#entities'>{t('guide.entities.title')}</a>

    <a {...merge(styles.link, styles.title)} href='#speech-recognition'>{t('guide.speech_recognition.title')}</a>
    <a {...merge(styles.link, styles.title)} href='#search'>{t('guide.search.title')}</a>
    <a {...merge(styles.link, styles.title)} href='#ar'>{t('guide.ar.title')}</a>
    <a {...merge(styles.link, styles.title)} href='#sharing'>{t('guide.sharing.title')}</a>

  </div>
)

const styles = {
  container: style({
    flex: 0,
    position: 'fixed',
    width: 250,
    overflowY: 'scroll',
    '@media(max-width: 1000px)': {
      'display': 'none'
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
  })
}
