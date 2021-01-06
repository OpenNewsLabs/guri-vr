const admin = require('firebase-admin')
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.STORAGE_BUCKET,
});

const db = admin.firestore()
const bucket = admin.storage().bucket()

module.exports = async (req, res) => {
    const { email } = await admin.auth().verifyIdToken(req.headers.authorization)
    let ref = db.collection('stories').doc(req.query.id);
    let getDoc = await ref.get()
    if (!getDoc.exists) return res.status(404).send('Not found')
    const data = getDoc.data()
    if (data.user_id !== email) return res.status(404).send('Not found')
    data.id = getDoc.id
    if (req.method === 'GET') {      
        res.json(data);  
        return;
    } else if (req.method === 'DELETE') {
        await db.collection('stories').doc(req.query.id).delete()
        const file = bucket.file(`stories/${req.query.id}.html`)
        await file.delete()
        res.json('ok')
        return
    } else if (req.method === 'PUT') {
      const newData = {
        title: req.body.title,
        body: JSON.stringify(req.body.body),
        text: req.body.text,
        mode: req.body.mode || 'vr'    
      }
       await db.collection('stories').doc(req.query.id).set(newData, { merge: true })
      const newDoc = Object.assign({}, data, newData)
      res.json(newDoc)
      return
    }
    res.status(405).send('Method not allowed')
}
