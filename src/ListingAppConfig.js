import { IMLocalized } from './Core/localization/IMLocalization';
import AppStyles from './DynamicAppStyles';
import { setI18nConfig } from './Core/localization/IMLocalization';
import { BannerAdSize } from '@react-native-firebase/admob';

setI18nConfig();

const regexForNames = /^[a-zA-Z]{2,25}$/;
const regexForPhoneNumber = /\d{9}$/;

const ListingAppConfig = {
  isSMSAuthEnabled: false,
  isDelayedLoginEnabled: false,
  appIdentifier: 'rn-ulistings-android',
  adMobConfig: {
    adBannerSize: BannerAdSize.BANNER,
    adUnitID: 'ca-app-pub-5357234145673650/6960322184',
  },
  onboardingConfig: {
    delayedLoginTitle: IMLocalized('Sign In To Your Account'),
    delayedLoginCaption: IMLocalized(
      'Sign in or sign up to access this feature.',
    ),
    welcomeTitle: IMLocalized('Welcome to WWH'),
    welcomeCaption: IMLocalized(
      'Globalizing your local shipping experience.',
    ),
    walkthroughScreens: [
      {
        icon: require('../assets/icons/logo.png'),
        title: IMLocalized('Build your perfect app'),
        description: IMLocalized(
          'Use this starter kit to make your own classifieds app in minutes.',
        ),
      },
      {
        icon: require('../assets/icons/map.png'),
        title: IMLocalized('Map View'),
        description: IMLocalized(
          'Visualize listings on the map to make your search easier.',
        ),
      },
      {
        icon: require('../assets/icons/heart.png'),
        title: IMLocalized('Saved Listings'),
        description: IMLocalized(
          'Save your favorite listings to come back to them later.',
        ),
      },
      {
        icon: require('../assets/icons/filters.png'),
        title: IMLocalized('Advanced Custom Filters'),
        description: IMLocalized(
          'Custom dynamic filters to accommodate all markets and all customer needs.',
        ),
      },
      {
        icon: require('../assets/icons/instagram.png'),
        title: IMLocalized('Add New Listings'),
        description: IMLocalized(
          'Add new listings directly from the app, including photo gallery and filters.',
        ),
      },
      {
        icon: require('../assets/icons/chat.png'),
        title: IMLocalized('Chat'),
        description: IMLocalized(
          'Communicate with your customers and vendors in real-time.',
        ),
      },
      {
        icon: require('../assets/icons/notification.png'),
        title: IMLocalized('Get Notified'),
        description: IMLocalized(
          'Stay on top of your game with real-time push notifications.',
        ),
      },
    ],
  },

  tabIcons: {
    Home: {
      focus: AppStyles.iconSet.homefilled,
      unFocus: AppStyles.iconSet.homeUnfilled,
    },
    Categories: {
      focus: AppStyles.iconSet.collections,
      unFocus: AppStyles.iconSet.collections,
    },
    Messages: {
      focus: AppStyles.iconSet.commentFilled,
      unFocus: AppStyles.iconSet.commentUnfilled,
    },
    Search: {
      focus: AppStyles.iconSet.search,
      unFocus: AppStyles.iconSet.search,
    },
  },
  reverseGeoCodingAPIKey: 'AIzaSyCDeWXVrJxUCRQlpcWK2JJQSB-kFVjCqlM',
  tosLink: 'https://www.instamobile.io/eula-instachatty/',
  isUsernameFieldEnabled: false,
  smsSignupFields: [
    {
      displayName: IMLocalized('First Name'),
      type: 'text',
      editable: true,
      regex: regexForNames,
      key: 'firstName',
      placeholder: 'First Name',
    },
    {
      displayName: IMLocalized('Last Name'),
      type: 'text',
      editable: true,
      regex: regexForNames,
      key: 'lastName',
      placeholder: 'Last Name',
    },
    {
      displayName: IMLocalized('Username'),
      type: 'text',
      editable: true,
      regex: regexForNames,
      key: 'username',
      placeholder: 'Username',
    },
  ],
  signupFields: [
    {
      displayName: IMLocalized('First Name'),
      type: 'text',
      editable: true,
      regex: regexForNames,
      key: 'firstName',
      placeholder: 'First Name',
    },
    {
      displayName: IMLocalized('Last Name'),
      type: 'text',
      editable: true,
      regex: regexForNames,
      key: 'lastName',
      placeholder: 'Last Name',
    },
    {
      displayName: IMLocalized('Username'),
      type: 'text',
      editable: true,
      regex: regexForNames,
      key: 'username',
      placeholder: 'Username',
    },
    {
      displayName: IMLocalized('E-mail Address'),
      type: 'text',
      editable: true,
      regex: regexForNames,
      key: 'email',
      placeholder: 'E-mail Address',
      autoCapitalize: 'none',
    },
    {
      displayName: IMLocalized('Password'),
      type: 'default',
      secureTextEntry: true,
      editable: true,
      regex: regexForNames,
      key: 'password',
      placeholder: 'Password',
      autoCapitalize: 'none',
    },
  ],
  editProfileFields: {
    sections: [
      {
        title: IMLocalized('PUBLIC PROFILE'),
        fields: [
          {
            displayName: IMLocalized('First Name'),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'firstName',
            placeholder: 'Your first name',
          },
          {
            displayName: IMLocalized('Last Name'),
            type: 'text',
            editable: true,
            regex: regexForNames,
            key: 'lastName',
            placeholder: 'Your last name',
          },
        ],
      },
      {
        title: IMLocalized('PRIVATE DETAILS'),
        fields: [
          {
            displayName: IMLocalized('E-mail Address'),
            type: 'text',
            editable: true,
            key: 'email',
            placeholder: 'Your email address',
          },
          {
            displayName: IMLocalized('Phone Number'),
            type: 'text',
            editable: true,
            regex: regexForPhoneNumber,
            key: 'phone',
            placeholder: 'Your phone number',
          },
        ],
      },
    ],
  },
  userSettingsFields: {
    sections: [
      {
        title: IMLocalized('GENERAL'),
        fields: [
          {
            displayName: IMLocalized('Allow Push Notifications'),
            type: 'switch',
            editable: true,
            key: 'push_notifications_enabled',
            value: true,
          },
          {
            ...(Platform.OS === 'ios'
              ? {
                displayName: IMLocalized('Enable Face ID / Touch ID'),
                type: 'switch',
                editable: true,
                key: 'face_id_enabled',
                value: false,
              }
              : {}),
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Save'),
            type: 'button',
            key: 'savebutton',
          },
        ],
      },
    ],
  },
  contactUsFields: {
    sections: [
      {
        title: IMLocalized('CONTACT'),
        fields: [
          {
            displayName: IMLocalized('Address'),
            type: 'text',
            editable: false,
            key: 'contacus',
            value: '142 Steiner Street, San Francisco, CA, 94115',
          },
          {
            displayName: IMLocalized('E-mail us'),
            value: 'admin@wwh.com',
            type: 'text',
            editable: false,
            key: 'email',
            placeholder: 'Your email address',
          },
        ],
      },
      {
        title: '',
        fields: [
          {
            displayName: IMLocalized('Call Us'),
            type: 'button',
            key: 'savebutton',
          },
        ],
      },
    ],
  },
  contactUsPhoneNumber: '+16504859694',
  homeConfig: {
    mainCategoryID: '9K8PiY0niAaIxVJo5m6Br',
    mainCategoryName: 'Companies',
  },

  bookingConfig: {
    buttonLabel: IMLocalized('Reserve'),
    type: 'airbnb',
  },
};

export default ListingAppConfig;
