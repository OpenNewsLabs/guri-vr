
import { h } from 'preact'
import { style } from 'glamor'
import t from 'services/i18n'

export default () => (
  <footer {...styles.footer}>
    <h3 {...styles.fun}>{t('home.footer.title')}</h3>
    <p {...styles.start}>{t('home.footer.description')}</p>
    <a {...styles.button} href='/stories'>{t('home.footer.button')}</a>
    <p {...styles.by} dangerouslySetInnerHTML={{ __html: t('home.footer.by') }}></p>
  </footer>
)

const styles = {
  footer: style({
    clear: 'both',
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'rgb(84, 41, 150)',
    marginTop: -300,
    paddingTop: 300,
    paddingBottom: 40
  }),

  fun: style({
    fontSize: 48,
    fontWeight: 'normal',
    margin: 0
  }),

  start: style({
    color: 'rgba(255, 255, 255, .4)'
  }),

  button: style({
    display: 'block',
    padding: '20px 5px',
    backgroundColor: '#E8DCFF',
    color: '#845FC2',
    width: 281,
    margin: '50px auto',
    textDecoration: 'none',
    borderRadius: 5
  }),

  by: style({
    fontSize: 16
  })
}
