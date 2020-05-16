
const EXTERNAL_URLS = {
  chart: 'https://cdn.rawgit.com/impronunciable/aframe-chartbuilder-component/4693e47a/dist/aframe-chartbuilder-component.min.js',
  ply: 'https://rawgit.com/donmccurdy/aframe-extras/v2.1.1/dist/aframe-extras.loaders.min.js',
  sky: 'https://cdn.jsdelivr.net/npm/aframe-sun-sky@3.0.3/dist/aframe-sun-sky.min.js',
  arjs: 'https://cdn.rawgit.com/jeromeetienne/AR.js/1.7.7/aframe/build/aframe-ar.js',
  poly: 'https://unpkg.com/aframe-google-poly-component@1.0.0/dist/aframe-google-poly-component.min.js'
}

const MANUAL_PLAY_TYPES = ['video', 'videosphere', 'audio']

module.exports = story =>
`
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="twitter:card" content="player">
    <meta name="twitter:site" content="@guri_vr">
    <meta name="twitter:title" content="${story.title}">
    <meta name="twitter:image" content="https://s3.amazonaws.com/gurivr/logo_twitter.png">
    <meta name="twitter:description" content="">
    <meta name="twitter:player" content="https://s3.amazonaws.com/gurivr/s/${story._id}.html">
    <meta name="twitter:player:width" content="400">
    <meta name="twitter:player:height" content="370">

    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>${story.title}</title>
    <script src="https://aframe.io/releases/1.0.0/aframe.min.js"></script>
    <script src="https://unpkg.com/aframe-look-at-component@0.5.1/dist/aframe-look-at-component.min.js"></script>
    ${renderExternalUrls(story)}
    <style>
      html, body, #root, #arVideo {
        background-color: ${story.mode === 'ar' ? 'transparent' : '#000'};
        height: 100vh;
        width: 100vw;
        color: #fff;
        font-size: 1.6em;
        text-align: center;
      }

      #root {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -webkit-align-items: center;
        -ms-flex-align: center;
        align-items: center;
      }

      #arVideo {
        width: 100%    !important;
        max-width: 100%    !important;
        height: auto   !important;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1000;
      }
    </style>
  </head>
  <body>
    <a-scene loading-screen="enabled: false">
      <a-entity camera="userHeight: 1.6" look-controls wasd-controls>
        <a-entity id="cursor"
                  cursor="fuse: false; maxDistance: 30; timeout: 500"
                  position="0 0 -5"
                  geometry="primitive: ring; radiusInner: 0.2; radiusOuter: 0.3"
                  material="color: white; shader: flat">
        </a-entity>
      </a-entity>
      <a-assets>${story.chapters.map(renderChapterAssets).filter(assets => assets.trim().length)}</a-assets>
      ${story.chapters.map(renderChapter).join('\n')}
    </a-scene>
    <div id="root" style="background: #000; z-index: 999 !important; cursor: pointer; position: absolute; top: 0; left: 0;" onclick="javascript:start()"><svg style="width:50px;height:50px" viewBox="0 0 24 24"><path fill="#FFFFFF" d="M8,5.14V19.14L19,12.14L8,5.14Z" /></svg></div>
    <script>
      ${renderScript(story)}
    </script>
  </body>
</html>
`

const renderChapterAssets = (chapter, i) => chapter
.map((obj, key) => (obj.src && renderObjectAsset(obj, i, key)) || null)
.filter(asset => !!asset)
.join('\n')

const renderObjectAsset = (obj, i, j) => {
  switch (obj.type) {
    case 'panorama':
    case 'image':
      return `<img src="${obj.src}" id="asset-${i}-${j}" crossorigin="anonymous">`
    case 'video':
    case 'videosphere':
      return `<video src="${obj.src}" id="asset-${i}-${j}" class="chapter-${i}" crossorigin="anonymous"></video>`
    case 'audio':
      return `<audio src="${obj.src}" id="asset-${i}-${j}" class="chapter-${i}" crossorigin="anonymous"></audio>`
    case 'model':
      if (obj.poly) return '';
      const ext = obj.src.split('.')
      return ext[ext.length - 1] === 'obj'
      ? `<a-asset-item src="${obj.src}" id="asset-${i}-${j}-obj"  crossorigin="anonymous"></a-asset-item><a-asset-item src="${obj.mtl}" id="asset-${i}-${j}-mtl"  crossorigin="anonymous"></a-asset-item>`
      : `<a-asset-item src="${obj.src}" id="asset-${i}-${j}"  crossorigin="anonymous"></a-asset-item>`
  }
}

