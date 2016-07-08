
import { h, Component } from 'preact';
import Radium from 'radium';
import { route } from 'preact-router';
import { Spinner, Card, Button, Icon } from 'preact-mdl';
import { fetchUserStories, deleteStory } from 'services/datalayer';
import Fab from 'components/Fab';

export default class StoryList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stories: []
    };
  }

  componentWillMount() {
    fetchUserStories()
      .then(stories => this.setState({ stories }));
  }

  onDelete(id, key) {
    if (confirm('Are you sure you want to delete this story?')) {
      deleteStory(id)
        .then(() => this.setState({
          stories: this.state.stories.filter(({ _id }) => _id !== id)
        }));
    }
  }

  onPreview(title, body) {
    open(`/api/preview?title=${title}&body=${body}`, '_blank');
  }

  onEdit(id) {
    route(`/stories/${id}`);
  }

  onCreate() {
    route('/stories/create');
  }

  renderList() {
    const { stories } = this.state;

    return (
      <div style={styles.listContainer}>
        {stories.map((story, key) => (
          <Card style={styles.cardContainer} shadow={2}>
            <Card.Title style={styles.cardTitle}>
              <Card.TitleText>{story.title}</Card.TitleText>
            </Card.Title>
            <Card.Text style={styles.cardText}>{story.text.split('\n').filter(p => p.length)[0]}</Card.Text>
            <Card.Actions style={styles.cardActions} class='mdl-card--border'>
              <div>
                <Button onClick={this.onEdit.bind(this, story._id)} icon><Icon icon='mode edit' /></Button>
                <Button onClick={this.onPreview.bind(this, story.title, story.body)} icon><Icon icon='play arrow' /></Button>
              </div>
              <div>
                <Button onClick={this.onDelete.bind(this, story._id, key)} icon><Icon icon='delete' /></Button>
              </div>
            </Card.Actions>
          </Card>
        ))}
      </div>
    );
  }

  renderEmpty() {
    return (
      <p style={styles.empty}>It seems that you don{`'`}t have stories yet. You can start by clicking on the + button below 😸</p>
    );
  }

  render(props, { stories }) {
    return (
      <div style={styles.container}>
        {stories.length ? this.renderList() : this.renderEmpty()}
        <Fab icon='add' onClick={this.onCreate.bind(this)} />
      </div>
    );
  }
}

const styles = {
  container: {
    width: '100vw'
  },
  spinner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%'
  },
  listContainer: {
    margin: 30,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  cardContainer: {
    margin: 20,
    height: 250
  },
  cardTitle: {
    fontSize: '1.5em',
    backgroundColor: '#1A237E',
    color: '#fff'
  },
  empty: {
    textAlign: 'center',
    marginTop: 150,
    padding: 25,
    fontSize: '1.3em'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  cardText: {
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
};
