
import { h } from 'preact'
import { style } from 'glamor'
import t from 'services/i18n'

export default ({ color = '#fff', activeColor = '#FFEB3B', active }) => (
  <nav {...styles.navbar}>
    <a href='/' {...styles.link(color, activeColor, active === 'home')}>{t('header.home')}</a>
    <a href='/guide' {...styles.link(color, activeColor, active === 'guide')}>{t('header.guide')}</a>
    <a href='/login' {...styles.link(color, activeColor)}>{t('header.login')}</a>
  </nav>
)

const styles = {
  navbar: style({
    width: 250,
    display: 'flex',
    justifyContent: 'space-between'
  }),

  link (color, activeColor, isActive) {
    return style({
      cursor: 'pointer',
      textTransform: 'uppercase',
      color: isActive ? activeColor : color,
      fontWeight: 'bold',
      fontSize: 18,
      textDecoration: 'none',
      ':hover': {
        color: activeColor
      }
    })
  }
}
