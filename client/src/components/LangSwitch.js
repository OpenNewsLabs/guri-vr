
import { h } from 'preact'
import { getLocale, setLocale } from 'services/i18n'
import { style, merge, select } from 'glamor'

const locales = {
  'en': { value: 'en-US', name: 'English' },
  'es': { value: 'es-ES', name: 'Español' }
}

export default () => (
  <div {...styles.container}>
    <div onClick={() => setLocale(locales[getLocale()].value)} {...styles.button} {...select(':hover + div', { display: 'block' })}>
      <span {...styles.name}>{locales[getLocale()].name}</span>
      <span {...styles.arrowDown} />
    </div>
    <div {...styles.content}>
      {Object.keys(locales).filter(l => getLocale() !== l).map(l => (
        <span onClick={() => setLocale(locales[l].value)}>{locales[l].name}</span>
      ))}
    </div>
  </div>
)

const styles = {
  container: style({
    marginTop: 20,
    float: 'right',
    marginRight: 20,
    fontSize: 14,
    textTransform: 'uppercase'
  }),

  button: style({
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 3,
    padding: '8px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  }),

  name: style({
    marginRight: 8
  }),

  arrowDown: style({
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid #fff'
  }),

  content: style({
    backgroundColor: 'rgba(0, 0, 0, .6)',
    padding: 5,
    color: '#fff',
    borderRadius: 0,
    cursor: 'pointer',
    display: 'none',
    ':hover': {
      display: 'block'
    }
  })
}
