import { Platform, StyleSheet } from 'react-native';
import { Appearance } from 'react-native-appearance';
import {
  heightPercentageToDP as h,
  widthPercentageToDP as w,
} from 'react-native-responsive-screen';

const COLOR_SCHEME = Appearance.getColorScheme();

const dynamicStyles = (appStyles) =>
  StyleSheet.create({
    modal: {
      justifyContent: 'flex-end',
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignSelf: 'center',
      height: h(80),
      padding: 5,
      width: w(100),
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
    },
    starContainer: { flexDirection: 'row', alignSelf: 'flex-start' },
    starStyle: { marginVertical: 5 },
    actionButtonContainer: {
      padding: 16,
      width: '90%',
      alignSelf: 'center',
      borderRadius: 5,
      position: 'absolute',
      bottom: 0,
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
      marginBottom: 30,
    },
    actionButtonText: {
      fontFamily: appStyles.fontFamily.bold,
      color: appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
    },
    reviewText: {
      fontSize: 20,
      margin: 10,
      fontWeight: 'bold',
      alignSelf: 'center',
      color: appStyles.colorSet[COLOR_SCHEME].mainTextColor,
    },
    input: {
      fontSize: 15,
      color: appStyles.colorSet[COLOR_SCHEME].mainSubtextColor,
    },
    headerTitle: {
      position: 'absolute',
      textAlign: 'center',
      width: '100%',
      fontWeight: 'bold',
      fontSize: 20,
      color: appStyles.colorSet[COLOR_SCHEME].mainTextColor,
    },
    rightButton: {
      top: 0,
      right: 0,
      backgroundColor: 'transparent',
      alignSelf: 'flex-end',
      color: appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor,
      fontWeight: 'normal',
    },
    selectorRightButton: {
      marginRight: 10,
    },
    navBarContainer: {
      backgroundColor:
        appStyles.colorSet[COLOR_SCHEME].mainThemeBackgroundColor,
    },
    bar: {
      height: 50,
      marginTop: Platform.OS === 'ios' ? 30 : 0,
      justifyContent: 'center',
    },
  });

export default dynamicStyles;
