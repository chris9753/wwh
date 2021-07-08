import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';

const dynamicStyles = (colorScheme) => {
  return StyleSheet.create({
    body: {
      flex: 1,
      backgroundColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    bodyContainer: {
      alignSelf: 'center',
      width: '95%',
      height: '86%',
    },
    input: {
      flex: 1,
      width: '100%',
      fontSize: 19,
      textAlignVertical: 'top',
      lineHeight: 26,
      fontFamily: DynamicAppStyles.fontFamily.regularFont,
      color: DynamicAppStyles.colorSet[colorScheme].text,
      paddingBottom: 10,
    },
    starRatingContainer: {
      width: 90,
      marginVertical: 12,
    },
    starStyle: {
      tintColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    btnContainer: {
      width: '100%',
      height: 48,
      justifyContent: 'center',
      backgroundColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    btnText: {
      color: DynamicAppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
  });
};
export default dynamicStyles;
