import { Platform, Dimensions, I18nManager } from 'react-native';
import TNColor from './Core/truly-native/TNColor';
import { Configuration } from './Configuration';
import { AppleButton } from '@invertase/react-native-apple-authentication';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const SCREEN_WIDTH =
  WINDOW_WIDTH < WINDOW_HEIGHT ? WINDOW_WIDTH : WINDOW_HEIGHT;
const numColumns = 2;

const lightColorSet = {
  mainThemeBackgroundColor: '#ffffff',
  mainThemeForegroundColor: '#ff5a66',
  mainTextColor: '#151723',
  mainSubtextColor: '#7e7e7e',
  subtitle: '#545454',
  hairlineColor: '#e0e0e0',
  grey0: '#eaeaea',
  grey3: '#e6e6f2',
  grey6: '#d6d6d6',
  grey9: '#939393',
  subHairlineColor: '#f2f2f3',
  facebook: '#4267b2',
  grey: 'grey',
  gey1: '#efeff4',
  whiteSmoke: '#f5f5f5',
  headerStyleColor: '#ffffff',
  headerTintColor: '#000000',
  bottomStyleColor: '#ffffff',
  bottomTintColor: 'grey',
  mainButtonColor: '#e8f1fd',
  subButtonColor: '#eaecf0',
  blue: '#3293fe',
  title: '#464646',
  description: '#bbbbbb',
  categoryTitle: '#161616',
  text: '#4b4f52',
  location: '#a9a9a9',
};

const darkColorSet = {
  mainThemeBackgroundColor: 'black',
  mainThemeForegroundColor: '#d4a313',
  mainTextColor: '#ffffff',
  mainSubtextColor: '#f5f5f5',
  subtitle: TNColor('#545454'),
  hairlineColor: '#222222',
  grey0: TNColor('#eaeaea'),
  gey1: TNColor('#efeff4'),
  grey3: TNColor('#e6e6f2'),
  grey6: TNColor('#d6d6d6'),
  grey9: TNColor('#939393'),
  subHairlineColor: '#f2f2f3',
  facebook: '#4267b2',
  grey: 'grey',
  whiteSmoke: '#222222',
  headerStyleColor: '#222222',
  headerTintColor: '#ffffff',
  bottomStyleColor: '#222222',
  bottomTintColor: 'lightgrey',
  mainButtonColor: '#062246',
  subButtonColor: '#20242d',
  blue: TNColor('#3293fe'),
  title: TNColor('#464646'),
  description: TNColor('#bbbbbb'),
  categoryTitle: TNColor('#161616'),
  text: TNColor('#4b4f52'),
  location: TNColor('#a9a9a9'),
};

const colorSet = {
  ...lightColorSet,
  light: lightColorSet,
  dark: darkColorSet,
  'no-preference': lightColorSet,
};

const navLight = {
  backgroundColor: '#fff',
  fontColor: '#000',
  activeTintColor: '#ff5a66',
  inactiveTintColor: '#ccc',
  hairlineColor: '#e0e0e0',
};

const navDark = {
  backgroundColor: '#000',
  fontColor: '#fff',
  activeTintColor: '#ff5a66',
  inactiveTintColor: '#888',
  hairlineColor: '#222222',
};

const navThemeConstants = {
  light: navLight,
  dark: navDark,
  'no-preference': navLight,
  main: '#ff5a66',
};

const iconStyle = {
  tintColor: darkColorSet.mainThemeForegroundColor,
  width: 25,
  height: 25,
};

