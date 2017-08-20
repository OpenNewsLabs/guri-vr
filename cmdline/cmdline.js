var buildStory = require('../client/shared/story-builder')
var nlp = require('../client/shared/nlp')
const commandLineArgs = require('command-line-args')

//////////////////////////////////////////////////////////////////////////////
//                Code Separator
//////////////////////////////////////////////////////////////////////////////

var options = {
        title : 'my super title',
        text : 'A sky at sunset',
        mode : 'vr',
}

const optionDefinitions = [
        { name: 'title', alias: 't', type: Boolean },
        { name: 'mode', alias: 'm', type: String },
        { name: 'text', type: String, defaultOption: true },
]

var options = commandLineArgs(optionDefinitions)

//////////////////////////////////////////////////////////////////////////////
//                generate the html page
//////////////////////////////////////////////////////////////////////////////
var chapters = nlp(options.text)
var story = {
        title: options.title,
        chapters: chapters,
        mode: options.mode
}
var html = buildStory(story)

//////////////////////////////////////////////////////////////////////////////
//                output html page
//////////////////////////////////////////////////////////////////////////////
console.log(html)
