import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  ActivityIndicator,
  BackHandler,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch, useSelector } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import StarRating from 'react-native-star-rating';
import SavedButton from '../SavedButton/SavedButton';
import { listingsAPI } from '../../Core/listing/api';
import ProfileImageCard from '../ProfileImageCard/ProfileImageCard';
import { userAPIManager } from '../../Core/api';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import DynamicAppStyles from '../../DynamicAppStyles';
import dynamicStyles from './styles';

function ListingProfileModal(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  let currentTheme = DynamicAppStyles.navThemeConstants[colorScheme];
  const userID = props.route.params.userID;

  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const favorites = useSelector((state) => state.favorites.favoriteItems);
  const currentUser = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  );
  const listingsUnsubscribe = useRef(null);
  const unsubscribe = useRef(null);
  const reviewsUnsubscribe = useRef(null);
  const willBlurSubscription = useRef(null);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: IMLocalized('Profile'),
      headerTintColor: currentTheme.activeTintColor,
      headerTitleStyle: { color: currentTheme.fontColor },
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
    });
  }, []);

  const onGetUserError = async () => {
    await setLoading(false);
    alert(
      '0ops! an error occured  while loading profile. This user profile may be incomplete.',
    );
    props.navigation.goBack();
  };

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack();

    return true;
  };

  const onListingsUpdate = (listingsData) => {
    setListings(listingsData);
  };

  const onPressListingItem = (item) => {
    props.navigation.navigate('ListingProfileModalDetailsScreen', {
      item,
    });

    return;
  };

  const onPressSavedIcon = (item) => {
    listingsAPI.saveUnsaveListing(item, currentUser?.id, favorites, dispatch);
  };

  const renderListingItem = ({ item }) => {
    const twoColumnListStyle = DynamicAppStyles.twoColumnListStyle(colorScheme);
    return (
      <TouchableOpacity onPress={() => onPressListingItem(item)}>
        <View style={twoColumnListStyle.listingItemContainer}>
          <FastImage
            style={twoColumnListStyle.listingPhoto}
            source={{ uri: item.photo }}
          />
          <SavedButton
            style={twoColumnListStyle.savedIcon}
            onPress={() => onPressSavedIcon(item)}
            item={item}
            isSaved={favorites && favorites[item.id] === true}
          />
          <Text numberOfLines={1} style={twoColumnListStyle.listingName}>
            {item.title}
          </Text>
          <Text style={twoColumnListStyle.listingPlace}>{item.place}</Text>
          <StarRating
            containerStyle={styles.starRatingContainer}
            maxStars={5}
            starSize={15}
            disabled={true}
            starStyle={styles.starStyle}
            emptyStar={DynamicAppStyles.appIcon.images.starNoFilled}
            fullStar={DynamicAppStyles.appIcon.images.starFilled}
            halfStarColor={
              DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor
            }
            rating={item.starCount}
          />
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    (async () => {
      const res = await userAPIManager.getUserData(userID);
      if (res.success) {
        setUser(res.data);
        setLoading(false);
      } else {
        onGetUserError();
      }
    })();

    listingsUnsubscribe.current = listingsAPI.subscribeListings(
      { userId: userID },
      favorites,
      onListingsUpdate,
    );
    willBlurSubscription.current = props.navigation.addListener(
      'blur',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid,
        ),
    );
    return () => {
      listingsUnsubscribe?.current && listingsUnsubscribe?.current();
      unsubscribe?.current && unsubscribe?.current();
      reviewsUnsubscribe?.current && reviewsUnsubscribe?.current();
      didFocusSubscription.current && didFocusSubscription.current();
      willBlurSubscription.current && willBlurSubscription.current();
    };
  }, []);

  if (loading) {
    return (
      <ActivityIndicator
        size="small"
        color={DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor}
      />
    );
  }

  if (!loading && !user) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={styles.profileCardContainer}>
          <ProfileImageCard disabled={true} user={user} />
        </View>
        <View style={styles.profileItemContainer}>
          <View style={styles.detailContainer}>
            <Text style={styles.profileInfo}>{'Profile Info'}</Text>
            <View style={styles.profileInfoContainer}>
              <View style={styles.profileInfoTitleContainer}>
                <Text style={styles.profileInfoTitle}>{'Phone Number :'}</Text>
              </View>
              <View style={styles.profileInfoValueContainer}>
                <Text style={styles.profileInfoValue}>
                  {user.phoneNumber ? user.phoneNumber : ''}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.gridContainer}>
            <Text style={styles.myListings}>{'Listings'}</Text>
            <FlatList
              vertical
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={listings}
              renderItem={(item) => renderListingItem(item)}
              keyExtractor={(item) => `${item.id}`}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

ListingProfileModal.propTypes = {
  user: PropTypes.object,
  onModal: PropTypes.func,
  isProfileModalVisible: PropTypes.bool,
  presentationStyle: PropTypes.string,
};

export default ListingProfileModal;
