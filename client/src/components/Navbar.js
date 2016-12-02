
import { h } from 'preact'
import { Link } from 'preact-router'
import { style } from 'glamor'
import t from 'services/i18n'
import { user } from 'services/guri'

export default ({ color = '#fff', activeColor = '#FFEB3B', active }) => (
  <nav {...styles.navbar}>
    <Link href='/' {...styles.link(color, activeColor, active === 'home')}>{t('header.home')}</Link>
    <Link href='/guide' {...styles.link(color, activeColor, active === 'guide')}>{t('header.guide')}</Link>
    {user
      ? <Link href='/stories' {...styles.link(color, activeColor, active === 'stories', active === 'stories')}>{t('header.my_stories')}</Link>
      : <Link href='/login' {...styles.link(color, activeColor)}>{t('header.login')}</Link>
    }
  </nav>
)

const styles = {
  navbar: style({
    width: 250,
    display: 'flex',
    justifyContent: 'space-between'
  }),

  link (color, activeColor, isActive, underline) {
    return style({
      cursor: 'pointer',
      textTransform: 'uppercase',
      color: isActive ? activeColor : color,
      fontWeight: 'bold',
      fontSize: 18,
      paddingBottom: 5,
      textDecoration: 'none',
      borderBottom: underline ? `3px solid ${activeColor}` : 'none',
      ':hover': {
        color: activeColor
      }
    })
  }
}