const iconSet = {
  logo: require('../assets/icons/logo.png'),
  background: require('../assets/bg/tigerking.png'),
  userAvatar: require('./CoreAssets/default-avatar.jpg'),
  menuHamburger: require('./CoreAssets/hamburger-menu-icon.png'),
  backArrow: require('./CoreAssets/arrow-back-icon.png'),
  close: require('./CoreAssets/close-x-icon.png'),
  home: require('../assets/icons/home.png'),
  categories: require('../assets/icons/categories.png'),
  collections: require('../assets/icons/collections.png'),
  commentUnfilled: require('../assets/icons/comment-unfilled.png'),
  commentFilled: require('../assets/icons/comment-filled.png'),
  compose: require('../assets/icons/compose.png'),
  filter: require('../assets/icons/filter.png'),
  filters: require('../assets/icons/filters.png'),
  heart: require('../assets/icons/heart.png'),
  heartFilled: require('../assets/icons/heart-filled.png'),
  map: require('../assets/icons/map.png'),
  search: require('../assets/icons/search.png'),
  review: require('../assets/icons/review.png'),
  list: require('../assets/icons/list.png'),
  starFilled: require('../assets/icons/star_filled.png'),
  starNoFilled: require('../assets/icons/star_nofilled.png'),
  logout: require('../assets/icons/shutdown.png'),
  rightArrow: require('../assets/icons/right-arrow.png'),
  accountDetail: require('../assets/icons/account-detail.png'),
  wishlistFilled: require('../assets/icons/wishlist-filled.png'),
  orderDrawer: require('../assets/icons/order-drawer.png'),
  settings: require('../assets/icons/settings.png'),
  contactUs: require('../assets/icons/contact-us.png'),
  delete: require('../assets/icons/delete.png'),
  communication: require('../assets/icons/communication.png'),
  cameraFilled: require('../assets/icons/camera-filled.png'),
  send: require('../assets/icons/send.png'),
  emptyAvatar: require('../assets/icons/empty-avatar.jpg'),
  checklist: require('../assets/icons/checklist.png'),
  homeUnfilled: require('../assets/icons/home-unfilled.png'),
  homefilled: require('../assets/icons/home-filled.png'),
  search: require('../assets/icons/search.png'),
  magnifier: require('../assets/icons/magnifier.png'),
  profileUnfilled: require('../assets/icons/profile-unfilled.png'),
  profileFilled: require('../assets/icons/profile-filled.png'),
  camera: require('../assets/icons/camera.png'),
  cameraFilled: require('../assets/icons/camera-filled.png'),
  inscription: require('../assets/icons/inscription.png'),
  more: require('../assets/icons/more.png'),
  send: require('../assets/icons/send.png'),
  pinpoint: require('../assets/icons/pinpoint.png'),
  checked: require('../assets/icons/checked.png'),
  bell: require('../assets/icons/bell.png'),
  heartUnfilled: require('../assets/icons/heart-unfilled.png'),
  cameraRotate: require('../assets/icons/camera-rotate.png'),
  libraryLandscape: require('../assets/icons/library-landscape.png'),
  playButton: require('../assets/icons/play-button.png'),
  logout: require('../assets/icons/logout-drawer.png'),
  delayedLogo: require('../assets/icons/delaylogo.png'),
};

const fontFamily = {
  boldFont: '',
  semiBoldFont: '',
  regularFont: 'FontAwesome',
  mediumFont: '',
  lightFont: '',
  extraLightFont: '',
};

const fontSet = {
  xxlarge: 40,
  xlarge: 30,
  large: 25,
  middle: 20,
  normal: 16,
  small: 13,
  xsmall: 11,
  title: 30,
  content: 20,
};

const loadingModal = {
  color: '#FFFFFF',
  size: 20,
  overlayColor: 'rgba(0,0,0,0.5)',
  closeOnTouch: false,
  loadingType: 'Spinner', // 'Bubbles', 'DoubleBounce', 'Bars', 'Pulse', 'Spinner'
};

const sizeSet = {
  buttonWidth: '70%',
  inputWidth: '80%',
  radius: 25,
};

