import { StyleSheet } from 'react-native';
import { Configuration } from '../../Configuration';
import DynamicAppStyles from '../../DynamicAppStyles';

const dynamicStyles = (colorScheme) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    container: {
      backgroundColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      flex: 1,
      padding: Configuration.home.listing_item.offset,
    },
    rightButton: {
      marginRight: 10,
      color: DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    title: {
      fontFamily: DynamicAppStyles.fontFamily.regularFont,
      fontWeight: 'bold',
      color: DynamicAppStyles.colorSet[colorScheme].title,
      fontSize: 22,
    },
    listingTitle: {
      marginTop: 10,
      marginBottom: 15,
    },
    noMessage: {
      textAlign: 'center',
      color: DynamicAppStyles.colorSet[colorScheme].subtitle,
      fontSize: 18,
      padding: 15,
    },
  });
};
export default dynamicStyles;
