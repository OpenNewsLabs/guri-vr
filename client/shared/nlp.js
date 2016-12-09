
/**
 * Module constants
 */

var TYPES = {
  'audio': { alias: ['sound', '🔊'] },
  'panorama': { alias: ['🌅'] },
  'image': { alias: ['foto', 'picture', 'imagen'] },
  'text': { alias: ['texto', '📝'] },
  'videosphere': { alias: ['video esfera', '🎥'] },
  'video': { alias: [] },
  'seconds': { alias: ['segundos', '⏲'] },
  'voiceover': { alias: ['voz en off', '📢'] },
  'chart': { alias: ['gráfico', '📊'] },
  'background': { alias: ['fondo'] },
  'model': { alias: ['modelo'] },
  'sky': { alias: ['cielo'] }
}

var ENTITIES_REGEX = new RegExp('(^|\\s|;|\\.|,|:)(' + Object.keys(TYPES).map(function (type) { return TYPES[type].alias.concat(type).join('|') }).join('|') + ')(\\s|$|;|\\.|,|:)', 'gi')
var LOCATION_REGEX = /right|left|behind|front|above|below|atrás|frente|izquierda|derecha|arriba|abajo/i
var SIZE_REGEX = /tiny|small|large|huge|diminuto|pequeño|grande|enorme/i
var SUN_POSITION_REGEX = /sunrise|sunset|morning|noon|afternoon|evening|night|amanecer|atardecer|mañana|mediodía|tarde|noche/i
var LATLON_REGEX = /\-?\d+\.\d+,\s*\-?\d+\.\d+/
var SCENE_LINK_REGEX = /(first|second|third|fourth|fifth|sixth|primera|segunda|tercera|cuarta|quinta|sexta) (scene|escena)/i
var SCENE_INDEXES = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'primera', 'segunda', 'tercera', 'cuarta', 'quinta', 'sexta']

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
    if (entity.type === 'seconds' || entity.type === 'second' || entity.type === '⏲' || entity.type === 'segundo' || entity.type === 'segundos') {
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
        return {
          type: 'chart',
          src: chartUrl,
          position: getPosition(str, 10, 10),
          rotation: getRotation(str),
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
        return {
          type: 'video',
          src: videoUrl,
          position: getPosition(str),
          scale: getSize(str),
          rotation: getRotation(str),
          link: getLink(str)
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
      case 'imagen':
        var imgUrl = getUrl(str)
        var imgQuote = getQuote(str)
        if(!(imgUrl || imgQuote)) return
        return {
          type: 'image',
          src: imgUrl,
          text: !imgUrl && imgQuote,
          position: getPosition(str),
          scale: getSize(str),
          rotation: getRotation(str),
          link: getLink(str)
        }
      case 'text':
      case 'texto':
      case '📝':
        var textQuote = getQuote(str)
        if (!textQuote) return
        return {
          type: 'text',
          text: textQuote,
          position: getPosition(str, 14, textQuote.length / 30),
          scale: getSize(str).map(function (el) { return el * 5 }),
          rotation: getRotation(str)
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
        return {
          type: 'model',
          src: url,
          mtl: mtl,
          extension: ext[ext.length - 1],
          position: convertModelPosition(getPosition(str)),
          scale: getSize(str),
          rotation: getRotation(str)
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
  var match = str.match(LOCATION_REGEX)
  return getAbsPos(match && match.length ? match[0] : 'front', width, height)
}

function getSize (str) {
  var match = str.match(SIZE_REGEX)
  return getAbsSize(match && match.length ? match[0] : 'normal')
}

function getLink (str) {
  var match = str.match(SCENE_LINK_REGEX)
  if (!(match && match.length >= 2 && SCENE_INDEXES.indexOf(match[1]) !== -1)) return
  return SCENE_INDEXES.indexOf(match[1]) % (SCENE_INDEXES.length / 2)
}

function getAbsPos (str, width, height) {
  var xSize = -0.5 * width
  var ySize = -0.5 * height
  switch (str) {
    case 'left':
    case 'izquierda':
      return [-7, 1.6 + ySize, -xSize]
    case 'right':
    case 'derecha':
      return [7, 1.6 + ySize, +xSize]
    case 'above':
    case 'arriba':
      return [xSize, 6, 0]
    case 'below':
    case 'abajo':
      return [xSize, -3, 0]
    case 'behind':
    case 'atrás':
      return [-xSize, 1.6 + ySize, 8]
    case 'front':
    case 'frente':
    default:
      return [0 + xSize, 1.6 + ySize, -8]
  }
}

function getRotation (str) {
  var match = str.match(LOCATION_REGEX)
  var pos = match && match.length ? match[0] : 'front'
  switch (pos) {
    case 'left':
    case 'izquierda':
      return [0, 90, 0]
    case 'right':
    case 'derecha':
      return [0, -90, 0]
    case 'above':
    case 'arriba':
      return [90, 0, 0]
    case 'below':
    case 'abajo':
      return [-90, 0, 0]
    case 'behind':
    case 'atrás':
      return [0, 180, 0]
    case 'front':
    case 'frente':
    default:
      return [0, 0, 0]
  }
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
