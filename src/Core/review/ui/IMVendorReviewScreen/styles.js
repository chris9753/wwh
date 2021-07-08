import { StyleSheet } from 'react-native';
import { Appearance } from 'react-native-appearance';

const COLOR_SCHEME = Appearance.getColorScheme();

const dynamicStyles = (appStyles) =>
  StyleSheet.create({
    container: {
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
      flex: 1
    },
    starContainer: { flexDirection: 'row', alignSelf: 'center' },
    date: {
      color: appStyles.colorSet[COLOR_SCHEME].grey,
      fontSize: 12,
    },
    starStyle: { marginHorizontal: 0.5 },
    reviewContainer: { marginVertical: 8 },
    profilePic: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    horizontalPane: {
      flexDirection: 'row',
    },
    pad: {
      padding: 10,
      justifyContent: 'space-between',
    },
    reviewText: {
      fontSize: 15,
      paddingHorizontal: 10,
      color: appStyles.colorSet[COLOR_SCHEME].mainTextColor,
    },
    authorName: {
      color: appStyles.colorSet[COLOR_SCHEME].mainTextColor,
      fontSize: 15,
      fontWeight: 'bold',
    },
    date: {
      color: appStyles.colorSet[COLOR_SCHEME].mainSubtextColor,
      fontSize: 13,
    },
    headerRightContainer: {
      width: 25,
      height: 25,
      marginHorizontal: 10,
    },
    starBox: {
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
    },
    actionButtonContainer: {
      padding: 16,
      width: '90%',
      alignSelf: 'center',
      borderRadius: 5,
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
      marginBottom: 30,
    },
    actionButtonText: {
      fontFamily: appStyles.fontFamily.bold,
      color: appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
    },
    emptystateConfig: {
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
      margin: 30,
      marginTop: 90
    }
  });

export default dynamicStyles;
