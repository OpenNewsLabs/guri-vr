
import { h } from 'preact'
import { style } from 'glamor'
import Navbar from 'components/Navbar'
import LangSwitch from 'components/LangSwitch'
import Logo from 'components/Logo'
import { Link } from 'preact-router'

export default () => (
  <header {...styles.header}>
    <Link href='/'><Logo color='#5A33A2' /></Link>
    <div {...styles.navigation}>
      <Navbar color='rgba(0, 0, 0, .4)' activeColor='#5A33A2' active='guide' />
      <div {...styles.switchContainer}>
        <LangSwitch />
      </div>
    </div>
  </header>
)

const styles = {
  logo: style({
    width: 220,
    height: 104,
    fill: '#5A33A2'
  }),

  navigation: style({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap-reverse',
    paddingBottom: 30
  }),

  header: style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 80,
    flexWrap: 'wrap-reverse',
    '@media(max-width: 700px)': {
      marginBottom: 30,
      marginTop: 60
    },
    '@media(max-width: 530px)': {
      justifyContent: 'center'
    }
  }),

  switchContainer: style({
    marginLeft: 30,
    height: 30,
    '@media(max-width: 700px)': {
      position: 'absolute',
      right: 20,
      top: 20
    }
  })
}
