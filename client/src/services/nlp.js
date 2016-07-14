
export default str => str
.split('\n')
.filter(p => /seconds?/.test(p))
.map(getObjects);

function getObjects(p) {

  var objects = p.match(/(audio|sound|panorama|image|picture|text|videosphere|video|seconds|voiceover|chart|background)/gi) || [];

  return objects.map(function(obj, i){
    // special case for duration
    if(obj === 'seconds') {
      var match = p.match(/[0-9]+ seconds/i)
      p = p.slice(p.indexOf(obj) + obj.length)
      return {
        type: 'duration',
        value: parseInt(match[0].replace(' seconds', ''), 10)
      }
    } else if (obj === 'background') {
      var match = p.match(/(#[a-fA-F0-9]{3,6}|\w+) background/i)

      p = p.slice(p.indexOf(obj) + obj.length)
      return {
        type: 'background',
        color: match[0].replace(' background', '')
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
          src: getUrl(str),
          position: getPosition(str, 10, 10),
          rotation: getRotation(str),
          scale: getSize(str)
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
        scale: getSize(str),
        rotation: getRotation(str)
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
        scale: getSize(str),
        rotation: getRotation(str)
      }
      case 'text':
      var text = getQuote(str);
      return {
        type: 'text',
        text: text,
        position: getPosition(str, text.length * .3),
        scale: getSize(str),
        rotation: getRotation(str)
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

function getPosition(str, width=0, height=0) {
  var match = str.match(/right|left|behind|front/i)
  return getAbsPos(match && match.length ? match[0] : 'front', width, height)
}

function getSize(str) {
  var match = str.match(/tiny|small|large|huge/i)
  return getAbsSize(match && match.length ? match[0] : 'normal')
}

function getAbsPos(str, width, height) {
  var xSize = -.5 * width;
  var ySize = -.5 * height;
  switch(str) {
    case 'left':
      return [-5, 1.5 + ySize, 5 - xSize]
    case 'right':
      return [5, 1.5 + ySize, 5 + xSize]
    case 'behind':
      return [-xSize, 1.5 + ySize, 8]
    case 'front':
      return [0 + xSize, 1.5 + ySize, 0]
  }
}

function getRotation(str) {
  var match = str.match(/right|left|behind|front/i);
  var pos = match && match.length ? match[0] : 'front';
  switch(pos) {
    case 'left':
      return [0, 90, 0]
    case 'right':
      return [0, -90, 0]
    case 'behind':
      return [0, 180, 0]
    case 'front':
      return [0, 0, 0]
    default:
      return [0, 0, 0]
  }
}

function getAbsSize(str) {
  switch(str) {
    case 'tiny':
      return [1/3, 1/3, 1/3]
    case 'small':
      return [1/2, 1/2, 1/2]
    case 'large':
      return [2, 2, 2]
    case 'huge':
      return [3, 3, 3]
    default:
      return [1, 1, 1]
  }
}
