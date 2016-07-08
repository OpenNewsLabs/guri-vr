
import { h } from 'preact';
import { Button, Icon } from 'preact-mdl';

export default ({ icon, onClick }) => (
  <Button style={styles.container} onClick={onClick} fab colored>
    <Icon icon={icon}/>
  </Button>
);

const styles = {
  container: {
    position: 'fixed',
    right: 30,
    bottom: 30
  }
};
