
import { h } from 'preact'
import { Link } from 'preact-router'
import { style } from 'glamor'
import { assetsHost } from 'services/config'

export default ({ story, onDelete }) => (
  <div {...styles.container}>
    <div {...styles.header}>
      <h3>{story.title}</h3>
    </div>
    <p {...styles.body}>{story.text.split('\n').filter(p => p.length)[0]}</p>
    <div {...styles.actions}>
      <div>
        <Link href={`/stories/${story.id}`}>
          <svg fill='#999' height='24' viewBox='0 0 24 24' width='24'><path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' /><path d='M0 0h24v24H0z' fill='none' /></svg>
        </Link>
        <a {...styles.share} href={`${assetsHost}/stories%2F${story.id}.html?alt=media`} target='_blank'>
          <svg fill='#999' height='24' viewBox='0 0 24 24' width='24'><path d='M0 0h24v24H0z' fill='none' /><path d='M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z' /></svg>
        </a>
      </div>
      <span {...styles.delete} onClick={() => onDelete(story.id)}>
        <svg fill='#999' height='24' viewBox='0 0 24 24' width='24'><path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' /><path d='M0 0h24v24H0z' fill='none' /></svg>
      </span>
    </div>
  </div>
)

const styles = {
  container: style({
    marginRight: 20,
    width: 285,
    height: 250,
    border: '1px solid #e4e4e4',
    borderRadius: 4,
    marginBottom: 20,
    position: 'relative'
  }),

  header: style({
    color: '#fff',
    backgroundColor: '#5A33A2',
    margin: 0,
    padding: '5px 10px',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    textShadow: '2px 2px #333'
  }),

  body: style({
    padding: '0px 10px',
    color: '#999',
    overflow: 'hidden',
    paddingBottom: 25
  }),

  actions: style({
    height: 40,
    position: 'absolute',
    bottom: 0,
    background: '#fff',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 5px'
  }),

  share: style({
    marginLeft: 10
  }),

  delete: style({
    cursor: 'pointer'
  })
}
