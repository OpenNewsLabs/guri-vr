var buildStory = require('../client/shared/story-builder')
var nlp = require('../client/shared/nlp')
var commandLineArgs = require('command-line-args')

//////////////////////////////////////////////////////////////////////////////
//                Code Separator
//////////////////////////////////////////////////////////////////////////////

// Attempts at cmdline option parsing...
// - needs a -h --help
// - needs error message when error
// - i picked this package at random. aka it is the first i saw
// - may need a more knowledgable choise
var optionDefinitions = [
        { name: 'title', alias: 't', type: String },
        { name: 'mode', alias: 'm', type: String },
        { name: 'output', alias: 'o', type: String },
        { name: 'text', type: String },
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
console.log(JSON.stringify(story, null, '\t'))
var html = buildStory(story)

//////////////////////////////////////////////////////////////////////////////
//                output html page
//////////////////////////////////////////////////////////////////////////////

// dump the html into a file
require('fs').writeFileSync(options.output, html, 'utf8');
