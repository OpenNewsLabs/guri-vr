
import { auth, storage } from 'firebase/app'
import uuid from 'uuid/v4'
import { loginRedirectUrl } from './config'

export const getIdToken = async () => {
  if (auth().currentUser) {
    return await auth().currentUser.getIdToken()
  } else {
    return null
  }
}

export const logout = () => auth().signOut()

export const sendVerification = email =>
auth().sendSignInLinkToEmail(email, { url: loginRedirectUrl, handleCodeInApp: true })
.then(() => localStorage.setItem('emailForSignIn', email))


export const deleteStory = async id =>
fetch(`/api/stories/${id}`, {
  method: 'DELETE',
  credentials: 'same-origin',
  headers: new Headers({
    'Authorization': await getIdToken()
  })
})

export const fetchUserStories = async () =>
fetch('/api/stories', {
  headers: new Headers({
    'Authorization': await getIdToken()
  })
})
.then(res => res.json())

export const fetchStory = async id => 
fetch(`/api/stories/${id}`, {
  headers: new Headers({
    'Authorization': await getIdToken()
  })
})
.then(res => res.json())

export const createStory = async story =>
fetch('/api/stories', {
  method: 'POST',
  body: JSON.stringify(story),
  credentials: 'same-origin',
  headers: new Headers({
    'Content-Type': 'application/json',
    'Authorization': await getIdToken()
  })
})
.then(res => res.json())

export const updateStory = async story =>
fetch(`/api/stories/${story.id}`, {
  method: 'PUT',
  body: JSON.stringify(story),
  credentials: 'same-origin',
  headers: new Headers({
    'Content-Type': 'application/json',
    'Authorization': await getIdToken()
  })
})
.then(res => res.json())

export const uploadAsset = async file => {
  const storageRef = storage().ref()
  const objRef = storageRef.child(`uploads/${uuid().split('-')[0]}-${file.name}`)
  const snapshot = await objRef.put(file)
  const url = await snapshot.ref.getDownloadURL()
  return { url }
}

export const searchResources = (type, text) =>
fetch(`/api/assets/search?type=${type}&query=${text}`)
.then(res=> res.json())
