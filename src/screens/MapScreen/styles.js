import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';
import { Appearance } from 'react-native-appearance';

const colorSheme = Appearance.getColorScheme();
const styles = StyleSheet.create({
  mapView: {
    width: '100%',
    height: '100%',
    backgroundColor: DynamicAppStyles.colorSet[colorSheme].grey,
  },
});

export default styles;
