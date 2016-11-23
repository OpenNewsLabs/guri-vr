
/**
 * Module dependencies
 */

const request = require('axios')
const config = require('./config.json')
const uploader = require('./uploader')

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
      request(`${FLICKR_BASE_URL}${FLICKR_PARAMS}&text=${query}`)
			.then(data => res.json(data.photos.photo))
			.catch(next)
    break
    case 'panorama':
    default:
      request(`${FLICKR_BASE_URL}${FLICKR_PARAMS}&group_id=44671723@N00&text=${query}`)
			.then(data => res.json(data.photos.photo))
			.catch(next)
      break
    case 'audio':
      request(`${FREESOUND_BASE_URL}/search/text/?query=${query}&token=${config.searchApis.freesound}`)
      .then(({ results }) => {
        if (!results.length) res.json('')

        request(`${FREESOUND_BASE_URL}/sounds/${results[0].id}/?token=${config.searchApis.freesound}`)
        .then(({ previews }) => res.json(previews['preview-hq-mp3'].replace('http://', 'https://')))
        .catch(next)
      })
      .catch(next)
			break
		case '3dmodel':
			request(`${CLARA_BASE_URL}?page=1&perPage=1&type=library&query=${query}`)
				.then(data => {
					console.log(data.data.total)
				if (!data.data.total) {
					return res.json('')
				}
					
				request.get(`${CLARA_BASE_URL}/${data.data.models[0]._id}/export/dae?zip=true&centerScene=true`, {responseType: 'blob'})
				.then(response => {
					const stream = response.data
					uploader.unzipToS3(stream)
					.on('end', () => )
				})
				.catch(next)
			})
			.catch(next)
			break
  }
}
