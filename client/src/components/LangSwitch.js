
import { h } from 'preact'
import { getLocale, setLocale } from 'services/i18n'
import { style } from 'glamor'

const locales = {
  'en': { value: 'en-US', name: 'English' },
  'es': { value: 'es-ES', name: 'Español' }
}

export default () => (
  <div onClick={() => setLocale(locales[getLocale()].value)} {...styles.container}>
    <span {...styles.name}>{locales[getLocale()].name}</span>
    <span {...styles.arrowDown} />
  </div>
)

const styles = {
  container: style({
    marginTop: 20,
    float: 'right',
    marginRight: 20,
    color: '#fff',
    fontSize: 14,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 3,
    padding: '8px 10px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
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
  })
}
