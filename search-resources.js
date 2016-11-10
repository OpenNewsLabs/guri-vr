
/**
 * Module dependencies
 */

require('isomorphic-fetch')
const config = require('./config.json')

/**
 * Module constants
 */

const FLICKR_BASE_URL = 'https://api.flickr.com/services/rest/?method=flickr.photos.search'
const FLICKR_PARAMS = `&per_page=5&license=1,2,3,4,5,6,7&format=json&nojsoncallback=1&extras=url_o,url_k,url_t&api_key=${config.searchApis.flickr}`
const FREESOUND_BASE_URL = 'http://www.freesound.org/apiv2'

module.exports = (req, res) => {
  const { type, query } = req.query

  switch (type) {
    case 'image':
      fetch(`${FLICKR_BASE_URL}${FLICKR_PARAMS}&text=${query}`)
      .then(response => response.json())
      .then(data => res.json(data.photos.photo))
    break
    case 'panorama':
    default:
      fetch(`${FLICKR_BASE_URL}${FLICKR_PARAMS}&group_id=44671723@N00&text=${query}`)
      .then(response => response.json())
      .then(data => res.json(data.photos.photo))
      break
    case 'audio':
      fetch(`${FREESOUND_BASE_URL}/search/text/?query=${query}&token=${config.searchApis.freesound}`)
      .then(response => response.json())
      .then(({ results }) => {
        if (!results.length) return null

        fetch(`${FREESOUND_BASE_URL}/sounds/${results[0].id}/?token=${config.searchApis.freesound}`)
        .then(response => response.json())
        .then(({ previews }) => res.json(previews['preview-hq-mp3']))
        .catch(() => res.status(500).send('error'))
      })
      .catch(() => res.status(500).send('error'))
      break
  }
}