const styleSet = {
  menuBtn: {
    container: {
      backgroundColor: colorSet.grayBgColor,
      borderRadius: 22.5,
      padding: 10,
      marginLeft: 10,
      marginRight: 10,
    },
    icon: {
      tintColor: 'black',
      width: 15,
      height: 15,
    },
  },
  searchBar: {
    container: {
      marginLeft: Platform.OS === 'ios' ? 30 : 0,
      backgroundColor: 'transparent',
      borderBottomColor: 'transparent',
      borderTopColor: 'transparent',
      flex: 1,
    },
    input: {
      backgroundColor: colorSet.inputBgColor,
      borderRadius: 10,
      color: 'black',
    },
  },
  rightNavButton: {
    marginRight: 10,
  },
  borderRadius: {
    main: 25,
    small: 5,
  },
  textInputWidth: {
    main: '80%',
  },
  backArrowStyle: {
    resizeMode: 'contain',
    tintColor: '#ff5a66',
    width: 25,
    height: 25,
    marginTop: Platform.OS === 'ios' ? 50 : 20,
    marginLeft: 10,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
};

const appIcon = {
  style: {
    tintColor: colorSet.mainThemeForegroundColor,
    width: 25,
    height: 25,
  },
  images: {
    home: require('../assets/icons/home.png'),
    categories: require('../assets/icons/categories.png'),
    collections: require('../assets/icons/collections.png'),
    compose: require('../assets/icons/compose.png'),
    filter: require('../assets/icons/filter.png'),
    filters: require('../assets/icons/filters.png'),
    heart: require('../assets/icons/heart.png'),
    heartFilled: require('../assets/icons/heart-filled.png'),
    map: require('../assets/icons/map.png'),
    search: require('../assets/icons/search.png'),
    review: require('../assets/icons/review.png'),
    list: require('../assets/icons/list.png'),
    starFilled: require('../assets/icons/star_filled.png'),
    inscription: require('../assets/icons/inscription.png'),
    starNoFilled: require('../assets/icons/star_nofilled.png'),
    defaultUser: require('../assets/icons/default_user.jpg'),
    logout: require('../assets/icons/shutdown.png'),
    rightArrow: require('../assets/icons/right-arrow.png'),
    accountDetail: require('../assets/icons/account-detail.png'),
    wishlistFilled: require('../assets/icons/wishlist-filled.png'),
    orderDrawer: require('../assets/icons/order-drawer.png'),
    settings: require('../assets/icons/settings.png'),
    contactUs: require('../assets/icons/contact-us.png'),
    delete: require('../assets/icons/delete.png'),
    communication: require('../assets/icons/communication.png'),
    comment: require('../assets/icons/comment.png'),
    cameraFilled: require('../assets/icons/camera-filled.png'),
    send: require('../assets/icons/send.png'),
    boederImgSend: require('../assets/icons/borderImg1.png'),
    boederImgReceive: require('../assets/icons/borderImg2.png'),
    textBoederImgSend: require('../assets/icons/textBorderImg1.png'),
    textBoederImgReceive: require('../assets/icons/textBorderImg2.png'),
    emptyAvatar: require('../assets/icons/empty-avatar.jpg'),
    checklist: require('../assets/icons/checklist.png'),
    blockedUser: require('../assets/icons/blocked-user-64.png'),
  },
};

const modalSelectorStyle = (theme = 'light') => ({
  optionTextStyle: {
    color: colorSet[theme].subtitle,
    fontSize: 16,
    fontFamily: 'FontAwesome',
  },
  selectedItemTextStyle: {
    fontSize: 18,
    color: colorSet[theme].blue,
    fontFamily: 'FontAwesome',
    fontWeight: 'bold',
  },
  optionContainerStyle: {
    backgroundColor: colorSet[theme].mainThemeBackgroundColor,
  },
  cancelContainerStyle: {
    backgroundColor: colorSet[theme].mainThemeBackgroundColor,
    borderRadius: 10,
  },
  sectionTextStyle: {
    fontSize: 21,
    color: colorSet[theme].title,
    fontFamily: 'FontAwesome',
    fontWeight: 'bold',
  },

  cancelTextStyle: {
    fontSize: 21,
    color: colorSet[theme].blue,
    fontFamily: 'FontAwesome',
  },
});

const modalHeaderStyle = (theme = 'light') => ({
  bar: {
    height: 50,
    marginTop: Platform.OS === 'ios' ? 30 : 0,
    justifyContent: 'center',
  },
  title: {
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    fontWeight: 'bold',
    fontSize: 20,
    color: colorSet[theme].title,
    fontFamily: 'FontAwesome',
  },
  rightButton: {
    top: 0,
    right: 0,
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    color: colorSet[theme].mainThemeForegroundColor,
    fontWeight: 'normal',
    fontFamily: 'FontAwesome',
  },
});

const twoColumnListStyle = (theme = 'light') => ({
  listings: {
    marginTop: 15,
    width: '100%',
    flex: 1,
  },
  showAllButtonContainer: {
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    width: '100%',
    marginBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colorSet[theme].mainThemeForegroundColor,
  },
  showAllButtonText: {
    textAlign: 'center',
    color: colorSet[theme].mainThemeForegroundColor,
    fontFamily: fontFamily.regularFont,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listingItemContainer: {
    justifyContent: 'center',
    marginBottom: 30,
    marginRight: Configuration.home.listing_item.offset,
    width:
      (SCREEN_WIDTH - Configuration.home.listing_item.offset * 3) / numColumns,
  },
  photo: {
    // position: "absolute",
  },
  listingPhoto: {
    width:
      (SCREEN_WIDTH - Configuration.home.listing_item.offset * 3) / numColumns,
    height: Configuration.home.listing_item.height,
  },
  savedIcon: {
    position: 'absolute',
    top: Configuration.home.listing_item.saved.position_top,
    left:
      (SCREEN_WIDTH - Configuration.home.listing_item.offset * 3) / numColumns -
      Configuration.home.listing_item.offset -
      Configuration.home.listing_item.saved.size,
    width: Configuration.home.listing_item.saved.size,
    height: Configuration.home.listing_item.saved.size,
  },
  listingName: {
    fontSize: 15,
    fontFamily: fontFamily.regularFont,
    fontWeight: 'bold',
    color: colorSet[theme].categoryTitle,
    marginTop: 5,
  },
  listingPlace: {
    fontFamily: fontFamily.regularFont,
    color: colorSet[theme].mainSubtextColor,
    marginTop: 5,
  },
});

const listStyle = (theme = 'light') => (
  {
    title: {
      fontSize: 16,
      width: 300,
      color: colorSet[theme].subtitle,
      fontFamily: fontFamily.regularFont,
      fontWeight: 'bold',
    },
    subtitleView: {
      minHeight: 55,
      flexDirection: 'row',
      paddingTop: 5,
    },
    leftSubtitle: {
      flex: 2,
    },
    time: {
      color: colorSet[theme].description,
      fontFamily: fontFamily.regularFont,
      flex: 1,
      textAlignVertical: 'bottom',
    },
    place: {
      fontWeight: 'bold',
      color: colorSet[theme].location,
    },
    price: {
      flex: 1,
      fontSize: 14,
      color: colorSet[theme].subtitle,
      fontFamily: fontFamily.regularFont,
      textAlignVertical: 'bottom',
      alignSelf: 'flex-end',
      textAlign: 'right',
    },
    avatarStyle: {
      height: 80,
      width: 80,
    },
    container: {
      backgroundColor: colorSet[theme].mainThemeBackgroundColor,
      flex: 1,
    },
  })

const headerButtonStyle = (theme = 'light') => ({
  multi: {
    flexDirection: 'row',
  },
  container: {
    padding: 10,
  },
  image: {
    justifyContent: 'center',
    width: 35,
    height: 35,
    margin: 6,
  },
  rightButton: {
    color: colorSet[theme].mainThemeForegroundColor,
    marginRight: 10,
    fontWeight: 'normal',
    fontFamily: fontFamily.regularFont,
  },
});

const appleButtonStyle = {
  dark: AppleButton?.Style?.WHITE,
  light: AppleButton?.Style?.BLACK,
  'no-preference': AppleButton?.Style?.WHITE,
};

const StyleDict = {
  iconSet,
  fontFamily,
  colorSet,
  navThemeConstants,
  fontSet,
  sizeSet,
  styleSet,
  loadingModal,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  iconStyle,
  appIcon,
  modalHeaderStyle,
  modalSelectorStyle,
  twoColumnListStyle,
  listStyle,
  headerButtonStyle,
  appleButtonStyle,
};

export default StyleDict;
