
import { h } from 'preact'
import nlp from 'services/nlp'
import t from 'services/i18n'
import { style } from 'glamor'

export default ({ text, title = 'GuriVR' }) => (
  <div class='cm-s-one-dark' {...styles.container}>
    <pre {...styles.text} dangerouslySetInnerHTML={{ __html: text }}></pre>
    <a href={`/api/preview?mode=${getMode(text)}&title=${title}&body=${encodeURIComponent(JSON.stringify(nlp(getText(text))))}`}
      target='_blank' {...styles.run}>{t('code_example.run')}</a>
  </div>
)

const bufferDiv = document.createElement('div')

const getText = str => {
  bufferDiv.innerHTML = str
  return bufferDiv.textContent || bufferDiv.innerText
}

const getMode = str => /ar mode|modo ra/gi.test(str) ? 'ar' : 'vr'

const styles = {
  container: style({
    padding: 20,
    margin: 0,
    backgroundColor: '#282C34',
    borderRadius: 3,
    color: '#818181',
    fontSize: 16,
    position: 'relative',
    paddingBottom: 50
  }),
  
  text: style({
    whiteSpace: 'pre-wrap',
    margin: 0,
    fontFamily: 'monospace',
    wordBreak: 'break-all'
  }),

  run: style({
    display: 'inline-block',
    textAlign: 'right',
    backgroundColor: '#fff',
    color: '#57309D',
    fontSize: '14px !important',
    position: 'absolute',
    borderRadius: 3.75,
    bottom: 8,
    right: 15,
    padding: '8px 12px',
    textTransform: 'uppercase',
    textDecoration: 'none'
  })
}
