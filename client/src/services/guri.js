
import Emitter from 'wildemitter'

const bus = new Emitter()

export let user = null

bus.on('login', data => { user = data })
bus.on('logout', () => { user = null })

export const fetchSession = () => {
  return fetch('/me', { credentials: 'same-origin' })
  .then(res => res.json())
  .then(data => {
    user = data.user
  })
  .catch(err => { console.error('failed fetching user', err) })
}

export default bus
