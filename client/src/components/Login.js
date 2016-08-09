
import { h, Component } from 'preact';
import { TextField, Card, Button } from 'preact-mdl';
import { sendVerification } from 'services/datalayer';
import Radium from 'radium';
import t from 'services/i18n';

@Radium
export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      sent: false
    };
  }

  onSubmit(evt) {
    evt.preventDefault();
    sendVerification(this.state.email)
      .then(() => this.setState({ sent: true }));

    return false;
  }

  renderSent() {
    return (
      <div style={styles.sent}>
        <Card.Text>{t('login.sent')}</Card.Text>
      </div>
    );
  }

  renderForm() {
    const { email } = this.state;
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <Card.Text>
            <TextField placeholder='me@gmail.com'
            label='E-mail'
            type='email'
            floating-label
            required
            value={email} onInput={this.linkState('email')} autofocus />
        </Card.Text>
        <Card.Actions>
          <Button raised colored type='submit'>{t('login.login')}</Button>
        </Card.Actions>
      </form>
    );
  }

  render(props, { sent }) {
    return (
      <div style={styles.container}>
        <Card shadow={2}>
          {sent ? this.renderSent() : this.renderForm()}
        </Card>
      </div>
    );
  }
}

const styles = {
  container: {
    margin: '50px auto'
  },
  sent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  }
};
