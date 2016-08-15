
const config = require('./config.json');

module.exports = story =>
`
<!doctype html>
<html>
  <head>
    <meta name="twitter:card" content="player">
    <meta name="twitter:site" content="@guri_vr">
    <meta name="twitter:title" content="${story.title}">
    <meta name="twitter:image" content="${getMainImage(story.chapters)}">
    <meta name="twitter:description" content="">
    <meta name="twitter:player" content="https://s3.amazonaws.com/gurivr/s/${story._id}.html">
    <meta name="twitter:player:width" content="400">
    <meta name="twitter:player:height" content="370">

    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>${story.title}</title>
    <script src="https://s3.amazonaws.com/gurivr/aframe.min.js"></script>
    ${getChartUrl(story)}
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
    <a-scene>
      <a-assets>
      ${story.chapters.map(renderChapterAssets).join('\n')}
      </a-assets>
      <a-sky color="#000"></a-sky>
      ${story.chapters.map(renderChapter).join('\n')}
    </a-scene>
    
    ${story.mode === 'ar' ? '<video autoplay="true" id="arVideo">' : ''}
    <script>
      ${renderScript(story)}
    </script>
  </body>
</html>
`;

const renderChapterAssets = (chapter, i) => chapter
.map((obj, key) => (obj.src && renderObjectAsset(obj, i, key)) || null)
.filter(asset => !!asset)
.join('\n');

const renderObjectAsset = (obj, i, j) => {
  switch (obj.type) {
    case 'panorama':
    case 'image':
      return `<img src="${obj.src}" id="asset-${i}-${j}" crossorigin="anonymous">`;
    case 'video':
    case 'videosphere':
      return `<video src="${obj.src}" id="asset-${i}-${j}" class="chapter-${i}" crossorigin="anonymous">`;
    case 'audio':
      return `<audio src="${obj.src}" id="asset-${i}-${j}" class="chapter-${i}"  crossorigin="anonymous">`;
    case 'model':
      return `<a-asset-item src="${obj.src}" id="asset-${i}-${j}"  crossorigin="anonymous"></a-asset-item>`;
  }
};

const renderChapter = (chapter, i) =>`
  <a-entity class="chapter" visible="${ i === 0 ? 'true' : 'false' }">
    ${chapter.map((obj, key) => renderObject(obj, i, key)).join('\n')}
  </a-entity>
`;

const renderObject = (obj, i, j) => {
  switch(obj.type) {
  case 'text':
    return `<a-entity scale="${obj.scale.join(' ')}" rotation="${obj.rotation.join(' ')}" position="${obj.position.join(' ')}" bmfont-text="text: ${obj.text}; width: 600; color: white; align: center;"></a-entity>`;
  case 'panorama':
    return `<a-sky rotation="0 180 0" src="#asset-${i}-${j}"></a-sky>`;
  case 'background':
    return `<a-sky rotation="0 180 0" color="${obj.color}"></a-sky>`;
  case 'videosphere':
    return `<a-videosphere src="#asset-${i}-${j}"></a-videosphere>`;
  case 'video':
    return `<a-video scale="${obj.scale.join(' ')}" width="10" height="6" rotation="${obj.rotation.join(' ')}" position="${obj.position.join(' ')}" src="#asset-${i}-${j}"></a-video>`;
  case 'image':
    return `<a-image scale="${obj.scale.join(' ')}" width="5" height="5" rotation="${obj.rotation.join(' ')}" position="${obj.position.join(' ')}" src="#asset-${i}-${j}" ></a-image>`;
  case 'audio':
    return `<a-entity position="${obj.position.join(' ')}" sound="src: ${obj.src};"></a-entity>`;
  case 'chart':
    return `<a-entity rotation="${obj.rotation.join(' ')}" position="${obj.position.join(' ')}" chartbuilder="src: ${obj.src}; scale: ${obj.scale.join(' ')};"></a-entity>`;
  case 'model':
  return `<a-collada-model scale="${obj.scale.join(' ')}" rotation="${obj.rotation.join(' ')}" position="${obj.position.join(' ')}" src="#asset-${i}-${j}"></a-collada-model>`;
  }
}

const renderScript = story => {
  const chapters = story.chapters;
  const times = [];
  const voices = [];
  chapters.forEach(chapter =>
    chapter.filter(obj => obj.type === 'duration')
    .forEach(obj => times.push(obj.value)));

  chapters.forEach(chapter => {
    var voice = chapter.filter(obj => obj.type === 'voiceover');
    voices.push(voice.length ? voice[0].text : null);
  });


  return `
    var times = ${JSON.stringify(times)};
    var voices = ${JSON.stringify(voices)};

    var chapters = document.querySelectorAll('.chapter');
    var actual = 0;

    function nextChapter() {
      if(actual >= chapters.length) return end();

      var prev = actual ? chapters[actual - 1] : chapters[0];
      var prevIdx = actual ? actual - 1 : 0;
      var curr = chapters[actual];
      playVoiceover();

      prev.setAttribute('visible', false);
      curr.setAttribute('visible', true);

      var assets = document.querySelectorAll('.chapter-' + prevIdx);
      for (var i = 0; i < assets.length; i++) {
        assets[i] && assets[i].pause && assets[i].pause();
      }

      assets = document.querySelectorAll('.chapter-' + actual);
      for (var i = 0; i < assets.length; i++) {
        assets[i] && assets[i].play && assets[i].play();
      }

      setTimeout(nextChapter, times[actual] * 1000);
      actual++;
    }

    function end() {
        document.body.innerHTML = '<div id="root" style="background: #000" onclick="javascript:window.location = window.location"><svg fill="#FFFFFF" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg></div>';
    }

    function playVoiceover() {
      if (voices[actual]) {
        try {
          speechSynthesis.cancel();
          var txt = new SpeechSynthesisUtterance(voices[actual]);
          speechSynthesis.speak(txt);
        } catch (err) {}
      }
    }

    document.querySelector('a-assets').addEventListener('loaded', nextChapter);

    ${story.mode === 'ar' ? renderARScript() : ''}
  `;
};

const renderARScript = () =>
`
  var sky = document.querySelectorAll('a-sky, a-panorama, a-videosphere');

  for (var i = 0; i < sky.length; i++) {
    sky[i].setAttribute('visible', 'false');
  }

  var video = document.querySelector("#arVideo");
  navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

  if (navigator.getUserMedia) {
    navigator.getUserMedia({video: true}, handleVideo, videoError);
  }
  
  function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);
  }
  
  function videoError(e) {
    alert('There was an error trying to get your camera stream :(');
  }
`;

const getChartUrl = story => {
  var charts = false;
  story.chapters.forEach(chapter => {
    chapter.forEach(obj => {
      if(obj.type === 'chart') charts = true;
    });
  });

  return charts ? '<script src="https://s3.amazonaws.com/gurivr/aframe-chartbuilder-component.js"></script>' :
  '<script src="https://s3.amazonaws.com/gurivr/aframe-bmfont-text-component.min.js"></script>';
};

const getMainImage = chapters => {
  for (var i = 0; i < chapters.length; i++) {
    for (var j = 0; j < chapters[i].length; j++) {
      if (['panorama', 'image'].indexOf(chapters[i][j].type) !== -1) {
        return chapters[i][j].src;
      }
    }
  }

  return 'https://s3.amazonaws.com/gurivr/logo.png';
};
