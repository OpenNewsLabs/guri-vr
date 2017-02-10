
import { h, Component } from 'preact'
import codemirror from 'codemirror'
import { style } from 'glamor'
import 'codemirror/addon/mode/simple'
import { debounce, dataURItoBlob } from 'services/utils'
import { searchResources, uploadAsset } from 'services/datalayer'
import nlp from 'services/nlp'
import streetview from 'services/streetview'

export default class Editor extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    if (this.editor && nextProps.template && nextProps.value !== this.props.value) {
      console.log(nextProps.value)
      this.editor.setValue(nextProps.value)
    }
    return false
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

    this.editor.on('change', debounce(this.searchReplaceResources.bind(this), 1000))

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

  render () {
    return (
      <div {...styles.container}>
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
    loader.addEventListener('load', function () {
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
      regex: /audio|sound|🔊|panoramas?|🌅|image(nes|s)?|foto|picture|texto?|📝|videosphere|video esfera|🎥|video|seconds|second|segundos|⏲|voiceover|voz en off|📢|chart|gráfico|📊|background|fondo|modelo?|sky|cielo/gi,
      token: 'atom'
    },
    {
      regex: /[0-9]+ seconds|[0-9]+ second|[0-9]+ segundos/gi,
      token: 'number'
    },
    {
      regex: /(#[a-fA-F0-9]{3,6}|\w+) background/gi,
      token: 'atom'
    },
    {
      regex: /(fondo) (#[a-fA-F0-9]{3,6})/gi,
      token: 'atom'
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
      regex: /\d*(\.\d+)? meters?|metros?/gi,
      token: ['number', 'atom']
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
  container: style({
    flex: 1,
    height: 338,
    textAlign: 'left',
    position: 'relative',
    width: '100%'
  })
}
