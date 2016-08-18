
const express = require('express')
const config = require('./config.json')
const api = require('./api')
const auth = require('./auth')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')
const db = require('./db')

const app = express()

app.set('view engine', 'pug')
app.set('views', './views')

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session(Object.assign({
  store: new MongoStore({ url: config.db.database }),
  maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
}, config.session)))

app.use(auth.sessionSupport())
app.use(auth.acceptToken({successRedirect: '/'}))

app.use('/api', api)

const users = db.get('users')
app.use(function (req, res, next) {
  if (req.user) {
    users.findById(req.user)
      .then(user => {
        req.userData = user
        next()
      })
      .catch(err => next(err))
  } else {
    req.userData = null
    next()
  }
})
app.get('*', (req, res) => res.render('index', {user: req.userData, analyticsId: config.analyticsId}))

app.listen(config.server.port)
