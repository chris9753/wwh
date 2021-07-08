import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';

const dynamicStyles = (colorScheme) => {
  return StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      paddingLeft: 10,
      paddingRight: 10,
    },
    container: {
      justifyContent: 'center',
      height: 65,
      alignItems: 'center',
      flexDirection: 'row',
      borderBottomWidth: 0.5,
      borderBottomColor: '#e6e6e6',
    },
    title: {
      flex: 2,
      textAlign: 'left',
      alignItems: 'center',
      color: DynamicAppStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 17,
      fontFamily: DynamicAppStyles.fontFamily.regularFont,
    },
    value: {
      textAlign: 'right',
      color: DynamicAppStyles.colorSet[colorScheme].description,
      fontFamily: DynamicAppStyles.fontFamily.regularFont,
    },
  });
};
export default dynamicStyles;
