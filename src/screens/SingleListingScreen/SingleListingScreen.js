import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Alert,
  BackHandler,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import MapView, { Marker } from 'react-native-maps';
import StarRating from 'react-native-star-rating';
import { useColorScheme } from 'react-native-appearance';
import { reviewAPI, listingsAPI } from '../../Core/listing/api';
import HeaderButton from '../../components/HeaderButton/HeaderButton';
import ReviewModal from '../../components/ReviewModal/ReviewModal';
import DynamicAppStyles from '../../DynamicAppStyles';
import { timeFormat } from '../../Core';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import dynamicStyles from './styles';
import ListingAppConfig from '../../ListingAppConfig';

const defaultAvatar =
  'https://www.iosapptemplates.com/wp-content/uploads/2019/06/empty-avatar.jpg';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get(
  'window',
);
const LATITUDEDELTA = 0.0422;
const LONGITUDEDELTA = 0.0221;

function DetailScreen(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);

  const appIcon = DynamicAppStyles.appIcon;
  const headerButtonStyle = DynamicAppStyles.headerButtonStyle(colorScheme);

  const { navigation, route } = props;
  let currentTheme = DynamicAppStyles.navThemeConstants[colorScheme];

  const item = route.params.item;
  const favorites = useSelector((state) => state.favorites.favoriteItems);

  const dispatch = useDispatch();

  const [activeSlide, setActiveSlide] = useState(0);
  const [listing, setListing] = useState(item ? item : {});
  const [reviews, setReviews] = useState([]);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [saved, setSaved] = useState(false);
  const [didFinishAnimation, setDidFinishAnimation] = useState(false);

  const currentUser = useSelector((state) => state.auth.user);

  const reviewsUnsubscribe = useRef(null);

  const [willBlur, setWillBlur] = useState(false);
  const willBlurSubscription = useRef(null);
  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) => {
      setWillBlur(false);
    }),
  );

  const onBackButtonPressAndroid = () => {
    const customLeft = props.route.params.customLeft;
    const routeName = props.route.params.routeName;

    if (customLeft) {
      props.navigation.navigate(routeName);
    } else {
      props.navigation.goBack();
    }

    return true;
  };

  const onPersonalMessage = () => {
    const viewer = currentUser;
    const viewerID = viewer.id || viewer.userID;
    const vendorID = listing.authorID || listing.authorID;
    let channel = {
      id: viewerID < vendorID ? viewerID + vendorID : vendorID + viewerID,
      participants: [listing.author, viewer],
    };
    props.navigation.navigate('PersonalChat', {
      channel,
      appStyles: DynamicAppStyles,
    });
  };

  const onListingUpdate = (listingsData) => {
    if (listingsData) {
      setListing(listingsData);
    }
  };

  const updateReviews = (reviews) => {
    setReviews(reviews);
  };

  const onReviewsUpdate = (reviewsData) => {
    updateReviews(reviewsData);
  };

  const onPressReview = () => {
    if (!currentUser?.id) {
      navigation.navigate('DelayedLogin', {
        params: { appConfig: ListingAppConfig },
      });
      return;
    }
    setReviewModalVisible(true);
  };

  const onDelete = () => {
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
  };

  const removeListing = () => {
    const customLeft = props.route.params.customLeft;
    const routeName = props.route.params.routeName;

    listingsAPI.removeListing(listing.id, ({ success }) => {
      if (success) {
        alert(IMLocalized('The listing was successfully deleted.'));
        if (customLeft) {
          props.navigation.navigate(routeName);
        } else {
          props.navigation.goBack();
        }
        return;
      }
      alert(IMLocalized('There was an error deleting listing!'));
    });
  };

  const onReviewCancel = () => {
    setReviewModalVisible(false);
  };

  const onPressSave = () => {
    if (!currentUser?.id) {
      navigation.navigate('DelayedLogin', {
        params: { appConfig: ListingAppConfig },
      });
      return;
    }
    listingsAPI.saveUnsaveListing(
      listing,
      currentUser?.id,
      favorites,
      dispatch,
    );
  };

  const renderItem = ({ item }) => {
    if (!item) {
      return null;
    }
    return (
      <TouchableOpacity>
        {item.startsWith('https://') ? (
          <FastImage
            style={styles.photoItem}
            resizeMode={FastImage.resizeMode.cover}
            source={{ uri: item }}
          />
        ) : (
          <FastImage
            style={styles.photoItem}
            resizeMode={FastImage.resizeMode.cover}
            source={{ uri: 'https//:' }}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.info}>
        <FastImage
          style={styles.userPhoto}
          resizeMode={FastImage.resizeMode.cover}
          source={
            item.profilePictureURL
              ? { uri: item.profilePictureURL }
              : { uri: defaultAvatar }
          }
        />
        <View style={styles.detail}>
          <Text style={styles.username}>
            {item.firstName && item.firstName} {item.lastName && item.lastName}
          </Text>
          <Text style={styles.reviewTime}>{timeFormat(item.createdAt)}</Text>
        </View>
        <StarRating
          containerStyle={styles.starRatingContainer}
          disabled={true}
          maxStars={5}
          starSize={22}
          starStyle={styles.starStyle}
          emptyStar={appIcon.images.starNoFilled}
          fullStar={appIcon.images.starFilled}
          halfStarColor={
            DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor
          }
          rating={item.starCount}
        />
      </View>
      <Text style={styles.reviewContent}>{item.content}</Text>
    </View>
  );

  var extraInfoArr = null;
  if (listing.filters) {
    const filters = listing.filters;
    extraInfoArr = Object.keys(filters).map(function (key) {
      if (filters[key] != 'Any' && filters[key] != 'All') {
        return (
          <View style={styles.extraRow}>
            <Text style={styles.extraKey}>{key}</Text>
            <Text style={styles.extraValue}>{filters[key]}</Text>
          </View>
        );
      }
    });
  }

  useLayoutEffect(() => {
    if (!currentUser || !listing) {
      return;
    }
    const options = {
      headerTintColor: currentTheme.activeTintColor,
      headerTitle: '',
      headerTitleStyle: { color: currentTheme.fontColor },
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
      },
      headerRight: () => (
        <View style={headerButtonStyle.multi}>
          {(currentUser?.isAdmin || currentUser?.id === listing.authorID) && (
            <HeaderButton
              customStyle={styles.headerIconContainer}
              iconStyle={[styles.headerIcon, { tintColor: '#e2362d' }]}
              icon={appIcon.images.delete}
              onPress={() => onDelete()}
            />
          )}
          {currentUser?.id !== listing.authorID && (
            <HeaderButton
              customStyle={styles.headerIconContainer}
              iconStyle={styles.headerIcon}
              icon={appIcon.images.accountDetail}
              onPress={() => {
                navigation.navigate('ListingProfileModal', {
                  userID: listing.authorID,
                });
              }}
            />
          )}
          {currentUser?.id !== listing.authorID && listing.author && (
            <HeaderButton
              customStyle={styles.headerIconContainer}
              iconStyle={styles.headerIcon}
              icon={appIcon.images.communication}
              onPress={() => {
                onPersonalMessage();
              }}
            />
          )}
          <HeaderButton
            customStyle={styles.headerIconContainer}
            iconStyle={styles.headerIcon}
            icon={appIcon.images.review}
            onPress={() => {
              onPressReview();
            }}
          />
          <HeaderButton
            customStyle={styles.headerIconContainer}
            icon={saved ? appIcon.images.heartFilled : appIcon.images.heart}
            onPress={onPressSave}
            iconStyle={styles.headerIcon}
          />
        </View>
      ),
    };
    navigation.setOptions(options);

    props.navigation.setParams({
      onDelete: onDelete,
      onPressReview: onPressReview,
      onPressSave: onPressSave,
      onPersonalMessage: onPersonalMessage,
      author: listing.author,
    });

    setTimeout(() => {
      setDidFinishAnimation(true);
    }, 500);
  }, [currentUser, saved, favorites]);

  useEffect(() => {
    if (favorites) {
      setSaved(favorites[item?.id] === true);
    }
  }, [item, favorites]);

  useEffect(() => {
    // Even if we already have the listings data from the previous screen, we still fetch it from the server again, in case it refreshed
    listingsAPI.fetchListing(
      listing?.id,
      onListingUpdate,
    );

    reviewsUnsubscribe.current = reviewAPI.subscribeReviews(
      listing.id,
      onReviewsUpdate,
    );
  }, [currentUser]);

  useEffect(() => {
    willBlurSubscription.current = props.navigation.addListener(
      'blur',
      (payload) => {
        setWillBlur(true);
      },
    );
    return () => {
      willBlurSubscription.current && willBlurSubscription.current();
      didFocusSubscription.current && didFocusSubscription.current();
    };
  }, []);

  useEffect(() => {
    if (willBlur) {
      reviewsUnsubscribe?.current && reviewsUnsubscribe?.current();
    }
    BackHandler.addEventListener('hardwareBackPress', onBackButtonPressAndroid);
  }, [saved]);

  useEffect(() => {
    if (willBlur) {
      reviewsUnsubscribe?.current && reviewsUnsubscribe?.current();
    }
    BackHandler.addEventListener('hardwareBackPress', onBackButtonPressAndroid);
  }, [willBlur]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.carousel}>
        <Carousel
          data={listing.photos}
          renderItem={renderItem}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth}
          // hasParallaxImages={true}
          inactiveSlideScale={1}
          inactiveSlideOpacity={1}
          firstItem={0}
          loop={false}
          // loopClonesPerSide={2}
          autoplay={false}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={(index) => setActiveSlide(index)}
        />
        <Pagination
          dotsLength={listing.photos && listing.photos.length}
          activeDotIndex={activeSlide}
          containerStyle={styles.paginationContainer}
          dotColor={'rgba(255, 255, 255, 0.92)'}
          dotStyle={styles.paginationDot}
          inactiveDotColor="white"
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
      </View>
      <Text style={styles.title}> {listing.title} </Text>
      <Text style={styles.description}> {listing.description} </Text>
      <Text style={styles.title}> {IMLocalized('Location')} </Text>
      {listing && listing.latitude && didFinishAnimation ? (
        <MapView
          style={styles.mapView}
          initialRegion={{
            latitude: listing.latitude,
            longitude: listing.longitude,
            latitudeDelta: LATITUDEDELTA,
            longitudeDelta: LONGITUDEDELTA,
          }}>
          <Marker
            coordinate={{
              latitude: listing.latitude,
              longitude: listing.longitude,
            }}
          />
        </MapView>
      ) : (
        <View style={[styles.mapView, styles.loadingMap]}>
          <ActivityIndicator
            size="small"
            color={
              DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor
            }
          />
        </View>
      )}
      <Text style={styles.title}> {IMLocalized('Extra info')} </Text>
      {extraInfoArr && <View style={styles.extra}>{extraInfoArr}</View>}
      {reviews.length > 0 && (
        <Text style={[styles.title, styles.reviewTitle]}>
          {' '}
          {IMLocalized('Reviews')}{' '}
        </Text>
      )}
      <FlatList
        data={reviews}
        renderItem={renderReviewItem}
        keyExtractor={(item, index) => `${item?.id || index}`}
        initialNumToRender={5}
      />
      {reviewModalVisible && (
        <ReviewModal
          listing={listing}
          onCancel={onReviewCancel}
          onDone={onReviewCancel}
        />
      )}
    </ScrollView>
  );
}

export default DetailScreen;
