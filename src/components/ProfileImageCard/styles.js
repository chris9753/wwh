import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';

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
    cardNameContainer: {
      flex: 1,
      alignItems: 'center',
      marginTop: 15,
    },
    cardName: {
      color: DynamicAppStyles.colorSet[colorScheme].mainTextColor,
      fontSize: 16,
      fontWeight: '500',
    },
    container: {
      flex: 1,
    },
    profileCardContainer: {
      flex: 3,
    },
  });
};
export default dynamicStyles;
