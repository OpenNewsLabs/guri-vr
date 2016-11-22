
import { h } from 'preact'
import { style } from 'glamor'
import Navbar from 'components/Navbar'
import LangSwitch from 'components/LangSwitch'
import Logo from 'components/Logo'

export default () => (
  <header {...styles.header}>
    <Logo color='#5A33A2' />
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
    justifyContent: 'space-between'
  }),

  header: style({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 80
  }),

  switchContainer: style({
    marginLeft: 30
  })
}
