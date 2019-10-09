
import { initializeApp, auth } from 'firebase/app'
import 'firebase/auth'
import 'firebase/storage'
import Emitter from 'wildemitter'
import { firebase as firebaseConfig } from './config'

const bus = new Emitter()

initializeApp(firebaseConfig)

export let user = null

auth().onAuthStateChanged(data => {
  user = data
  bus.emit('renderApp')
});

// check sign in with link
if (auth().isSignInWithEmailLink(window.location.href)) {
  let email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    email = window.prompt('Please provide your email for confirmation');
  }
  // The client SDK will parse the code from the link for you.
  auth().signInWithEmailLink(email, window.location.href)
    .then(function(result) {
      window.localStorage.removeItem('emailForSignIn');
    })
    .catch(error => alert('An error happened'));
}


export default bus
