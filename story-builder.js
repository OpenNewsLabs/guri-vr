
const config = require('./config.json');

module.exports = story =>
`
<!doctype html>
<html>
  <head>
    <meta name="twitter:card" content="player">
    <meta name="twitter:site" content="@guri_vr">
    <meta name="twitter:title" content="${story.title}">
    <meta name="twitter:description" content="">
    <meta name="twitter:player" content="https://s3.amazonaws.com/gurivr/s/${story._id}.html">
    <meta name="twitter:player:width" content="400">
    <meta name="twitter:player:height" content="370">

    <meta name="apple-mobile-web-app-capable" content="yes">
    <title>${story.title}</title>
    <script src="https://s3.amazonaws.com/gurivr/aframe.min.js"></script>
    ${getChartUrl(story)}
    <style>
      html, body, #root {
        background-color: #000;
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
    </style>
  </head>
  <body>
    <a-scene>
      <a-sky color="#000"></a-sky>
      ${story.chapters.map(renderChapter).join('\n')}
    </a-scene>
    <script>
      ${renderScript(story.chapters)}
    </script>
  </body>
</html>
`;

const renderChapter = (chapter, i) =>`
  <a-entity class="chapter" visible="${ i === 0 ? 'true' : 'false' }">
    ${chapter.map((obj, key) => renderObject(obj, key, i)).join('\n')}
  </a-entity>
`;

const renderObject = (obj, i, chapter) => {
  switch(obj.type) {
  case 'text':
    return `<a-entity scale="${obj.scale.join(' ')}" rotation="${obj.rotation.join(' ')}" position="${obj.position.join(' ')}" bmfont-text="text: ${obj.text}; width: 600; color: white; align: center;"></a-entity>`;
  case 'panorama':
    return `<a-sky rotation="0 180 0" src="${obj.src}"></a-sky>`;
  case 'background':
    return `<a-sky rotation="0 180 0"  color="${obj.color}"></a-sky>`;
  case 'videosphere':
    return `<a-videosphere src="${obj.src}"></a-videosphere>`;
  case 'video':
    return `<a-video scale="${obj.scale.join(' ')}" width="10" height="6" rotation="${obj.rotation.join(' ')}" position="${obj.position.join(' ')}" src="${obj.src};"></a-video>`;
  case 'image':
    return `<a-image scale="${obj.scale.join(' ')}" width="5" height="5" rotation="${obj.rotation.join(' ')}" position="${obj.position.join(' ')}" src="${obj.src}" ></a-image>`;
  case 'audio':
    return `<a-entity position="${obj.position.join(' ')}" sound="src: ${obj.src}"></a-entity>`;
  case 'chart':
    return `<a-entity rotation="${obj.rotation.join(' ')}" position="${obj.position.join(' ')}" chartbuilder="src: ${obj.src}; scale: ${obj.scale.join(' ')};"></a-entity>`;
  case 'model':
  return `<a-collada-model scale="${obj.scale.join(' ')}" rotation="${obj.rotation.join(' ')}" position="${obj.position.join(' ')}" src="${obj.src}"></a-collada-model>`;
  }
}

const renderScript = chapters => {
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
      var curr = chapters[actual];
      playVoiceover();

      prev.setAttribute('visible', false);
      curr.setAttribute('visible', true);

      var audio = prev.querySelector('[sound]');
      if(audio) audio.components.sound.pause();
      var videosphere = prev.querySelector('a-videosphere');
      if(videosphere) videosphere.pause();

      audio = curr.querySelector('[sound]');
      if(audio) audio.components.sound.play();
      videosphere = curr.querySelector('a-videosphere');
      if(videosphere) videosphere.play();

      setTimeout(nextChapter, times[actual] * 1000);
      actual++;
    }

    function end() {
        document.body.innerHTML = '<div id="root" onclick="javascript:window.location = window.location"><p>Click or tap the screen to replay</p></div>';
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

    nextChapter();
  `;
};

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
