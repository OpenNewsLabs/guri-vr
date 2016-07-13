
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

});