const renderChapter = (chapter, i) => `
  <a-entity class="chapter${needsCursor(chapter) ? ' cursor' : ''}" visible="false">
    ${chapter.map((obj, key) => renderObject(obj, i, key)).join('\n')}
  </a-entity>
`

const renderObject = (obj, i, j) => {
  let str = ''
  if (obj.marker) {
    marker = {
      position: obj.position,
      scale: obj.scale
    }
    obj.position = ['']
    obj.scale = ['']
  }
  switch (obj.type) {
    case 'text':
      str = `<a-entity look-at="0 1.6 0" scale="${obj.scale.join(' ')}" position="${obj.position.join(' ')}" text="value: ${obj.text}; font: roboto; align: center; anchor: center;"></a-entity>`
      break
    case 'panorama':
      str = `<a-sky src="#asset-${i}-${j}"></a-sky>`
      break
    case 'background':
      str = `<a-sky color="${obj.color}"></a-sky>`
      break
    case 'videosphere':
      str = `<a-videosphere src="#asset-${i}-${j}"></a-videosphere>`
      break
    case 'video':
      str = `<a-video look-at="0 1.6 0" scale="${obj.scale.join(' ')}" width="10" height="6" position="${obj.position.join(' ')}" src="#asset-${i}-${j}"></a-video>`
      break
    case 'image':
      str = `<a-image look-at="0 1.6 0" scale="${obj.scale.join(' ')}" width="5" height="5" position="${obj.position.join(' ')}" src="#asset-${i}-${j}"></a-image>`
      break
    case 'audio':
      str = `<a-entity position="${obj.position.join(' ')}" sound="src: #asset-${i}-${j}; autoplay: false;"></a-entity>`
      break
    case 'sky':
      str = `<a-sun-sky material="sunPosition: ${obj.position.join(' ')}; side: back"></a-sun-sky>`
      break
    case 'chart':
      str = `<a-entity position="${obj.position.join(' ')}" chartbuilder="src: ${obj.src}; scale: ${obj.scale.join(' ')};"></a-entity>`
      break
    case 'model':
      if (obj.poly) {
        return `<a-entity rotation="0 90 0" google-poly="src: ${obj.poly.src}; apiKey: ${obj.poly.key}" look-at="0 1.6 0" position="${obj.position.join(' ')}"></a-entity>`
      }
      switch (obj.extension) {
        case 'ply':
          str = `<a-entity look-at="0 1.6 0" ply-model="src: #asset-${i}-${j}" position="${obj.position.join(' ')}"></a-entity>`
          break
        case 'obj':
          str = `<a-entity look-at="0 1.6 0" scale="${obj.scale.join(' ')}" position="${obj.position.join(' ')}" obj-model="obj: #asset-${i}-${j}-obj; mtl:  #asset-${i}-${j}-mtl;"></a-entity>`
          break
        case 'dae':
        default:
          str = `<a-collada-model look-at="0 1.6 0" scale="${obj.scale.join(' ')}" position="${obj.position.join(' ')}" src="#asset-${i}-${j}"></a-collada-model>`
          break
      }
  }
  if (!obj.marker) {
    return str
  } else {
    return `
      <a-marker preset="hiro">
        ${str}
      </a-marker>
    `
  }
}

