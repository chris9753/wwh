import { StyleSheet } from 'react-native';
import { Configuration } from '../../Configuration';
import DynamicAppStyles from '../../DynamicAppStyles';

const dynamicStyles = (colorScheme) => {
  return StyleSheet.create({
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
    starRatingContainer: {
      width: 90,
      marginTop: 10,
    },
    starStyle: {
      tintColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    emptyViewContainer: {
      marginTop: '-35%',
      flex: 1,
    }
  });
};
export default dynamicStyles;
