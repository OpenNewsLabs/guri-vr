
import guri from 'services/guri'

export const logout = () =>
fetch('/api/logout', {
  method: 'POST',
  credentials: 'same-origin'
})
.then(() => guri.emit('logout'))

export const sendVerification = email =>
fetch('/api/login', {
  method: 'POST',
  body: JSON.stringify({ user: email }),
  headers: new Headers({
    'Content-Type': 'application/json'
  })
})

export const deleteStory = id =>
fetch(`/api/stories/${id}`, {
  method: 'DELETE',
  credentials: 'same-origin'
})

export const fetchUserStories = () =>
fetch('/api/stories', { credentials: 'same-origin' })
.then(res => res.json())

export const fetchStory = id =>
fetch(`/api/stories/${id}`, { credentials: 'same-origin' })
.then(res => res.json())

export const createStory = story =>
fetch('/api/stories', {
  method: 'POST',
  body: JSON.stringify(story),
  credentials: 'same-origin',
  headers: new Headers({
    'Content-Type': 'application/json'
  })
})
.then(res => res.json())

export const updateStory = story =>
fetch(`/api/stories/${story._id}`, {
  method: 'PUT',
  body: JSON.stringify(story),
  credentials: 'same-origin',
  headers: new Headers({
    'Content-Type': 'application/json'
  })
})
.then(res => res.json())

export const uploadAsset = file => {
  const data = new FormData()
  data.append('file', file)
  return fetch('/api/assets', {
    method: 'POST',
    body: data
  }).then(res => res.json())
}

export const searchResources = (type, text) =>
fetch(`/api/assets/search?type=${type}&query=${text}`)
.then(res=> res.json())
