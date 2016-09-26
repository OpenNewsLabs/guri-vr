
import { h, Component } from 'preact'
import Radium from 'radium'

export default Radium(({ body, height, mode = 'vr' }) => (
  <iframe height={height} style={styles.container}
    src={`/api/preview?mode=${mode}&body=${encodeURIComponent(JSON.stringify(body))}`}
    allowfullscreen />
))

const styles = {
  container: {
    flex: 1
  }
}
