const admin = require('firebase-admin')
const buildStory = require('../client/shared/story-builder')
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

const db = admin.firestore()
const bucket = admin.storage().bucket()


module.exports = async (req, res) => {
  if (req.method === 'GET') {
    const { email } = await admin.auth().verifyIdToken(req.headers.authorization)

    const snapshot = await db.collection('stories').where('user_id', '==', email).get()
    if (snapshot.empty) return res.json([])
  
    const docs = []
    snapshot.forEach(doc => {
      docs.push({ ...doc.data(), id: doc.id })
    });
  
    res.json(docs);  
  } else if (req.method === 'POST') {
    let email = null
    if (req.headers.authorization) {
      const token = await admin.auth().verifyIdToken(req.headers.authorization)
      email = token.email
    }

    const body = req.body.body || nlp(req.body.text)
    if (req.body.store === false) {
      return res.json(body)
    }

    const story = {
      title: req.body.title,
      body: JSON.stringify(body),
      text: req.body.text,
      user_id: email,
      mode: req.body.mode || 'vr',
    }

    const ref = await db.collection('stories').add(story)
    const file = bucket.file(`stories/${ref.id}.html`)
    story.chapters = JSON.parse(story.body)
    await file.save(buildStory(story), {
      gzip: true,
      contentType: 'text/html'
    })
    res.json(story)
  }
};
