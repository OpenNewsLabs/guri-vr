import { h } from 'preact'
import { style } from 'glamor'
import t from 'services/i18n'

export default () => (
  <div {...styles.container}>
    <nav {...styles.navbar}>
      <a href='/' {...styles.link}>{t('header.home')}</a>
      <a href='/guide' {...styles.link}>{t('header.guide')}</a>
      <a href='/login' {...styles.link}>{t('header.login')}</a>
    </nav>
    <img src='/logo.svg' width='220' height='104' />
    <nav {...styles.social}>
      <a href='https://github.com/opennewslabs/guri-vr' {...styles.link}>
        <img src='/git.svg' />
      </a>
      <a href='https://twitter.com/guri_vr' {...styles.link}>
        <img src='/twitter.svg' />
      </a>
    </nav>
  </div>
)

const styles = {
  container: style({
    width: 860,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50
  }),

  navbar: style({
    width: 250,
    display: 'flex',
    justifyContent: 'space-between'
  }),

  link: style({
    textTransform: 'uppercase',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textDecoration: 'none',
    ':hover': {
      color: '#FFEB3B'
    }
  }),

  social: style({
    width: 100,
    justifyContent: 'space-around',
    alignItems: 'center',
    display: 'flex'
  })
}
