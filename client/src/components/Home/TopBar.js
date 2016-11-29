import { h } from 'preact'
import { style } from 'glamor'
import Logo from 'components/Logo'
import Navbar from 'components/Navbar'

export default () => (
  <div {...styles.container}>
    <Navbar active='home' />
    <Logo />
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
    maxWidth: 860,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingLeft: 20,
    '@media(max-width: 700px)': {
      paddingLeft: 0,
      width: '100vw',
      paddingTop: 30,
      flexDirection: 'column',
      alignItems: 'center',
      '& > svg': {
        margin: 20,
        marginTop: 30
      },
      '& > nav': {
        paddingTop: 30
      }
    }
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
