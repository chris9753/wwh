import { StyleSheet } from 'react-native';
import { Configuration } from '../../Configuration';
import DynamicAppStyles from '../../DynamicAppStyles';

const PRODUCT_ITEM_HEIGHT = 100;
const PRODUCT_ITEM_OFFSET = 5;

const dynamicStyles = (colorScheme) => {
  return StyleSheet.create({
    container: {
      backgroundColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      flex: 1,
      padding: Configuration.home.listing_item.offset,
    },
    title: {
      fontWeight: 'bold',
      color: DynamicAppStyles.colorSet[colorScheme].title,
      fontSize: 20,
      marginBottom: 15,
    },
    listingTitle: {
      marginTop: 10,
      marginBottom: 10,
    },
    categories: {
      marginBottom: 7,
    },
    categoryItemContainer: {
      borderRadius: 5,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      paddingBottom: 10,
    },
    categoryItemPhoto: {
      height: 60,
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      width: 110,
    },
    categoryItemTitle: {
      fontFamily: DynamicAppStyles.fontFamily.regularFont,
      fontWeight: 'bold',
      color: DynamicAppStyles.colorSet[colorScheme].categoryTitle,
      margin: 10,
    },
    userPhoto: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginLeft: 10,
    },
    mapButton: {
      marginRight: 13,
      marginLeft: 7,
    },
    composeButton: {},
    starStyle: {
      tintColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    starRatingContainer: {
      width: 90,
      marginTop: 10,
    },
  });
};
export default dynamicStyles;
