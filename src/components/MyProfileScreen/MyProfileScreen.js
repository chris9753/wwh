import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { authManager } from '../../Core/onboarding/utils/api';
import DynamicAppStyles from '../../DynamicAppStyles';
import ListingAppConfig from '../../ListingAppConfig';
import { IMUserProfileComponent } from '../../Core/profile';
import { logout, setUserData } from '../../Core/onboarding/redux/auth';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { useColorScheme } from 'react-native-appearance';

function MyProfileScreen(props) {
  const willBlurSubscription = useRef(null);
  let colorScheme = useColorScheme();
  let currentTheme = DynamicAppStyles.navThemeConstants[colorScheme];
  const appIcon = DynamicAppStyles.appIcon;
  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  );

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack();

    return true;
  };

  const onLogout = () => {
    authManager.logout(props.user);
    props.logout();
    props.navigation.navigate('LoginStack', {
      screen: 'Welcome',
      params: {
        appStyles: DynamicAppStyles,
        appConfig: ListingAppConfig,
      },
    });
  };

  const onUpdateUser = (newUser) => {
    props.setUserData({ user: newUser });
  };

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: IMLocalized('My Profile'),
      headerTintColor: currentTheme.activeTintColor,
      headerTitleStyle: { color: currentTheme.fontColor },
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
    });
  });

  useEffect(() => {
    willBlurSubscription.current = props.navigation.addListener(
      'blur',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid,
        ),
    );
    return () => {
      didFocusSubscription.current && didFocusSubscription.current();
      willBlurSubscription.current && willBlurSubscription.current();
    };
  }, []);

  var menuItems = [
    {
      title: IMLocalized('My Listings'),
      tintColor: '#baa3f3',
      icon: appIcon.images.list,
      onPress: () => props.navigation.navigate('MyListingModal'),
    },
    {
      title: IMLocalized('My Favorites'),
      tintColor: '#df9292',
      icon: appIcon.images.wishlistFilled,
      onPress: () => props.navigation.navigate('SavedListingModal'),
    },
    {
      title: IMLocalized('Account Details'),
      icon: appIcon.images.accountDetail,
      tintColor: '#6b7be8',
      onPress: () =>
        props.navigation.navigate('AccountDetail', {
          appStyles: DynamicAppStyles,
          form: ListingAppConfig.editProfileFields,
          screenTitle: IMLocalized('Edit Profile'),
        }),
    },
    {
      title: IMLocalized('Settings'),
      icon: appIcon.images.settings,
      tintColor: '#a6a4b1',
      onPress: () =>
        props.navigation.navigate('Settings', {
          appStyles: DynamicAppStyles,
          form: ListingAppConfig.userSettingsFields,
          screenTitle: IMLocalized('Settings'),
        }),
    },
    {
      title: IMLocalized('Contact Us'),
      icon: appIcon.images.contactUs,
      tintColor: '#9ee19f',
      onPress: () =>
        props.navigation.navigate('Contact', {
          appStyles: DynamicAppStyles,
          form: ListingAppConfig.contactUsFields,
          screenTitle: IMLocalized('Contact us'),
        }),
    },
    {
      title: IMLocalized('Blocked Users'),
      icon: appIcon.images.blockedUser,
      tintColor: '#9a91c4',
      onPress: () =>
        props.navigation.navigate('BlockedUsers', {
          appStyles: DynamicAppStyles,
          screenTitle: IMLocalized('BlockedUsers'),
        }),
    },
  ];

  if (props?.isAdmin) {
    menuItems.push({
      title: IMLocalized('Admin Dashboard'),
      tintColor: '#8aced8',
      icon: appIcon.images.checklist,
      onPress: () => props.navigation.navigate('AdminDashboard'),
    });
  }

  return (
    <IMUserProfileComponent
      user={props.user}
      onUpdateUser={(user) => onUpdateUser(user)}
      onLogout={() => onLogout()}
      menuItems={menuItems}
      appStyles={DynamicAppStyles}
    />
  );
}

const mapStateToProps = ({ auth }) => {
  return {
    user: auth.user,
    isAdmin: auth.user && auth.user.isAdmin,
  };
};

export default connect(mapStateToProps, {
  logout,
  setUserData,
})(MyProfileScreen);
