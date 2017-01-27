
import { h } from 'preact'
import LangSwitch from 'components/LangSwitch'
import TopBar from 'components/Home/TopBar'
import { style } from 'glamor'

export default () => (
  <div>
    <div {...styles.switchPosition}>
      <LangSwitch />
    </div>
    <TopBar />
  </div>
)

const styles = {
  switchPosition: style({
    marginTop: 20,
    float: 'right',
    marginRight: 20
  })
}
