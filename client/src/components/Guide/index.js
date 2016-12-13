
import { h, Component } from 'preact'
import { style } from 'glamor'
import Header from 'components/Guide/Header'
import Sidebar from 'components/Guide/Sidebar'
import MainContent from 'components/Guide/MainContent'

export default class Guide extends Component {

  render () {
    return (
      <article {...styles.container}>
        <Header />
        <div {...styles.main}>
          <Sidebar />
          <MainContent />
        </div>
      </article>
    )
  }

}

const styles = {
  container: style({
    marginLeft: 50,
    marginRight: 50,
    width: '100vw',
    maxWidth: 960,
    padding: 20,
    margin: '0 auto',
    '@media(max-width: 1000px)': {
      width: 'auto'
    }
  }),

  main: style({
    display: 'flex',
    position: 'relative',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  })
}
