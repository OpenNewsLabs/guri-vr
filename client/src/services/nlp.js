
export default str => str
.split('\n')
.filter(p => /seconds?/.test(p))
.map(getObjects);

function getObjects(p) {

  var objects = p.match(/(audio|sound|panorama|image|picture|text|videosphere|video|seconds|voiceover|chart)/gi) || [];

  return objects.map(function(obj, i){
    // special case for duration
    if(obj === 'seconds') {
      var match = p.match(/[0-9]+ seconds/i)
      p = p.slice(p.indexOf(obj) + obj.length)
      return {
        type: 'duration',
        value: parseInt(match[0].replace(' seconds', ''), 10)
      }
    }

    p = p.slice(p.indexOf(obj) + obj.length)
    var strLength = i === objects.length - 1 ? p.length : p.indexOf(objects[i+1])
    var str = p.substr(0, strLength)

    switch(obj) {
      case 'audio':
      case 'sound':
        return {
          type: 'audio',
          src: getUrl(str),
          position: getPosition(str)
        }
      case 'voiceover':
        return {
          type: 'voiceover',
          text: getQuote(str)
        };
      case 'chart':
        return {
          type: 'chart',
          src: getUrl(str)
        };
      case 'panorama':
      return {
        type: 'panorama',
        src: getUrl(str)
      }
      case 'video':
      return {
        type: 'video',
        src: getUrl(str),
        position: getPosition(str),
        scale: getSize(str)
      }
      case 'videosphere':
      return {
        type: 'videosphere',
        src: getUrl(str)
      }
      case 'image':
      case 'picture':
      return {
        type: 'image',
        src: getUrl(str),
        position: getPosition(str),
        scale: getSize(str)
      }
      case 'text':
      var text = getQuote(str);
      return {
        type: 'text',
        text: text,
        position: getPosition(str, text),
        scale: getSize(str)
      }

    }
    return obj
  })

}

function getUrl(str) {
  var match = str.match(/https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)
  if(!match.length) return
  return match[0].toLowerCase()
}

function getQuote(str) {
  var match = str.match(/["].*["]/)
  if(!(match && match.length)) return
  return match[0].replace(/"/g, '')
}

function getPosition(str, text) {
  var match = str.match(/right|left|behind|front/i)
  if(match && match.length) return getAbsPos(match[0])
  return text ? [-1*(text.length * .15), 1.5, 0] : [0, 4, 0]
}

function getSize(str) {
  var match = str.match(/tiny|small|large|huge/i)
  if(match && match.length) return getAbsSize(match[0])
  return 1
}

function getAbsPos(str) {
  switch(str) {
    case 'left':
      return [-2, 4, 0]
    case 'right':
      return [2, 4, 0]
    case 'behind':
      return [0, 4, 8]
    case 'front':
      return [0, 4, 0]
  }
}

function getAbsSize(str) {
  switch(str) {
    case 'tiny':
      return 1/3
    case 'small':
      return 1/2
    case 'large':
      return 2
    case 'huge':
      return 3
    default:
      return 1
  }
}
