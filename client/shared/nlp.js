
/**
 * Module constants
 */

var TYPES = {
  'audio': { alias: ['sound', '🔊'] },
  'panorama': { alias: ['🌅'] },
  'image': { alias: ['foto', 'picture'] },
  'text': { alias: ['texto', '📝'] },
  'videosphere': { alias: ['video esfera', '🎥'] },
  'video': { alias: [] },
  'seconds': { alias: ['second', 'segundo', 'segundos', '⏲'] },
  'voiceover': { alias: ['voz en off', '📢'] },
  'chart': { alias: ['gráfico', '📊'] },
  'background': { alias: ['fondo'] },
  'model': { alias: ['modelo'] },
  'sky': { alias: ['cielo'] }
}

var ENTITIES_REGEX = new RegExp('(^|\\s|;|\\.|,|:)(' + Object.keys(TYPES).map(function (type) { return TYPES[type].alias.concat(type).join('|') }).join('|') + ')(\\s|$|;|\\.|,|:)', 'gi')
var LOCATION_REGEX = /right|left|behind|front|above|below|atrás|frente|izquierda|derecha|arriba|abajo/gi
var SIZE_REGEX = /tiny|small|large|huge|diminuto|pequeño|grande|enorme/i
var SUN_POSITION_REGEX = /sunrise|sunset|morning|noon|afternoon|evening|night|amanecer|atardecer|mañana|mediodía|tarde|noche/i
var LATLON_REGEX = /\-?\d+\.\d+,\s*\-?\d+\.\d+/

module.exports = function (str) {
  return str
  .split('\n')
  .map(getObjects)
  .filter(function (obj) { return obj.length })
}

