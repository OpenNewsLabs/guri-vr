
import { h, Component } from 'preact'
import { Link } from 'preact-router'
import Logo from 'components/Logo'
import { sendVerification } from 'services/datalayer'
import { style } from 'glamor'
import t from 'services/i18n'

export default class Login extends Component {
  constructor (props) {
    super(props)

    this.state = {
      email: '',
      sent: false
    }

    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit (evt) {
    evt.preventDefault()
    sendVerification(this.state.email)
      .then(() => this.setState({ sent: true }))

    return false
  }

  renderSent () {
    return (
      <p {...styles.text}>{t('login.sent')}</p>
    )
  }

  renderForm () {
    const { email } = this.state
    return (
      <form onSubmit={this.onSubmit}>
        <p {...styles.text}>{t('login.text')}</p>
        <div {...styles.emailGroup}>
          <label for='email' {...styles.label}>E-mail</label>
          <input type='email' id='email' required placeholder='me@gmail.com'
            value={email} {...styles.email} onInput={this.linkState('email')}
            autofocus />
        </div>
        <button {...styles.button} type='submit'>{t('login.login')}</button>
      </form>
    )
  }

  render (props, { sent }) {
    return (
      <div {...styles.container}>
        <Link href='/' {...styles.logoContainer}>
          <Logo color='#5A33A2' />
        </Link>
        {sent ? this.renderSent() : this.renderForm()}
      </div>
    )
  }
}

const styles = {
  container: style({
    margin: '50px auto',
    width: 350
  }),

  logoContainer: style({
    justifyContent: 'center',
    display: 'flex'
  }),

  label: style({
    color: '#5A33A2',
    fontSize: 12,
    marginBottom: 5
  }),

  email: style({
    fontSize: 16,
    border: 0,
    borderBottom: '3px solid #5A33A2'
  }),

  emailGroup: style({
    display: 'flex',
    flexDirection: 'column',
    marginTop: 40
  }),

  text: style({
    fontSize: 16,
    color: '#999',
    marginTop: 50,
    textAlign: 'center'
  }),

  button: style({
    marginTop: 50,
    display: 'block',
    borderRadius: 5,
    backgroundColor: '#5A33A2',
    border: 'none',
    color: '#fff',
    width: '100%',
    fontSize: 18,
    textTransform: 'uppercase',
    padding: 14,
    fontWeight: 500,
    boxShadow: '0 2px 3px rgba(90,53,162,0.3)',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#734EBB'
    }
  })
}
