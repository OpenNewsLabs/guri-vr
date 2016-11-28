
import { h } from 'preact'
import { style } from 'glamor'
import t from 'services/i18n'
import Editor from 'components/Editor'
import Previewer from 'components/Previewer'

export default ({ body, mode, onInput }) => (
  <div>
    <h2 {...styles.hero} dangerouslySetInnerHTML={{ __html: t('home.intro.tagline') }}></h2>
    <section {...styles.editor}>
      <Editor value={t('home.preview.text')} onInput={onInput} />
      <Previewer body={body} height={338} mode={mode} />
    </section>
    <img src='/images/a-loves-b.png' alt='Text loves VR' {...styles.love} />
    <h2 {...styles.templatesTitle}>{t('home.templates.start')}</h2>
  </div>
)

const styles = {
  hero: style({
    fontFamily: '\'Shrikhand\', cursive',
    color: '#FFDF00',
    textAlign: 'center',
    fontSize: 36,
    margin: 0,
    paddingTop: 50
  }),

  editor: style({
    paddingTop: 75,
    display: 'flex',
    zIndex: 5
  }),

  templatesTitle: style({
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
    paddingTop: 70
  }),

  love: style({
    width: 333,
    paddingTop: 82,
    margin: '0 auto',
    display: 'block'
  })
}
