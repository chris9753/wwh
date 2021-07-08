import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';

const PRODUCT_ITEM_HEIGHT = 100;
const PRODUCT_ITEM_OFFSET = 5;

const dynamicStyles = (colorScheme) => {
  return StyleSheet.create({
    flatContainer: {
      backgroundColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      paddingLeft: 10,
      paddingRight: 10,
    },
    container: {
      flex: 1,
      backgroundColor:
        DynamicAppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
      alignItems: 'stretch',
      justifyContent: 'center',
      margin: PRODUCT_ITEM_OFFSET,
      height: PRODUCT_ITEM_HEIGHT,
    },
    title: {
      color: 'white',
      fontSize: 17,
      fontFamily: DynamicAppStyles.fontFamily.regularFont,
      textAlign: 'center',
    },
    photo: {
      height: PRODUCT_ITEM_HEIGHT,
      ...StyleSheet.absoluteFillObject,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
  });
};
export default dynamicStyles;
