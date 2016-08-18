
import Emitter from 'wildemitter'

const bus = new Emitter()

export let user = __user__

bus.on('login', data => { user = data })
bus.on('logout', () => { user = null })

export default bus
