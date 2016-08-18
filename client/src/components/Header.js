
import { h } from 'preact'
import { Layout } from 'preact-mdl'
import { Link } from 'preact-router'
import { logout } from 'services/datalayer'
import t, { getLocale, setLocale } from 'services/i18n'

export default ({ user }) => (
  <Layout.Header>
    <Layout.HeaderRow>
      <Layout.Title>
        <Link style={styles.link} href='/'>GuriVR</Link>
      </Layout.Title>
      <Layout.Spacer />
      <Link style={styles.link} href='/guide'>{t('header.guide')}</Link>
      {user
        ? (
        <div>
          <Link style={styles.link} href='/stories'>{t('header.my_stories')}</Link>
          <a href='#' onClick={logout} style={styles.link}>{t('header.logout')}</a>
        </div>
        )
        : <Link style={styles.link} href='/login'>{t('header.login')}</Link>
      }
      {getLocale() === 'en' ? <a style={styles.link} onClick={() => setLocale('es-ES')}>🇪🇸</a> : <a style={styles.link} onClick={() => setLocale('en-US')}>🇬🇧</a>}
    </Layout.HeaderRow>
  </Layout.Header>
)

const styles = {
  link: {
    color: '#fff',
    textDecoration: 'none',
    marginRight: 15,
    cursor: 'pointer'
  }
}
