
import { h } from 'preact'
import { style } from 'glamor'

export default ({ title, text, bgUrl, onClick }) => (
  <div onClick={onClick} {...styles.container}>
    <img src={bgUrl} />
    <div {...styles.desc}>
      <h3 {...styles.title}>{title}</h3>
      <p {...styles.text}>{text}</p>
    </div>
  </div>
)
const styles = {
  container: style({
    cursor: 'pointer',
    width: 220,
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 10,
    boxShadow: '0 2px 11px 0 rgba(0,0,0,0.09)',
    zIndex: 1,
    transition: 'all .2s ease-in-out',
    ':hover': {
      transform: 'scale(1.1)'
    }
  }),

  desc: style({
    padding: 16
  }),

  title: style({
    color: '#342D3F',
    fontWeight: 'bold',
    margin: 0,
    fontSize: 18
  }),

  text: style({
    color: 'rgba(52, 46, 63, .5)',
    fontSize: 14
  })
}
