
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
  </div>
)

const styles = {
  container: style({
    flex: 0,
    minWidth: 120
  }),

  title: style({
    color: '#000000',
    textTransform: 'none',
    fontWeight: 'bold',
    marginBottom: 15
  }),

  link: style({
    color: 'rgba(0, 0, 0, .34)',
    textTransform: 'uppercase',
    fontSize: 18,
    textDecoration: 'none',
    display: 'block'
  })
}
