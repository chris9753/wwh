import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import StarRating from 'react-native-star-rating';
import { listingsAPI } from '../../Core/listing/api';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { useColorScheme } from 'react-native-appearance';
import SavedButton from '../../components/SavedButton/SavedButton';
import DynamicAppStyles from '../../DynamicAppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import dynamicStyles from './styles';
import { setFavoriteItems } from '../../Core/favorites/redux';
import TNActivityIndicator from '../../Core/truly-native/TNActivityIndicator';
import { TNEmptyStateView } from '../../Core/truly-native';

function SavedListingScreen(props) {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favoriteItems);
  const currentUser = useSelector((state) => state.auth.user);

  const styles = dynamicStyles(colorScheme);

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(false);

  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  );
  const listingsUnsubscribe = useRef(null);
  const willBlurSubscription = useRef(null);
  const savedListingsUnsubscribe = useRef(null);

  const currentTheme = DynamicAppStyles.navThemeConstants[colorScheme];

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: IMLocalized('Saved Listings'),
      headerTintColor: currentTheme.activeTintColor,
      headerTitleStyle: { color: currentTheme.fontColor },
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
    });
  }, []);

  useLayoutEffect(() => {
    if (!favorites) {
      return;
    }
    if (listingsUnsubscribe?.current) {
      listingsUnsubscribe?.current();
    }
    listingsUnsubscribe.current = listingsAPI.subscribeListings(
      {},
      favorites,
      onListingsUpdate,
    );
  }, [currentUser?.id]);

  useEffect(() => {
    savedListingsUnsubscribe.current = listingsAPI.subscribeSavedListings(
      currentUser?.id,
      onSavedListingsUpdate,
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
      savedListingsUnsubscribe?.current && savedListingsUnsubscribe?.current();
      didFocusSubscription.current && didFocusSubscription.current();
      willBlurSubscription.current && willBlurSubscription.current();
    };
  }, []);

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack();

    return true;
  };

  const onSavedListingsUpdate = (savedListingdata) => {
    dispatch(setFavoriteItems(savedListingdata));
    savedListingsUnsubscribe?.current && savedListingsUnsubscribe?.current();
    setLoading(false);
  };

  const onListingsUpdate = (listingsData) => {
    setListings(listingsData);
    setLoading(false);
  };

  const onPressListingItem = (item) => {
    props.navigation.navigate('MyListingDetailModal', { item });
  };

  const onPressSavedIcon = (item) => {
    listingsAPI.saveUnsaveListing(item, currentUser?.id, favorites, dispatch);
  };

  const renderListingItem = ({ item }) => {
    const appIcon = DynamicAppStyles.appIcon;
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
            emptyStar={appIcon.images.starNoFilled}
            fullStar={appIcon.images.starFilled}
            halfStarColor={
              DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor
            }
            rating={item.starCount}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const onEmptyStatePress = () => {
    props.navigation.navigate('Home');
  }

  const emptyStateConfig = {
    title: IMLocalized('No Listings'),
    description: IMLocalized(
      'You did not save any listings yet. Tap the heart icon to favorite a listing and they will show up here.',
    ),
    buttonName: IMLocalized('Save Listings'),
    onPress: onEmptyStatePress,
  };

  return (
    <View style={styles.container}>
      {(!favorites || !listings) && (
        <TNActivityIndicator appStyles={DynamicAppStyles} />
      )}
      {favorites && listings && (
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={(item) => `${item.id}`}
        />
      )}
      {listings && listings.length == 0 && (
        <View style={styles.emptyViewContainer}>
          <TNEmptyStateView
            emptyStateConfig={emptyStateConfig}
            appStyles={DynamicAppStyles}
          />
        </View>
      )}
    </View>
  );
}

export default SavedListingScreen;
