
/**
 * Module constants
 */

var ENTITIES_REGEX = /(^|\s|;|\.|,|:)(audio|sound|🔊|panorama|🌅|image|foto|picture|text|texto|📝|videosphere|video esfera|🎥|video|seconds|second|segundos|⏲|voiceover|voz en off|📢|chart|gráfico|📊|background|fondo|model|modelo)(\s|$|;|\.|,|:)/gi
var LOCATION_REGEX = /right|left|behind|front|atrás|frente|izquierda|derecha/i
var SIZE_REGEX = /tiny|small|large|huge|diminuto|pequeño|grande|enorme/i

module.exports = function (str) {
  return str
  .split('\n')
  .filter(function (p) { return /[0-9]+ (⏲|seconds?|segundos)/.test(p) })
  .map(getObjects)
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
        return {
          type: 'audio',
          src: getUrl(str),
          position: getPosition(str)
        }
      case 'voiceover':
      case 'voz en off':
      case '📢':
        return {
          type: 'voiceover',
          text: getQuote(str)
        }
      case 'chart':
      case 'gráfico':
      case '📊':
        return {
          type: 'chart',
          src: getUrl(str),
          position: getPosition(str, 10, 10),
          rotation: getRotation(str),
          scale: getSize(str)
        }
      case 'panorama':
      case '🌅':
        return {
          type: 'panorama',
          src: getUrl(str)
        }
      case 'video':
        return {
          type: 'video',
          src: getUrl(str),
          position: getPosition(str),
          scale: getSize(str),
          rotation: getRotation(str)
        }
      case 'videosphere':
      case 'video esfera':
      case '🎥':
        return {
          type: 'videosphere',
          src: getUrl(str)
        }
      case 'image':
      case 'picture':
      case 'foto':
        return {
          type: 'image',
          src: getUrl(str),
          position: getPosition(str),
          scale: getSize(str),
          rotation: getRotation(str)
        }
      case 'text':
      case 'texto':
      case '📝':
        var text = getQuote(str)
        return {
          type: 'text',
          text: text,
          position: getPosition(str, 14, text.length / 30),
          scale: getSize(str).map(function (el) { return el * 5 }),
          rotation: getRotation(str)
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
  if (!match.length) return
  if (validate) {
    match = match.filter(function (m) { return validate.test(m) })
  }
  if (!match.length) return

  return match[0]
}

function getQuote (str) {
  var match = str.match(/".*"/)
  if (!(match && match.length)) return
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

function getAbsPos (str, width, height) {
  var xSize = -0.5 * width
  var ySize = -0.5 * height
  switch (str) {
    case 'left':
    case 'izquierda':
      return [-8, 1.6 + ySize, -xSize]
    case 'right':
    case 'derecha':
      return [8, 1.6 + ySize, -xSize]
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
    case 'behind':
    case 'atrás':
      return [0, 180, 0]
    case 'front':
    case 'frente':
      return [0, 0, 0]
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
