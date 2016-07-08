
import { h } from 'preact';

export default ({ body, height }) => (
    <iframe height={height} style={styles.container} src={`/api/preview?body=${JSON.stringify(body)}`} />
);

const styles = {
  container: {
    flex: 1
  }
};
