
import { h } from 'preact';
import { Layout } from 'preact-mdl';
import { Link } from 'preact-router';
import { logout } from 'services/datalayer';

export default ({ user }) => (
  <Layout.Header>
    <Layout.HeaderRow>
      <Layout.Title>
        <Link style={styles.link} href='/'>GuriVR</Link>
      </Layout.Title>
      <Layout.Spacer />
      { user ?
        <div>
          <Link style={styles.link} href='/stories'>My stories</Link>
          <a href='#' onClick={logout} style={styles.link}>Logout</a>
        </div> :
        <Link style={styles.link} href='/login'>Login</Link>
      }
    </Layout.HeaderRow>
  </Layout.Header>
);

const styles = {
  link: {
    color: '#fff',
    textDecoration: 'none',
    marginRight: 10
  }
};
