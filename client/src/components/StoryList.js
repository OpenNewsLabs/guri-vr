
import { h, Component } from 'preact'
import { route, Link } from 'preact-router'
import { style } from 'glamor'
import { fetchUserStories, deleteStory } from 'services/datalayer'
import { assetsHost } from 'services/config'
import t from 'services/i18n'
import StoryCard from 'components/StoryCard'
import Navbar from 'components/Navbar'
import LangSwitch from 'components/LangSwitch'
import Logo from 'components/Logo'

export default class StoryList extends Component {
  constructor (props) {
    super(props)

    this.state = {
      stories: []
    }

    this.onDelete = this.onDelete.bind(this)
  }

  componentWillMount () {
    fetchUserStories()
      .then(stories => this.setState({ stories }))
  }

  onDelete (storyId) {
    if (window.confirm(t('stories.delete_confirm'))) {
      deleteStory(storyId)
        .then(() => this.setState({
          stories: this.state.stories.filter(({ id }) => id !== storyId)
        }))
    }
  }

  render (props, { stories }) {
    return (
      <div {...styles.container}>
        <div {...styles.headerContainer}>
          <Link href='/'><Logo color='#5A33A2' /></Link>
          <div {...styles.navContainer}>
            <Navbar color='rgba(0, 0, 0, .4)' underline
              activeColor='#5A33A2' active='stories' />
            <div {...styles.switchContainer}>
              <LangSwitch />
            </div>
          </div>
        </div>
        <div {...styles.listContainer}>
          <CreateStoryCard />
          {stories.map(story => <StoryCard onDelete={this.onDelete} story={story} />)}
        </div>
      </div>
    )
  }
}

const CreateStoryCard = () => (
  <Link {...styles.createLink} href='/stories/create'>
    <div {...styles.createContainer}>
      <div></div>
      <div {...styles.plusContainer}>
        <p {...styles.plus}>
          <span>+</span>
        </p>
      </div>
      <p {...styles.createText}>{t('stories.add')}</p>
    </div>
  </Link>
)

const styles = {
  createLink: style({
    textDecoration: 'none'
  }),

  listContainer: style({
    marginTop: 50,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }),

  plusContainer: style({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }),

  plus: style({
    backgroundColor: '#e4e4e4',
    width: 100,
    height: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 999,
    fontSize: 30,
    color: '#5A33A2'
  }),

  createContainer: style({
    width: 285,
    height: 250,
    marginRight: 20,
    border: '5px dashed #5A33A2',
    borderRadius: 10,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 20
  }),

  container: style({
    maxWidth: 960,
    width: '100vw',
    margin: '0 auto',
    padding: 20
  }),

  switchContainer: style({
    marginLeft: 30,
    height: 30,
    display: 'inline-block',
    '@media(max-width: 700px)': {
      position: 'absolute',
      right: 20,
      top: 20
    }
  }),

  headerContainer: style({
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap-reverse',
    '@media(max-width: 700px)': {
      marginBottom: 30,
      marginTop: 60
    },
    '@media(max-width: 530px)': {
      justifyContent: 'center'
    }
  }),

  navContainer: style({
    display: 'flex',
    alignItems: 'center',
    paddingBottom: 30,
    flexWrap: 'wrap-reverse'
  }),

  createText: style({
    textTransform: 'uppercase',
    color: '#5A33A2',
    fontSize: 22
  })
}
