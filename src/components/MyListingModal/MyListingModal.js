import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import { firebase } from '../../Core/api/firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import ActionSheet from 'react-native-actionsheet';
import { useColorScheme } from 'react-native-appearance';
import SavedButton from '../SavedButton/SavedButton';
import PostModal from '../PostModal/PostModal';
import ServerConfiguration from '../../ServerConfiguration';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import DynamicAppStyles from '../../DynamicAppStyles';
import dynamicStyles from './styles';
import { listingsAPI } from '../../Core/listing/api';
import { TNEmptyStateView } from '../../Core/truly-native';

function MyListingModal(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);

  const favorites = useSelector((state) => state.favorites.favoriteItems);
  const currentUser = useSelector((state) => state.auth.user);

  const dispatch = useDispatch();

  const appIcon = DynamicAppStyles.appIcon;
  const twoColumnListStyle = DynamicAppStyles.twoColumnListStyle(colorScheme);

  const { navigation, route } = props;
  let currentTheme = DynamicAppStyles.navThemeConstants[colorScheme];
  const [listings, setListings] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);

  const listingItemActionSheet = useRef(null);
  const categoriesUnsubscribe = useRef(null);
  const listingsUnsubscribe = useRef(null);
  const willBlurSubscription = useRef(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: IMLocalized('My Listings'),
      headerTintColor: currentTheme.activeTintColor,
      headerTitleStyle: { color: currentTheme.fontColor },
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
    });
  });

  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  );

  const listingsRef = useRef(
    firebase
      .firestore()
      .collection(ServerConfiguration.database.collection.LISTINGS),
  );
  const categoriesRef = useRef(
    firebase
      .firestore()
      .collection(ServerConfiguration.database.collection.CATEGORIES),
  );

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack();

    return true;
  };

  const onCategoriesCollectionUpdate = (querySnapshot) => {
    const data = [];
    querySnapshot.forEach((doc) => {
      const category = doc.data();
      data.push({ ...category, id: doc.id });
    });
    setCategories(data);
  };

  const onListingsCollectionUpdate = (querySnapshot) => {
    const data = listings || [];
    querySnapshot.forEach((doc) => {
      const listing = doc.data();
      data.push({ ...listing, id: doc.id });
    });

    setListings(data);
  };

  const onPressListingItem = (item) => {
    props.navigation.navigate('MyListingDetailModal', { item });
  };

  const onLongPressListingItem = async (item) => {
    console.log('am actually working');
    if (item.authorID === currentUser?.id) {
      await setSelectedItem(item);
      listingItemActionSheet.current.show();
    }
  };

  const onLisingItemActionDone = (index) => {
    if (index == 0) {
      setPostModalVisible(true);

      console.log(index);
    }

    if (index == 1) {
      Alert.alert(
        IMLocalized('Delete listing?'),
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
    firebase
      .firestore()
      .collection(ServerConfiguration.database.collection.LISTINGS)
      .doc(selectedItem.id)
      .delete()
      .then(function () {
        const realEstateSavedQuery = firebase
          .firestore()
          .collection(ServerConfiguration.database.collection.SAVED_LISTINGS)
          .where('listingID', '==', selectedItem.id);
        realEstateSavedQuery.get().then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            doc.ref.delete();
          });
        });
      })
      .catch(function (error) {
        console.log('Error deleting listing: ', error);
        alert(
          IMLocalized(
            'Oops! an error while deleting listing. Please try again later.',
          ),
        );
      });
  };

  const onPostCancel = () => {
    setPostModalVisible(false);
  };

  const onPressSavedIcon = (item) => {
    firebaseListing.saveUnsaveListing(
      item,
      currentUser?.id,
      favorites,
      dispatch,
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

  useEffect(() => {
    if (favorites && currentUser?.id) {
      listingsUnsubscribe.current = listingsRef.current
        .where('authorID', '==', currentUser?.id)
        .where('isApproved', '==', true)
        .onSnapshot(onListingsCollectionUpdate);
    }
  }, [favorites, currentUser]);

  useEffect(() => {
    categoriesUnsubscribe.current = categoriesRef.current.onSnapshot(
      onCategoriesCollectionUpdate,
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
      didFocusSubscription.current && didFocusSubscription.current();
      willBlurSubscription.current && willBlurSubscription.current();
    };
  }, []);

  const onEmptyStatePress = () => {
    navigation.navigate('Home');
  }

  const emptyStateConfig = {
    title: IMLocalized('No Listings'),
    description: IMLocalized(
      'You did not add any listings yet. Add some listings and they will show up here.',
    ),
    buttonName: IMLocalized('Add Listing'),
    onPress: onEmptyStatePress,
  };

  return (
    <View style={styles.container}>
      {listings && listings.length > 0 && (
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={listings}
          renderItem={renderListingItem}
          keyExtractor={(item, index) => `${item?.id || index}`}
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
      
      {postModalVisible && (
        <PostModal
          selectedItem={selectedItem}
          categories={categories}
          onCancel={onPostCancel}
        />
      )}
      <ActionSheet
        ref={listingItemActionSheet}
        title={'Confirm'}
        options={['Edit Listing', 'Remove Listing', 'Cancel']}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={(index) => {
          onLisingItemActionDone(index);
        }}
      />
    </View>
  );
}

export default MyListingModal;