function getObjects (p) {
  var entities = []
  var entity

  // Iterate over the paragraph and extract entities
  while ((entity = ENTITIES_REGEX.exec(p)) !== null) {
    entities.push({ type: entity[2].trim(), index: entity.index })
  }

  // Extract attributes for each entity
  return entities.map(function (entity, i) {
    // for backwards words I'm going back to the previous entity and add the length
    var sp = i !== 0
    ? p.substring(entities[i - 1].index + entities[i - 1].type.length, entities[i].index + entities[i].type.length + 1)
    : p.substring(0, entities[i].index + entities[i].type.length + 1)

    // special case for duration
    var match
    if (entity.type === 'seconds' || entity.type === 'second' || entity.type === '⏲' || entity.type === 'segundos') {
      match = sp.match(/[0-9]+ (⏲|seconds?|segundos)/)
      if (!match) return false

      return {
        type: 'duration',
        value: parseInt(match[0].replace(/(⏲|seconds?|segundos)/, ''), 10)
      }
    } else if (entity.type === 'background') {
      match = sp.match(/(#[a-fA-F0-9]{3,6}|\w+) background/i)
      return {
        type: 'background',
        color: match[0].replace(' background', '')
      }
    }

    // Get the portion of the text relative to this entity
    sp = i === entities.length - 1
    ? p.substring(entity.index)
    : p.substring(entity.index, entities[i + 1].index + 1)

    var str = sp
    switch (entity.type) {
      case 'audio':
      case 'sound':
      case '🔊':
        var audioUrl = getUrl(str)
        var audioQuote = getQuote(str)
        if (!(audioUrl || audioQuote)) return
        return {
          type: 'audio',
          src: audioUrl,
          text: !audioUrl && audioQuote,
          position: getPosition(str)
        }
      case 'voiceover':
      case 'voz en off':
      case '📢':
        var voiceoverQuote = getQuote(str)
        if (!voiceoverQuote) return
        return {
          type: 'voiceover',
          text: voiceoverQuote
        }
      case 'chart':
      case 'gráfico':
      case '📊':
        var chartUrl = getUrl(str)
        if (!chartUrl) return
        var chartPos = getPosition(str, 10, 10)
        return {
          type: 'chart',
          src: chartUrl,
          position: chartPos,
          scale: getSize(str)
        }
      case 'panorama':
      case '🌅':
        var panoUrl = getUrl(str)
        var panoQuote = getQuote(str)
        var panoLatLon = getLatLon(str)
        if (!(panoUrl || panoQuote || panoLatLon)) return
        return {
          type: 'panorama',
          src: panoUrl,
          text: !panoUrl && panoQuote,
          latlon: !(panoUrl || panoQuote) && panoLatLon
        }
      case 'video':
        var videoUrl = getUrl(str)
        if (!videoUrl) return
        var videoPos = getPosition(str)
        return {
          type: 'video',
          src: videoUrl,
          position: videoPos,
          scale: getSize(str)
        }
      case 'videosphere':
      case 'video esfera':
      case '🎥':
        var sphereUrl = getUrl(str)
        if (!sphereUrl) return
        return {
          type: 'videosphere',
          src: sphereUrl
        }
      case 'image':
      case 'picture':
      case 'foto':
        var imgUrl = getUrl(str)
        var imgQuote = getQuote(str)
        if(!(imgUrl || imgQuote)) return
        var imgPos = getPosition(str)
        return {
          type: 'image',
          src: imgUrl,
          text: !imgUrl && imgQuote,
          position: imgPos,
          scale: getSize(str)
        }
      case 'text':
      case 'texto':
      case '📝':
        var textQuote = getQuote(str)
        if (!textQuote) return
        var textPos = getPosition(str/*, 14, textQuote.length / 30*/)
        return {
          type: 'text',
          text: textQuote,
          position: textPos,
          scale: getSize(str).map(function (el) { return el * 5 })
        }
      case 'sky':
      case 'cielo':
        return {
          type: 'sky',
          position: getSunPosition(str)
        }
      case 'model':
      case 'modelo':
        var url = getUrl(str, /\.obj$/)
        var mtl = null
        var ext = ''
        if (url) {
          mtl = getUrl(str, /\.mtl$/)
          ext = ['obj']
        } else {
          url = getUrl(str)
          if (url) {
            ext = url.split('.')
          }
        }

        if (!url) return
        var modelPos = convertModelPosition(getPosition(str))
        return {
          type: 'model',
          src: url,
          mtl: mtl,
          extension: ext[ext.length - 1],
          position: modelPos,
          scale: getSize(str)
        }
      case 'fondo':
        match = sp.match(/fondo (#[a-fA-F0-9]{3,6})/i)
        if (!(match && match.length >= 2)) return
        return {
          type: 'background',
          color: match[1]
        }
    }

    return entity
  })
  .filter(function (entity) { return !!entity })
}

function convertModelPosition (pos) {
  return [pos[0], pos[1] - 3, pos[2]]
}

function getUrl (str, validate) {
  var match = str.match(/https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
  if (!(match && match.length)) return
  if (validate) {
    match = match.filter(function (m) { return validate.test(m) })
  }
  if (!match.length) return

  return match[0]
}

function getQuote (str) {
  var match = str.match(/".*"/)
  if (!(match && match.length)) return ''
  return match[0].replace(/"/g, '')
}

function getPosition (str, width, height) {
  width = width || 0
  height = height || 0

  var positions = []
  var position = null
  var input = str
  var distance = null
  while ((position = LOCATION_REGEX.exec(str)) !== null) {
    positions.push({ type: position[0], index: position.index })
    distance = input.substring(0, position.index).match(/(\d*(\.\d+)?) (meter|metro)/i)
    positions[positions.length - 1].distance = distance && distance.length ? parseFloat(distance[0].replace(/meter|metro/i, '')) : 0
    input = input.slice(position.index)
  }
  return getAbsPos(positions.length ? positions : [{type: 'front', distance: 0}], width, height)
}

function getSize (str) {
  var match = str.match(SIZE_REGEX)
  return getAbsSize(match && match.length ? match[0] : 'normal')
}

function getAbsPos (positions, width, height) {
  var xSize = -0.5 * width
  var ySize = -0.5 * height
  var initialPosition = [0, 1.6, 0]
  for (var i = 0; i < positions.length; i++) {
    switch (positions[i].type) {
      case 'left':
      case 'izquierda':
        initialPosition[0] -= positions[i].distance || 7
        initialPosition[1] += ySize
        initialPosition[2] -= xSize
        break
      case 'right':
      case 'derecha':
        initialPosition[0] += positions[i].distance || 7
        initialPosition[1] += ySize
        initialPosition[2] += xSize
        break
      case 'above':
      case 'arriba':
        initialPosition[0] += xSize
        initialPosition[1] += positions[i].distance || 6
        break
      case 'below':
      case 'abajo':
        initialPosition[0] += xSize
        initialPosition[1] -= positions[i].distance || 3
        break
      case 'behind':
      case 'atrás':
        initialPosition[0] -= xSize
        initialPosition[1] += ySize
        initialPosition[2] += positions[i].distance || 8
        break
      case 'front':
      case 'frente':
      default:
        initialPosition[0] += xSize
        initialPosition[1] += ySize
        initialPosition[2] -= positions[i].distance || 8
        break
    }
  }
  return initialPosition
}

function getAbsSize (str) {
  switch (str) {
    case 'tiny':
    case 'diminuto':
      return [1 / 3, 1 / 3, 1 / 3]
    case 'small':
    case 'pequeño':
      return [1 / 2, 1 / 2, 1 / 2]
    case 'large':
    case 'grande':
      return [2, 2, 2]
    case 'huge':
    case 'enorme':
      return [3, 3, 3]
    default:
      return [1, 1, 1]
  }
}

function getSunPosition (str) {
  var match = str.match(SUN_POSITION_REGEX)
  return getAbsSunPos(match && match.length ? match[0] : null)
}

function getAbsSunPos (str) {
  switch (str) {
    case 'noon': case 'mediodía':
      return [0, 1, 0]
    case 'sunrise': case 'sunset': case 'amanecer': case 'atardecer':
      return [0, 0, -1]
    case 'evening': case 'night': case 'noche':
      return [10, -1, 0]
    case 'morning': case 'afternoon': case 'mañana': case 'tarde':
    default:
      return [1, 0.5, 0]
  }
}

function getLatLon (str) {
  var match = str.match(LATLON_REGEX)
  if (!(match && match.length)) return null
  return match[0].split(',').map(parseFloat)
}