const renderScript = story => {
  const chapters = story.chapters
  const times = []
  const voices = []
  chapters.forEach(chapter => {
    var time = chapter.filter(obj => obj.type === 'duration')
    times.push(time.length ? time[0].value : null)

    var voice = chapter.filter(obj => obj.type === 'voiceover')
    voices.push(voice.length ? voice[0] : null)
  })

  return `
    var times = ${JSON.stringify(times)};
    var voices = ${JSON.stringify(voices)};

    var chapters = document.querySelectorAll('.chapter');
    var cursor = document.querySelector('#cursor')
    var prevIdx = null;
    var cancelNext;

    function nextChapter(i) {
      if(i >= chapters.length) return end();

      clearTimeout(cancelNext);

      var curr = chapters[i];
      var prev;

      if (prevIdx != null) {
        prev = chapters[prevIdx];
      }

      playVoiceover(i);

      if (curr.classList.contains('cursor')) {
        cursor.setAttribute('visible', 'true');
      } else {
        cursor.setAttribute('visible', 'false');
      }

      if (prevIdx != null) {
        prev.setAttribute('visible', false);
      }
      curr.setAttribute('visible', true);

      if (prevIdx != null) {
        var assets = document.querySelectorAll('.chapter-' + prevIdx);
        for (var j = 0; j < assets.length; j++) {
          assets[j] && assets[j].pause && assets[j].pause();
        }
      }

      assets = document.querySelectorAll('.chapter-' + i);
      for (var j = 0; j < assets.length; j++) {
        assets[j] && assets[j].play && assets[j].play();
      }

      if (times[i]) {
        cancelNext = setTimeout(function() {
          nextChapter(i + 1);
        }, times[i] * 1000);
      }

      prevIdx = i
    }

    function start() {
      document.querySelector('a-scene').setAttribute('vr-mode-ui', 'enabled: true');
      var $root = document.querySelector('#root');
      $root.parentNode.removeChild($root);
      nextChapter(0);
    }

    function end() {
      document.body.innerHTML = '<div id="root" style="background: #000; cursor: pointer" onclick="javascript:window.location = window.location"><svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg></div>';
    }

    function playVoiceover(i) {
      if (voices[i]) {
        try {
          speechSynthesis.cancel();
          var txt = new SpeechSynthesisUtterance(voices[i].text);
          txt.lang = voices[i].lang;
          speechSynthesis.speak(txt);
        } catch (err) {}
      }
    }
    ${!needsManualPlay(story.chapters) ? 'start()' : ''}

    ${story.mode === 'ar' ? renderARScript() : ''}
  `
}

const renderARScript = () =>
`
  var sky = document.querySelectorAll('a-sky, a-panorama, a-videosphere');

  for (var i = 0; i < sky.length; i++) {
    sky[i].setAttribute('visible', 'false');
  }

  var scene = document.querySelector('a-scene');
  scene.setAttribute('arjs', 'arjs')
  scene.setAttribute('embedded', 'embedded')
`

const renderExternalUrls = story => {
  const loaded = {}
  const urls = []
  if (story.mode === 'ar') {
    urls.push(EXTERNAL_URLS.arjs)
  }
  story.chapters.forEach(chapter => chapter.forEach(entity => {
    if (!loaded.poly) {
      urls.push(EXTERNAL_URLS.poly)
      loaded.poly = true
    }
    switch (entity.type) {
      case 'chart':
        if (!loaded.chart) {
          urls.push(EXTERNAL_URLS.chart)
          loaded.chart = true
        }
        break
      case 'model':
        if (!loaded.ply && entity.extension === 'ply') {
          urls.push(EXTERNAL_URLS.ply)
          loaded.ply = true
        }
        break
      case 'sky':
        if (!loaded.sky) {
          urls.push(EXTERNAL_URLS.sky)
          loaded.sky = true
        }
        break
    }
  }))

  return urls.map(url => `<script src="${url}"></script>`).join('\n')
}

/**
 * Render click event
 */

const renderEvents = obj => ` onclick="nextChapter(${obj.link})"`

/**
 * Checks if needs a play button for audios and videos
 */

const needsManualPlay = chapters => {
  for (let i = 0; i < chapters.length; i++) {
    for (let j = 0; j < chapters[i].length; j++) {
      if (MANUAL_PLAY_TYPES.indexOf(chapters[i][j].type) !== -1) {
        return true
      }
    }
  }

  return false
}

/**
 * Check if a cursor is needed for this scene. If there is at least
 * one link, then we need a cursor for it
 */

const needsCursor = chapter => {
  for (let i = 0; i < chapter.length; i++) {
    if (typeof chapter[i].link !== 'undefined') return true
  }
}
