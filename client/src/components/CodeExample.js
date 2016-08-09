
import { h } from 'preact';
import nlp from 'services/nlp';
import t from 'services/i18n';

export default ({ text, title='GuriVR' }) => (
  <div style={styles.container}>
    <pre style={styles.text}>{text}</pre>
    <a href={`/api/preview?title=${title}&body=${encodeURIComponent(JSON.stringify(nlp(text)))}`} target='_blank' style={styles.run}>{t('code_example.run')}</a>
  </div>
);

const styles = {
  container: {
    padding: 20,
    margin: 20,
    backgroundColor: '#eee'
  },
  text: {
    whiteSpace: 'pre-wrap',
    margin: 0
  },
  run: {
    display: 'block',
    textAlign: 'right'
  }
};
