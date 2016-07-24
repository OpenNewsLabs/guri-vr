
import { h, Component } from 'preact';
import Radium from 'radium';
import CodeExample from 'components/CodeExample';

@Radium
export default class Guide extends Component {

  render() {
    return (
      <article style={styles.container}>
        <header style={styles.header}>
          <h2 style={styles.title}>Guide</h2>
        </header>
        <section>
          <h3>Introduction</h3>
          <p>
            GuriVR is a free, open source project created to allow everybody to make <a href="https://en.wikipedia.org/wiki/Virtual_reality">Virtual Reality</a> experiences with the lowest possible learning curve.
            The main tool that follows the goal is the online editor which is described below but Guri attempts to make the job easy in different ways. For example, it is possible to create a basic 360 panorama that
            works in the browser and with headsets like the Google Cardboard just by tweeting the picture with a mention to <a href='https://twitter.com/guri_vr'>@guri_vr</a>.
          </p>
          <p>
            Guri is under <a href='https://github.com/opennewslabs/guri-vr'>active development</a> and <a href='https://github.com/opennewslabs/guri-vr/issues'>feedback</a> is always welcome and under consideration for new features and bug reports.
            If you see something, say something 🚨 👮
          </p>
        </section>
        <section>
          <h3>Getting started</h3>
          <p>
            The easiest way to learn how to use the editor is to play around with the sample scene located at the <a href='/'>Homepage</a> or <a href='/login'>create an account</a> to be able to save your stories.
          </p>
          <p>
            The editor uses natural language processing techniques to interpret your words and convert the description into a VR experience.
            The ultimate goal for Guri is to be so intuitive you can express yourself using your own words without the need to think about it.
            In the next section
          </p>
        </section>
        <section>
          <h3>Scenes</h3>
          <p>Guri organize your stories into sequential scenes. Each scene is directly mapped with a paragraph in your description as soon as you specify the scene length.</p>
          <CodeExample text={`
This is my first scene. It lasts 4 seconds, has a skyblue background and shows a text saying "This is the first scene"

This paragraph is never interpreted because I'm not specifying the duration. This paragraphs can be used for talking about different parts of your story without generating scenes.

The last scene lasts 10 seconds and has just a text saying "The End!".
          `} />

          <p>You can create as many scenes as you want but don{'\''}t forget about to set the duration in seconds.</p>
          <p>Now that you know how to create scenes, let{'\''}s see what kind of element you can add to your scenes:</p>
        </section>
        <section>
          <h3>Entities</h3>
          <p>A Guri scene is composed by a set of entities. A entity can be a 360 panorama, a videosphere, some text floating around, a 3d chart, images and more.</p>
          <p>Each kind of entity has modifiers (or attributes) associated. For example some elements can have a color, an asset or a determined position. For example, if I want a tiny picture of a pokemon at the left of the viewer I can express that to Guri using the following words:</p>
          <CodeExample
            title='Entities'
            text={`
I want my scene to last 30 seconds and to have a green pink background and a picture of a pokemon (why not?) located at https://gurivr.s3.amazonaws.com/c5155f5b-83eb-4729-873b-238abb916362-psyduck.png to my left, and make it tiny please. Also add a text saying "Look to your leeeeeeeft!"
            `} />
            <p>Below you can see the list of available entities and the modifiers that can be applied:</p>
        </section>
        <section>
          <h4>Audio</h4>
          <p>Audio source in the 3d space. It can be positioned in different parts of the scene. It needs a url as the source, the prefered format is mp3.</p>
          <p>Keywords: <span style={styles.attr}>audio | sound</span></p>
          <p>Attributes:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | required</li>
            <li><span style={styles.attr}>position</span> (left, right, front, behind) | optional</li>
          </ul>
          <p>Example</p>
          <CodeExample title='Audio example'
            text={`
I want a  5 seconds scene showing a text saying "Hi!"
Then I want a 40 seconds scene with a white background and an audio located at https://gurivr.s3.amazonaws.com/86474203-6d3d-4d39-9342-5ed63dca56c6-santa.mp3 behind me
`} />
        </section>
        <section>
          <h4>Panorama</h4>
          <p>360 spherical image envolving the user view. It needs a url to display. It works better with equirectangular panoramas but works with any kind of images.</p>
          <p>Keywords: <span style={styles.attr}>panorama</span></p>
          <p>Attributes:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | required</li>
          </ul>
          <p>Example</p>
          <CodeExample title='Panorama example'
            text='My scene is 500 seconds long and shows a panorama located at https://gurivr.s3.amazonaws.com/7ec6043a-3924-4341-96ab-e8df10faaa93-pa.jpg' />
        </section>
        <section>
          <h4>Videosphere</h4>
          <p>360 spherical video envolving the user view. It needs a url to display. It works better with equirectangular videos but works with any kind of video.</p>
          <p>Keywords: <span style={styles.attr}>videosphere</span></p>
          <p>Attributes:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | required</li>
          </ul>
          <p>Example</p>
          <CodeExample title='Videosphere example'
            text='My scene is 30 seconds long and shows a panorama located at https://ucarecdn.com/bcece0a8-86ce-460e-856b-40dac4875f15/ and a voiceover saying "This is the future. I know, is not that good"' />
        </section>
        <section>
          <h4>Image</h4>
          <p>2d images can be located inside the scene and placed in different positions.</p>
          <p>Keywords: <span style={styles.attr}>image | picture</span></p>
          <p>Attributes:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | required</li>
            <li><span style={styles.attr}>position</span> (right, left, behind, front) | optional</li>
            <li><span style={styles.attr}>scale</span> (tiny, small, large, huge) | optional</li>
          </ul>
          <p>Example</p>
          <CodeExample title='Image example'
            text='My scene is 500 seconds long, it has blue background, a voiceover saying "Look to your right" and a random picture of a cat from https://gurivr.s3.amazonaws.com/7ec6043a-3924-4341-96ab-e8df10faaa93-pa.jpg to my right' />
        </section>
        <section>
          <h4>Video</h4>
          <p>2d videos can be located inside the scene and placed in different positions.</p>
          <p>Keywords: <span style={styles.attr}>video</span></p>
          <p>Attributes:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | required</li>
            <li><span style={styles.attr}>position</span> (right, left, behind, front) | optional</li>
            <li><span style={styles.attr}>scale</span> (tiny, small, large, huge) | optional</li>
          </ul>
          <p>Example</p>
          <CodeExample title='Video example'
            text='My scene is 500 seconds long, it has skyblue background and a video from https://s3.amazonaws.com/gurivr/licha.mp4 to my left' />
        </section>
        <section>
          <h4>Text</h4>
          <p>You can write text and it will be displayed into the screen. There is no color or font support (it{'\''}s just blank text for now)</p>
          <p>Keywords: <span style={styles.attr}>text</span></p>
          <p>Attributes:</p>
          <ul>
            <li><span style={styles.attr}>text</span> (string) | required</li>
            <li><span style={styles.attr}>position</span> (right, left, behind, front) | optional</li>
            <li><span style={styles.attr}>scale</span> (tiny, small, large, huge) | optional</li>
          </ul>
          <p>Example</p>
          <CodeExample title='Text example'
            text='My scene is 500 seconds long, it has red background, a text telling me "You can read" and another text that says "Say no more" to my left' />
        </section>
        <section>
          <h4>Duration</h4>
          <p>You need to specify the duration of each scene in seconds. Otherwise it won{'\''}t be displayed.</p>
          <p>Keywords: <span style={styles.attr}>seconds</span></p>
          <p>Attributes:</p>
          <ul>
            <li><span style={styles.attr}>duration</span> (number) | required</li>
          </ul>
          <p>Example</p>
          <CodeExample title='Duration example'
            text='My scene is 8 seconds long, it has blue background and text saying "This will finish soon"' />
        </section>
        <section>
          <h4>Voiceover</h4>
          <p>You can make your computer say phrases out loud. This will only work on browsers supporting speech synthesis.</p>
          <p>Keywords: <span style={styles.attr}>voiceover</span></p>
          <p>Attributes:</p>
          <ul>
            <li><span style={styles.attr}>text</span> (string) | required</li>
          </ul>
          <p>Example</p>
          <CodeExample title='Voiceover example'
            text='My scene is 8 seconds long and have a voiceover saying "If you are listening to me, your computer, then your browser supports speech synthesis."' />
        </section>
        <section>
          <h4>Chart</h4>
          <p>Everything here is experimental but this feature really is. (In theory) you can create a chart on <a href='https://quartz.github.io/Chartbuilder/'>ChartBuilder</a>,
          drag the json into the editor (or host it by yourself), and GuriVR will render it as a 3d chart. Give it a chance and if it don{'\''}t work please raise an <a href='https://github.com/opennewslabs/guri-vr'>issue</a>.</p>
          <p>Keywords: <span style={styles.attr}>chart</span></p>
          <p>Attributes:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | required</li>
          </ul>
          <p>Example</p>
          <CodeExample title='Chart example'
            text='My scene is 500 seconds long and have a #eee background and a chart from https://s3.amazonaws.com/gurivr/my-data.json in front of me' />
        </section>
        <section>
          <h4>Background</h4>
          <p>You can change the boring black background on each scene with a cooler color.</p>
          <p>Keywords: <span style={styles.attr}>background</span></p>
          <p>Attributes:</p>
          <ul>
            <li><span style={styles.attr}>color</span> (string or hex color) | required</li>
          </ul>
          <p>Example</p>
          <CodeExample title='Background example'
            text='My scene is 500 seconds long and have a #ccc background and a text saying "Calaaaar"' />
        </section>
        <section>
          <h4>3D Models</h4>
          <p>Another <del>broken</del> experimental feature. You can insert Collada models into the scene.</p>
          <p>Keywords: <span style={styles.attr}>model</span></p>
          <p>Attributes:</p>
          <ul>
            <li><span style={styles.attr}>src</span> (url) | required</li>
          </ul>
          <p>Example</p>
          <CodeExample title='Model example'
            text="My scene is 500 seconds long, has skyblue background and a model of some trees from https://s3.amazonaws.com/gurivr/23f1972f-99c6-4f68-a0f0-392c16a02333-trees.dae you can move around with wasd 😎" />
        </section>
        <section>
          <h3>Sharing</h3>
          <p>
            While logged in, you can save your stories and a share link is generated every time you save the story. This link can be shared as a standalone website or be embed into an iframe to be a part of a interactive piece.

            <div style={styles.embed}>
              <iframe src="https://s3.amazonaws.com/gurivr/s/87298957f8e8d6a3696098d8.html" width="100%" height="300"></iframe>
            </div>

            The generated link is a HTML file using <a href='https://aframe.io'>A-Frame</a> so it can be easily modified. The link sets also the required information for the Twitter Card player for a better integration. This is an example:

            <div style={styles.embed}>
              <blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/impronunciable">@impronunciable</a> your scene is here <a href="https://t.co/n2O4S2OTh7">https://t.co/n2O4S2OTh7</a></p>&mdash; Guri VR (@guri_vr) <a href="https://twitter.com/guri_vr/status/751870382219599872">July 9, 2016</a></blockquote>
              <script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
            </div>
          </p>
        </section>
      </article>
    );
  }

}

const styles = {
  container: {
    marginLeft: 50,
    marginRight: 50,
    width: '100vw',
    maxWidth: 800,
    padding: 20,
    margin: '0 auto'
  },
  header: {
    borderBottom: '1px solid #ccc'
  },
  title: {
    textAlign: 'center'
  },
  embed: {
    display: 'flex',
    justifyContent: 'center',
    margin: 15
  },
  attr: {
    backgroundColor: '#eee',
    padding: 3
  }
};
