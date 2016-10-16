
import { h } from 'preact'
import Radium from 'radium'
import storyBuilder from 'services/story-builder'

export default Radium(({ body, height, mode = 'vr' }) => {
  let chapters
  if (Array.isArray(body)) {
    chapters = body
  } else {
    try {
      chapters = JSON.parse(body)
    } catch (error) {
      chapters = []
    }
  }

  return (
    <iframe height={height} style={styles.container}
      src={`data:text/html;charset=utf-8,${storyBuilder({ title: 'preview', chapters, mode })}`}
      allowfullscreen />
  )
})

const styles = {
  container: {
    flex: 1
  }
}
