import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';

const dynamicStyles = (colorScheme) => {
  return StyleSheet.create({
    container: {
      backgroundColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      flex: 1,
    },
    searchInput: {
      fontSize: 16,
      color: DynamicAppStyles.colorSet[colorScheme].mainTextColor,
      marginLeft: 10,
    },
  });
};
export default dynamicStyles;
