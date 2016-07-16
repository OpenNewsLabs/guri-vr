
import assert from 'assert';
import nlp from '../src/services/nlp';

describe('Natural language interpreter', () => {

  it('Should be a function', () => {
    assert('function' == typeof nlp);
  });

  it('Empty string should return a empty array', () => {
    const empty = nlp('');
    assert(Array.isArray(empty));
    assert(empty.length === 0);
  });

  it('If we don\'t provide duration it should return an empty array', () => {
    const out = nlp(`
    This is my scene...

    I'm not saying anything about the duration. I can say I want a text saying "this won't be parsed"
    `);
    assert(Array.isArray(out));
    assert(out.length === 0);
  });

  it('Renders a basic scene with a text and a spherical video', () => {
    const out = nlp(`
      My first scene lasts for 30 seconds and have a text saying "Hi Guri!" and a videosphere located at http://pepe.com
    `);
    assert(Array.isArray(out));
    assert(out.length === 1);

    assert(Array.isArray(out[0]));
    assert(out[0].length === 3);

    assert(out[0][0].type === 'duration');
    assert(out[0][0].value === 30);

    assert(out[0][1].type === 'text');
    assert(out[0][1].text === 'Hi Guri!');

    assert(out[0][2].type === 'videosphere');
    assert(out[0][2].src === 'http://pepe.com');
  });

  it('Shouldn\'t get an object type if it\'s inside a url or another word', () => {
    const out = nlp(`
      My first scene lasts for 30 seconds and have a chart located at http://my-domain.com/chart-mychart.html
    `);
    assert(Array.isArray(out));
    assert(out.length === 1);

    assert(Array.isArray(out[0]));
    assert(out[0].length === 2);

    assert(out[0][0].type === 'duration');
    assert(out[0][0].value === 30);

    assert(out[0][1].type === 'chart');
    assert(out[0][1].src === 'http://my-domain.com/chart-mychart.html');
  });

  it('Should pass the homepage story', () => {
    const out = nlp(`
      Try adding some scenes. For example my first scene will last 500 seconds and display the following text: "Guri is cooooool!" and a panorama located at https://s3.amazonaws.com/gurivr/pano.jpg
    `);

    assert(Array.isArray(out));
    assert(out.length === 1);

    assert(Array.isArray(out[0]));
    assert(out[0].length === 3);

    assert(out[0][0].type === 'duration');
    assert(out[0][0].value === 500);

    assert(out[0][1].type === 'text');
    assert(out[0][1].text === 'Guri is cooooool!');

    assert(out[0][2].type === 'panorama');
    assert(out[0][2].src === 'https://s3.amazonaws.com/gurivr/pano.jpg');
  });

  it('Should accept multiple scenes', () => {
    const out = nlp(`
      This is my first scene. It lasts 4 seconds, has a skyblue background and shows a text saying "This is the first scene"

      This paragraph is never interpreted because I'm not specifying the duration. This paragraphs can be used for talking about different parts of your story without generating scenes.

      The last scene lasts 10 seconds and has just a text saying "The End!".
    `);

    assert(Array.isArray(out));
    assert(out.length === 2);

    assert(Array.isArray(out[0]));
    assert(out[0].length === 3);

    assert(out[0][0].type === 'duration');
    assert(out[0][0].value === 4);

    assert(out[0][1].type === 'background');
    assert(out[0][1].color === 'skyblue');

    assert(out[0][2].type === 'text');
    assert(out[0][2].text === 'This is the first scene');

    assert(Array.isArray(out[1]));
    assert(out[1].length === 2);

    assert(out[1][0].type === 'duration');
    assert(out[1][0].value === 10);

    assert(out[1][1].type === 'text');
    assert(out[1][1].text === 'The End!');
  });

});
