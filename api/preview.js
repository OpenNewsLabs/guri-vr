const buildStory = require('../client/shared/story-builder')

module.exports = (req, res) => {
    try {
        const story = {
            title: req.query.title,
            chapters: JSON.parse(req.query.body),
            mode: req.query.mode || 'vr'
        }
        const html = buildStory(story)
        res.send(html)
    } catch (error) {
        console.log(error)
        res.send(buildStory({ title: '', chapters: [] }))
    }
}