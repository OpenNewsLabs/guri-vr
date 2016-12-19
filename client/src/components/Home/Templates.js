
import { h } from 'preact'
import { style } from 'glamor'
import TemplateCard from 'components/Home/TemplateCard'
import t from 'services/i18n'

export default ({ onChange }) => (
  <section {...styles.templates}>
    <TemplateCard title={t('home.templates.panorama_title')}
      text={t('home.templates.panorama_desc')}
      bgUrl='/images/pano_tmpl.png'
      onClick={() => onChange(t('home.templates.panorama_text'))} />
    <TemplateCard title={t('home.templates.chart_title')}
      text={t('home.templates.chart_desc')}
      bgUrl='/images/chart_tmpl.png'
      onClick={() => onChange(t('home.templates.chart_text'))} />
    <TemplateCard title={t('home.templates.voiceover_title')}
      text={t('home.templates.voiceover_desc')}
      bgUrl='/images/voiceover_tmpl.png'
      onClick={() => onChange(t('home.templates.voiceover_text'))} />
    <TemplateCard title={t('home.templates.videosphere_title')}
      text={t('home.templates.videosphere_desc')}
      bgUrl='/images/videosphere_tmpl.png'
      onClick={() => onChange(t('home.templates.videosphere_text'))} />
  </section>
)

const styles = {
  templates: style({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  })
}
