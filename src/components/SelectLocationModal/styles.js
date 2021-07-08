import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';
import { Appearance } from 'react-native-appearance';

const colorScheme = Appearance.getColorScheme();

const styles = StyleSheet.create({
  body: {
    width: '100%',
    height: '100%',
  },
  rightButton: {
    paddingRight: 10,
  },
  topbar: {
    position: 'absolute',
    backgroundColor: 'transparent',
    width: '100%',
  },
  mapView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: DynamicAppStyles.colorSet[colorScheme].grey,
  },
});

export default styles;
