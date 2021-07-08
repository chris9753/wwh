import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';

const dynamicStyles = (colorScheme) => {
  return StyleSheet.create({
    container: {
      backgroundColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      flex: 1,
    },
    mapView: {
      width: '100%',
      height: '100%',
      backgroundColor: DynamicAppStyles.colorSet[colorScheme].grey,
    },
    filtersButton: {
      marginRight: 10,
    },
    toggleButton: {
      marginRight: 7,
    },
  });
};
export default dynamicStyles;
