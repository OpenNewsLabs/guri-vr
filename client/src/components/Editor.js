
import { h, Component } from 'preact'
import Radium from 'radium'
import codemirror from 'codemirror'
import 'codemirror/addon/mode/simple'
import { IconToggle, Icon } from 'preact-mdl'
import { debounce, dataURItoBlob } from 'services/utils'
import { searchResources, uploadAsset } from 'services/datalayer'
import nlp from 'services/nlp'
import { getLocale } from 'services/i18n'
import streetview from 'services/streetview'

@Radium
export default class Editor extends Component {

  constructor (props) {
    super(props)

    this.state = {
      speech: false
    }

    this.searchReplaceResources = this.searchReplaceResources.bind(this)
    this.onMicChange = this.onMicChange.bind(this)
    this._speechAPI = window.SpeechRecognition || window.webkitSpeechRecognition ||
      window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextState.mic !== this.state.mic
  }

  componentDidMount () {
    if (this.editor) return this.editor.refresh()
    const { value, onInput } = this.props

    this.editor = codemirror(this._editorDiv, {
      value: String(value),
      theme: 'one-dark',
      lineNumbers: true,
      indentWithTabs: false,
      tabSize: 2,
      indentUnit: 2,
      autofocus: true,
      showCursorWhenSelecting: true,
      lineWrapping: true,
      allowDropFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'audio/mpeg3', 'video/mpeg'],
      mode: 'guri'
    })
    this.editor.setCursor(this.editor.lineCount(), 0)

    onInput(this.editor.getValue())
    setTimeout(() => this.editor.refresh(), 1)

    this.editor.on('change', () => {
      this.value = this.editor.getValue()
      onInput(this.value)
    })

    this.editor.on('change', debounce(this.searchReplaceResources, 1000))

    this.editor.on('drop', (editor, evt) => {
      evt.stopPropagation()
      evt.preventDefault()
      const { files } = evt.dataTransfer
      if (files && files.length) {
        uploadAsset(files[0])
          .then(({ url }) => {
            this.editor.replaceSelection(url)
            onInput(this.editor.getValue())
          })
      }
    })
  }

  onMicChange (e) {
    const enabled = e.target.checked
    let lastResult = -1

    this.setState({
      speech: enabled
    })

    if (!this.recognition) {
      this.recognition = new this._speechAPI()

      this.recognition.continuous = true
      this.recognition.interimResults = true
      this.recognition.maxAlternatives = 5
      this.recognition.lang = `${getLocale()}-${getLocale().toUpperCase()}`

      this.recognition.onresult = e => {
        let transcription = ''

        for (let i = lastResult + 1; i < e.results.length; i++) {
          if (e.results[i].isFinal) {
            this.editor.replaceSelection(this.replaceQuotes(e.results[i][0].transcript))
            lastResult = i
          }
        }
      }
    }

    if (enabled) {
      this.recognition.start()
    } else {
      this.recognition.stop()
    }
  }

  replaceQuotes (str = '') {
    return str
      .replace(/open quotes?|close quotes?|abrir comillas?|cerrar comillas?/gi, '"')
      .replace(/nueva escena|new scene/gi, '\n\n')
  }

  render (props, { speech }) {
    return (
      <div style={styles.container}>
        {this._speechAPI ? (
          <IconToggle onChange={this.onMicChange} style={styles.mic} checked={speech}>
            <Icon icon={'mic'} />
          </IconToggle>
        ) : null}
        <div ref={div => { this._editorDiv = div }}></div>
      </div>
    )
  }

  searchReplaceResources () {
    try {
      const txt = this.editor.getValue()
      const body = nlp(txt)
      body.forEach(chapter => chapter.forEach(obj => {
        switch (obj.type) {
          case 'image':
          case 'panorama':
          case 'audio':
            if (obj.text) {
              this.searchRemoteResource(obj)
            } else if (obj.latlon) {
              this.searchLatLonResource(obj)
            }
        }
      }))

      if (/go to ".+"/i.test(txt)) {
        const input = txt.match(/go to ".+"/i).input
        const query = input.replace(/go to /i, '').replace(/"/g, '')
        Promise.all([searchResources('panorama', query), searchResources('audio', query)])
        .then(([pano, audio]) => {
          let out = ''
          if (pano && pano.length && (pano[0].url_k || pano[0].url_o)) {
            out += ` panorama ${pano[0].url_k || pano[0].url_o}`
          }

          if (audio) {
            out += ` audio ${audio}`
          }

          this.editor.setValue(this.editor.getValue()
          .replace(input, `go to ${query}: ${out.trim()}`))
        })
      }
    } catch (err) {
      console.error(err)
    }
  }

  searchLatLonResource (obj) {
    const loader = streetview()
    const self = this
    loader.addEventListener('load', function() {
      const dataURL = this.canvas.toDataURL('image/jpeg', 0.5)
      const blob = dataURItoBlob(dataURL)
      uploadAsset(blob)
        .then(({ url }) => {
          self.editor.replaceSelection(` ${url} `)
        })
    })

    const latLng = new google.maps.LatLng(obj.latlon[0], obj.latlon[1])
    loader.loadFromLocation(latLng, 3)
  }

  searchRemoteResource (obj) {
    searchResources(obj.type, obj.text)
    .then(resources => {
      if (obj.type === 'audio') {
        this.editor.setValue(this.editor.getValue()
        .replace(`"${obj.text}"`, `${obj.text} ${resources}`))
      } else {
        if (!(resources && resources.length && (resources[0].url_k || resources[0].url_o))) return
        this.editor.setValue(this.editor.getValue()
        .replace(`"${obj.text}"`, `${obj.text} ${resources[0].url_k || resources[0].url_o}`))
      }
    })
  }
}

codemirror.defineSimpleMode('guri', {
  start: [
    {
      regex: /audio|sound|🔊|panorama|🌅|image|foto|picture|text|texto|📝|videosphere|video esfera|🎥|video|seconds|second|segundos|⏲|voiceover|voz en off|📢|chart|gráfico|📊|background|fondo|model|modelo|sky|cielo/gi,
      token: 'atom'
    },
    {
      regex: /[0-9]+ seconds|[0-9]+ second|[0-9]+ segundos/gi,
      token: ['number', 'atom']
    },
    {
      regex: /(#[a-fA-F0-9]{3,6}|\w) (background)/gi,
      token: ['string', 'atom']
    },
    {
      regex: /(fondo) (#[a-fA-F0-9]{3,6})/gi,
      token: ['string', 'atom']
    },
    {
      regex: /https?:\/\/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi,
      token: 'string'
    },
    {
      regex: /(right|left|behind|front|below|above|tiny|small|large|huge|derecha|izquierda|atrás|arriba|abajo|frente|diminuto|pequeño|grande|enorme)/gi,
      token: 'string'
    },
    {
      regex: /sunrise|sunset|morning|noon|afternoon|evening|night|amanecer|atardecer|mañana|mediodía|tarde|noche/gi,
      token: 'string'
    },
    {
      regex: /".+"/,
      token: 'string'
    },
    {
      regex: /\-?\d+\.\d+,\s*\-?\d+\.\d+/,
      token: 'string'
    }
  ]
})

const styles = {
  container: {
    flex: 0,
    height: 300,
    textAlign: 'left',
    position: 'relative'
  },
  mic: {
    position: 'absolute',
    right: 10,
    top: 5,
    zIndex: 10
  }
}
