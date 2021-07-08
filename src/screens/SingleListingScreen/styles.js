import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';

const PRODUCT_ITEM_HEIGHT = 100;
const PRODUCT_ITEM_OFFSET = 5;

const dynamicStyles = (colorScheme) => {
  return StyleSheet.create({
    headerIconContainer: {
      marginRight: 10,
      height: '100%',
      width: 30,
    },
    headerIcon: {
      tintColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor,
      height: 24,
      width: 24,
    },
    container: {
      backgroundColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      flex: 1,
    },
    title: {
      fontFamily: DynamicAppStyles.fontFamily.regularFont,
      fontWeight: 'bold',
      color: DynamicAppStyles.colorSet[colorScheme].title,
      fontSize: 25,
      padding: 10,
    },
    reviewTitle: {
      paddingTop: 0,
    },
    description: {
      fontFamily: DynamicAppStyles.fontFamily.regularFont,
      padding: 10,
      color: DynamicAppStyles.colorSet[colorScheme].description,
    },
    photoItem: {
      backgroundColor: DynamicAppStyles.colorSet[colorScheme].grey,
      height: 250,
      width: '100%',
    },
    paginationContainer: {
      flex: 1,
      position: 'absolute',
      alignSelf: 'center',
      paddingVertical: 8,
      marginTop: 220,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 0,
    },
    mapView: {
      width: '100%',
      height: 200,
    },
    loadingMap: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    extra: {
      padding: 30,
      paddingTop: 10,
      paddingBottom: 0,
      marginBottom: 30,
    },
    extraRow: {
      flexDirection: 'row',
      paddingBottom: 10,
    },
    extraKey: {
      flex: 2,
      color: DynamicAppStyles.colorSet[colorScheme].title,
      fontWeight: 'bold',
    },
    extraValue: {
      flex: 1,
      color: '#bcbfc7',
    },
    reviewItem: {
      padding: 10,
      marginLeft: 10,
    },
    info: {
      flexDirection: 'row',
    },
    userPhoto: {
      width: 44,
      height: 44,
      borderRadius: 22,
    },
    detail: {
      paddingLeft: 10,
      flex: 1,
    },
    username: {
      color: DynamicAppStyles.colorSet[colorScheme].title,
      fontWeight: 'bold',
    },
    reviewTime: {
      color: '#bcbfc7',
      fontSize: 12,
    },
    starRatingContainer: {
      padding: 10,
    },
    starStyle: {
      tintColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    reviewContent: {
      color: DynamicAppStyles.colorSet[colorScheme].title,
      marginTop: 10,
    },
  });
};
export default dynamicStyles;
