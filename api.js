
const express = require('express')
const auth = require('./auth')
const db = require('./db')
const buildStory = require('./story-builder')
const upload = require('./uploader')
const nlp = require('./nlp')
const searchResources = require('./search-resources')

const app = module.exports = express.Router()

const users = db.get('users')
const stories = db.get('stories')

app.get('/preview', (req, res) => {
  try {
    const story = {
      title: req.query.title,
      chapters: JSON.parse(req.query.body),
      mode: req.query.mode || 'vr'
    }
    const html = buildStory(story)
    res.send(html)
  } catch (error) {
    console.log(error)
    res.send(buildStory({ title: '', chapters: [] }))
  }
})

app.post('/stories', (req, res, next) => {
  try {
    const body = req.body.body || nlp(req.body.text)

    stories.insert({
      title: req.body.title,
      body: JSON.stringify(body),
      text: req.body.text,
      user_id: req.user,
      mode: req.body.mode || 'vr'
    })
    .then(story => upload.story(story))
    .then(story => res.json(story))
    .catch(error => next(error))
  } catch (err) {
    next(err)
  }
})

app.post('/assets', upload.asset.single('file'),
(req, res) => res.json({ url: req.file.location }))

app.post('/login', auth.requestToken(
  (email, delivery, callback, req) =>
     users.findOne({ email })
      .then(user => {
        if (user) {
          callback(null, user._id)
        } else {
          users.insert({ email })
            .then(user => callback(null, user._id))
        }
      })
      .catch(err => callback(err))),
  (req, res) => res.send('ok'))

app.get('/assets/search', searchResources)

app.use(auth.restricted())

app.post('/logout', (req, res) =>
req.session.destroy(() => res.send('ok')))

app.get('/stories', (req, res, next) => stories
.find({ user_id: req.user })
.then(docs => res.json(docs))
.catch(err => next(err)))

app.get('/stories/:id', (req, res, next) => stories
.findOne({ user_id: req.user, _id: req.params.id })
.then(doc => res.json(doc))
.catch(err => next(err)))

app.put('/stories/:id', (req, res, next) =>
  stories.update({ _id: req.params.id, user_id: req.user }, { $set: {
    title: req.body.title,
    body: JSON.stringify(req.body.body),
    text: req.body.text,
    mode: req.body.mode || 'vr'
  }})
  .then(() => stories.findOne({ _id: req.params.id }))
  .then(story => upload.story(story))
  .then(story => res.json(story))
  .catch(error => next(error))
)

app.delete('/stories/:id', (req, res, next) =>
  stories.remove({ _id: req.params.id, user_id: req.user })
  .then(() => upload.deleteStory(req.params.id))
  .then(() => res.send('ok'))
  .catch(error => next(error))
)
