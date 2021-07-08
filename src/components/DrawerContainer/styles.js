import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';

const styles = theme => (StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: DynamicAppStyles.colorSet[theme].mainThemeBackgroundColor
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
}))

export default styles;
