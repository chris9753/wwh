import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  BackHandler,
} from 'react-native';
import Button from 'react-native-button';
import StarRating from 'react-native-star-rating';
import FastImage from 'react-native-fast-image';
import Geolocation from '@react-native-community/geolocation';
import * as Permissions from 'expo-permissions';
import { listingsAPI } from '../../Core/listing/api';
import { useSelector, useDispatch } from 'react-redux';
import ActionSheet from 'react-native-actionsheet';
import { useColorScheme } from 'react-native-appearance';
import HeaderButton from '../../components/HeaderButton/HeaderButton';
import PostModal from '../../components/PostModal/PostModal';
import SavedButton from '../../components/SavedButton/SavedButton';
import { Configuration } from '../../Configuration';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { setFavoriteItems } from '../../Core/favorites/redux';
import DynamicAppStyles from '../../DynamicAppStyles';
import ListingAppConfig from '../../ListingAppConfig';
import dynamicStyles from './styles';
import TNActivityIndicator from '../../Core/truly-native/TNActivityIndicator';

function HomeScreen(props) {
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.auth.user);
  const favorites = useSelector((state) => state.favorites.favoriteItems);

  const colorScheme = useColorScheme();
  const headerButtonStyle = DynamicAppStyles.headerButtonStyle(colorScheme);
  const twoColumnListStyle = DynamicAppStyles.twoColumnListStyle(colorScheme);

  const styles = dynamicStyles(colorScheme);
  const currentTheme = DynamicAppStyles.navThemeConstants[colorScheme];
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState(null);
  const [allListings, setAllListings] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showedAll, setShowedAll] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);

  const listingItemActionSheet = useRef(null);
  const categoriesUnsubscribe = useRef(null);
  const savedListingsUnsubscribe = useRef(null);
  const listingsUnsubscribe = useRef(null);
  const willBlurSubscription = useRef(null);
  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  );

  const { navigation } = props;

  // useLayoutEffect(() => {
  //   askForLocationPermissionIfNeeded();
  //   navigation.setOptions({
  //     title: IMLocalized('Home'),
  //     headerLeft: () => {
  //       return (
  //         <TouchableOpacity
  //           onPress={() => {
  //             if (!currentUser?.id) {
  //               navigation.navigate('DelayedLogin', {
  //                 params: { appConfig: ListingAppConfig },
  //               });
  //               return;
  //             }
  //             navigation.navigate('MyProfile');
  //           }}>
  //           {currentUser?.profilePictureURL ? (
  //             <FastImage
  //               style={styles.userPhoto}
  //               resizeMode={FastImage.resizeMode.cover}
  //               source={{ uri: currentUser?.profilePictureURL }}
  //             />
  //           ) : (
  //             <FastImage
  //               style={styles.userPhoto}
  //               resizeMode={FastImage.resizeMode.cover}
  //               source={DynamicAppStyles.iconSet.userAvatar}
  //             />
  //           )}
  //         </TouchableOpacity>
  //       );
  //     },
  //     headerRight: () => (
  //       <View style={headerButtonStyle.multi}>
  //         <HeaderButton
  //           customStyle={styles.composeButton}
  //           icon={DynamicAppStyles.iconSet.compose}
  //           onPress={() => {
  //             if (!currentUser?.id) {
  //               navigation.navigate('DelayedLogin', {
  //                 params: { appConfig: ListingAppConfig },
  //               });
  //               return;
  //             }
  //             onPressPost();
  //           }}
  //         />
  //         <HeaderButton
  //           customStyle={styles.mapButton}
  //           icon={DynamicAppStyles.iconSet.map}
  //           onPress={() => {
  //             navigation.navigate('Map');
  //           }}
  //         />
  //       </View>
  //     ),
  //     headerStyle: {
  //       backgroundColor: currentTheme.backgroundColor,
  //       borderBottomColor: currentTheme.hairlineColor,
  //     },
  //   });
  // }, [currentUser]);

  const onBackButtonPressAndroid = () => {
    BackHandler.exitApp();
    return true;
  };

  const onCategoriesUpdate = (categoriesData) => {
    console.log(categoriesData);
    setCategories(categoriesData);
  };

  const onListingsUpdate = (listingsData) => {
    console.log("listing data", listingsData.length)
    setListings(listingsData.slice(0, Configuration.home.initial_show_count));
    setAllListings(listingsData);
    setShowedAll(listingsData.length <= Configuration.home.initial_show_count);
  };

  const onSavedListingsUpdate = (savedListingdata) => {
    dispatch(setFavoriteItems(savedListingdata));
    savedListingsUnsubscribe?.current && savedListingsUnsubscribe?.current();
  };

  const onPressPost = () => {
    setSelectedItem(null);
    setPostModalVisible(true);
  };

  const onPostCancel = () => {
    setPostModalVisible(false);
  };

  const onPressCategoryItem = (item) => {
    props.navigation.navigate('ListingsList', { item: item });
  };

  const onPressListingItem = (item) => {
    props.navigation.navigate('SingleListingScreen', {
      item: item,
      customLeft: true,
      routeName: 'Home',
    });
  };

  const onLongPressListingItem = async (item) => {
    if (!currentUser?.id) {
      navigation.navigate('DelayedLogin', {
        params: { appConfig: ListingAppConfig },
      });
      return;
    }
    if (item.authorID === currentUser?.id) {
      await setSelectedItem(item);
      listingItemActionSheet.current.show();
    }
  };

  const onShowAll = () => {
    props.navigation.navigate('ListingsList', {
      item: {
        id: ListingAppConfig.homeConfig.mainCategoryID,
        name: ListingAppConfig.homeConfig.mainCategoryName,
      },
    });
  };

  const onPressSavedIcon = (item) => {
    if (!currentUser?.id) {
      navigation.navigate('DelayedLogin', {
        params: { appConfig: ListingAppConfig },
      });
      return;
    }
    listingsAPI.saveUnsaveListing(item, currentUser?.id, favorites, dispatch);
  };

  const onLisingItemActionDone = (index) => {
    if (index == 0) {
      setPostModalVisible(true);
      console.log(index);
    }

    if (index == 1) {
      Alert.alert(
        IMLocalized('Delete Listing'),
        IMLocalized('Are you sure you want to remove this listing?'),
        [
          {
            text: IMLocalized('Yes'),
            onPress: removeListing,
            style: 'destructive',
          },
          { text: IMLocalized('No') },
        ],
        { cancelable: false },
      );
    }
  };

  const removeListing = () => {
    listingsAPI.removeListing(selectedItem.id, ({ success }) => {
      if (!success) {
        alert(
          IMLocalized(
            'There was an error deleting the listing. Please try again',
          ),
        );
      }
    });
  };

  const askForLocationPermissionIfNeeded = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      resolve({ coords: { latitude: '', longitude: '' } });
      return;
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity onPress={() => onPressCategoryItem(item)}>
      <View style={styles.categoryItemContainer}>
        <FastImage
          style={styles.categoryItemPhoto}
          source={{ uri: item.photo }}
        />
        <Text style={styles.categoryItemTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategorySeparator = () => {
    return (
      <View
        style={{
          width: 10,
          height: '100%',
        }}
      />
    );
  };

  const renderListingItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => onPressListingItem(item)}
        onLongPress={() => onLongPressListingItem(item)}>
        <View style={twoColumnListStyle.listingItemContainer}>
          <FastImage
            style={twoColumnListStyle.listingPhoto}
            source={{ uri: item.photo }}
          />
          <SavedButton
            style={twoColumnListStyle.savedIcon}
            onPress={() => onPressSavedIcon(item)}
            isSaved={
              favorites && currentUser?.id && favorites[item.id] === true
            }
          />
          <Text style={{ ...twoColumnListStyle.listingName, maxHeight: 40 }}>
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

  const renderListingFooter = () => {
    return (
      <Button
        containerStyle={twoColumnListStyle.showAllButtonContainer}
        style={twoColumnListStyle.showAllButtonText}
        onPress={() => onShowAll()}>
        {IMLocalized('Show all')} ({allListings.length})
      </Button>
    );
  };

  useEffect(() => {
    listingsUnsubscribe.current = listingsAPI.subscribeListings(
      { categoryId: ListingAppConfig.homeConfig.mainCategoryID },
      favorites,
      onListingsUpdate,
    );
  }, [favorites]);

  useEffect(() => {
    categoriesUnsubscribe.current = listingsAPI.subscribeListingCategories(
      onCategoriesUpdate,
    );

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
      categoriesUnsubscribe?.current && categoriesUnsubscribe?.current();
      listingsUnsubscribe?.current && listingsUnsubscribe?.current();
      savedListingsUnsubscribe?.current && savedListingsUnsubscribe?.current();
      didFocusSubscription.current && didFocusSubscription.current();
      willBlurSubscription.current && willBlurSubscription.current();
    };
  }, []);

  if (favorites === null || listings === null) {
    return <TNActivityIndicator appStyles={DynamicAppStyles} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{IMLocalized('Categories')}</Text>
      <View style={styles.categories}>
        <FlatList
          horizontal={true}
          initialNumToRender={4}
          ItemSeparatorComponent={() => renderCategorySeparator()}
          data={categories}
          showsHorizontalScrollIndicator={false}
          renderItem={(item) => renderCategoryItem(item)}
          keyExtractor={(item) => `${item.id}`}
        />
      </View>
      <Text style={[styles.title, styles.listingTitle]}>
        {ListingAppConfig.homeConfig.mainCategoryName}
      </Text>

      {favorites && listings ? (
        <View style={styles.listings}>
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            ListFooterComponent={!showedAll ? renderListingFooter : ''}
            numColumns={2}
            data={listings}
            renderItem={renderListingItem}
            keyExtractor={(item) => `${item.id}`}
          />
        </View>
      ) : (
        <View />
      )}

      {postModalVisible && (
        <PostModal
          selectedItem={selectedItem}
          categories={categories}
          onCancel={onPostCancel}
        />
      )}
      <ActionSheet
        ref={listingItemActionSheet}
        title={IMLocalized('Confirm')}
        options={[
          IMLocalized('Edit Listing'),
          IMLocalized('Remove Listing'),
          IMLocalized('Cancel'),
        ]}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={(index) => {
          onLisingItemActionDone(index);
        }}
      />
    </ScrollView>
  );
}

export default HomeScreen;
