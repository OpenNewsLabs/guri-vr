
import { h } from 'preact'
import { style } from 'glamor'

export default ({ body, height, mode = 'vr' }) => (
  <iframe crossorigin="anonymous" height={height} {...styles.container}
    src={`/api/preview?mode=${mode}&body=${encodeURIComponent(JSON.stringify(body))}`}
    allowfullscreen />
)

const styles = {
  container: style({
    flex: 1,
    border: 'none',
    backgroundColor: '#000'
  })
}
