/**
 * Module dependencies
 */

const axios = require('axios');

/**
 * Module constants
 */

const FLICKR_BASE_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search'
const FLICKR_PARAMS = `&per_page=5&license=1,2,3,4,5,6,7&format=json&nojsoncallback=1&extras=url_o,url_k,url_t&api_key=${process.env.FLICKR_SECRET_KEY}`
const FREESOUND_BASE_URL = 'http://www.freesound.org/apiv2'

module.exports = (req, res) => {
  const { type, query } = req.query

  switch (type) {
    case 'image':
      axios.get(`${FLICKR_BASE_URL}${FLICKR_PARAMS}&text=${query}`)
      .then(({ data }) => res.json(data.photos.photo))
      .catch(() => res.status(500).send('error'))
    break
    case 'panorama':
    default:
      axios.get(`${FLICKR_BASE_URL}${FLICKR_PARAMS}&group_id=44671723@N00&text=${query}`)
      .then(({ data }) => res.json(data.photos.photo))
      .catch(() => res.status(500).send('error'))
      break
    case 'audio':
      axios.get(`${FREESOUND_BASE_URL}/search/text/?query=${query}&token=${process.env.FREESOUND_SECRET_KEY}`)
      .then(({ data }) => {
        if (!data.results.length) return ''

        fetch(`${FREESOUND_BASE_URL}/sounds/${data.results[0].id}/?token=${process.env.FREESOUND_SECRET_KEY}`)
        .then(({ data }) => res.json(data.previews['preview-hq-mp3'].replace('http://', 'https://')))
        .catch(() => res.status(500).send('error'))
      })
      .catch(() => res.status(500).send('error'))
      break
  }
}
