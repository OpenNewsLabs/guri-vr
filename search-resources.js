
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
const CLARA_BASE_URL = 'https://clara.io/api/scenes'

module.exports = (req, res, next) => {
  const { type, query } = req.query

  switch (type) {
    case 'image':
      fetch(`${FLICKR_BASE_URL}${FLICKR_PARAMS}&text=${query}`)
      .then(response => response.json())
			.then(data => res.json(data.photos.photo))
			.catch(next)
    break
    case 'panorama':
    default:
      fetch(`${FLICKR_BASE_URL}${FLICKR_PARAMS}&group_id=44671723@N00&text=${query}`)
      .then(response => response.json())
			.then(data => res.json(data.photos.photo))
			.catch(next)
      break
    case 'audio':
      fetch(`${FREESOUND_BASE_URL}/search/text/?query=${query}&token=${config.searchApis.freesound}`)
      .then(response => response.json())
      .then(({ results }) => {
        if (!results.length) res.json('')

        fetch(`${FREESOUND_BASE_URL}/sounds/${results[0].id}/?token=${config.searchApis.freesound}`)
        .then(response => response.json())
        .then(({ previews }) => res.json(previews['preview-hq-mp3'].replace('http://', 'https://')))
        .catch(next)
      })
      .catch(next)
			break
		case '3dmodel':
			fetch(`${CLARA_BASE_URL}?page=1&perPage=1&type=library&query=${query}`)
			.then(response => response.json())
			.then(data => res.json(data))
			.then(data => {
				if (!data.total) {
					return res.json('')
				}

				fetch(`${CLARA_BASE_URL}/https://clara.io/api/scenes/${data.models[0]._id}/export/obj?zip=true&centerScene=true`)
				.then(response => response.json())
				.then(data => {
				})
			})
			.catch(next)	
			break
  }
}
