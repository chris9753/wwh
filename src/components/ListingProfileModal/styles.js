import { StyleSheet } from 'react-native';
import { Configuration } from '../../Configuration';
import DynamicAppStyles from '../../DynamicAppStyles';

const itemIconSize = 26;
const itemNavigationIconSize = 23;

const dynamicStyles = (colorScheme) => {
  return StyleSheet.create({
    cardContainer: {
      flex: 1,
    },
    cardImageContainer: {
      flex: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardImage: {
      height: 130,
      width: 130,
      borderRadius: 65,
    },
    gridContainer: {
      padding: Configuration.home.listing_item.offset,
      marginTop: 10,
    },
    cardNameContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardName: {
      color: DynamicAppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      fontSize: 19,
    },
    container: {
      flex: 1,
      backgroundColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
    },
    profileCardContainer: {
      marginTop: 15,
      justifyContent: 'center',
      alignItems: 'center',
    },
    profileItemContainer: {
      marginTop: 6,
    },
    itemContainer: {
      flexDirection: 'row',
      height: 54,
      width: '85%',
      alignSelf: 'center',
      marginBottom: 10,
    },
    itemIconContainer: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemIcon: {
      height: itemIconSize,
      width: itemIconSize,
    },
    itemTitleContainer: {
      flex: 6,
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    itemTitle: {
      color: DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor,
      fontSize: 17,
      paddingLeft: 20,
    },
    itemNavigationIconContainer: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightButton: {
      marginRight: 10,
      color: DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor,
    },
    itemNavigationIcon: {
      height: itemNavigationIconSize,
      width: itemNavigationIconSize,
      tintColor: DynamicAppStyles.colorSet[colorScheme].grey,
    },
    detailContainer: {
      backgroundColor: DynamicAppStyles.colorSet[colorScheme].grey1,
      padding: 20,
      marginTop: 25,
    },
    profileInfo: {
      padding: 5,
      color: '#333333',
      fontSize: 14,
    },
    myListings: {
      paddingTop: 5,
      paddingBottom: 20,
      fontWeight: '500',
      color: '#333333',
      fontSize: 17,
    },
    profileInfoContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 5,
      width: '100%',
    },
    profileInfoTitleContainer: {
      flex: 1,
      // alignItems: "center",
      // backgroundColor: "green",
      justifyContent: 'center',
    },
    profileInfoTitle: {
      color: '#595959',
      fontSize: 12,
      padding: 5,
    },
    profileInfoValueContainer: {
      flex: 2,
      // alignItems: "center",
      // backgroundColor: "yellow",
      justifyContent: 'center',
    },
    profileInfoValue: {
      color: '#737373',
      fontSize: 12,
      padding: 5,
    },
    footerButtonContainer: {
      flex: 2,
      justifyContent: 'flex-start',
      marginTop: 8,
    },
    footerContainerStyle: {
      // borderColor: AppStyles.color.grey
    },
    blank: {
      flex: 0.5,
    },
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
