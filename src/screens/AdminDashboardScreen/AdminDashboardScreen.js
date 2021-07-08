import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import Button from 'react-native-button';
import FastImage from 'react-native-fast-image';
import { listingsAPI } from '../../Core/listing/api';
import { useDispatch, useSelector } from 'react-redux';
import ActionSheet from 'react-native-actionsheet';
import SavedButton from '../../components/SavedButton/SavedButton';
import { Configuration } from '../../Configuration';
import DynamicAppStyles from '../../DynamicAppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import dynamicStyles from './styles';

function AdminDashboardScreen(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);

  const currentUser = useSelector((state) => state.auth.user);
  const favorites = useSelector((state) => state.favorites.favoriteItems);

  const dispatch = useDispatch();

  const twoColumnListStyle = DynamicAppStyles.twoColumnListStyle(colorScheme);

  const [listings, setListings] = useState([]);
  const [allListings, setAllListings] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showedAll, setShowedAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const listingsUnsubscribe = useRef(null);
  const listingItemActionSheet = useRef(null);
  const willBlurSubscription = useRef(null);
  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  );

  let currentTheme = DynamicAppStyles.navThemeConstants[colorScheme];

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: IMLocalized('Admin Dashboard'),
      headerTintColor: currentTheme.activeTintColor,
      headerTitleStyle: { color: currentTheme.fontColor },
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
    });
  }, []);

  useEffect(() => {
    listingsUnsubscribe.current = listingsAPI.subscribeToUnapprovedListings(onListingsCollectionUpdate);

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

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack();

    return true;
  };

  const onListingsCollectionUpdate = (listingsData) => {
    for (let i = 0; i < listingsData.length; i++) {
      const listing = listingsData[i];
      if (favorites[listing.id] === true) {
        listing.saved = true;
      } else {
        listing.saved = false;
      }
    }

    setListings(listingsData.slice(0, Configuration.home.initial_show_count));
    setAllListings(listingsData);
    setLoading(false);
    setShowedAll(listingsData.length <= Configuration.home.initial_show_count);
  };

  const onPressListingItem = (item) => {
    props.navigation.navigate('MyListingDetailModal', {
      item: item,
    });
  };

  const onLongPressListingItem = async (item) => {
    await setSelectedItem(item);
    listingItemActionSheet.current.show();
  };

  const onShowAll = () => {
    setShowedAll(true);
    setListings(allListings);
  };

  const onLisingItemActionDone = (index) => {
    if (index === 0) {
      approveListing();
    }

    if (index == 1) {
      Alert.alert(
        'Delete Listing',
        'Are you sure you want to remove this listing?',
        [
          {
            text: 'Yes',
            onPress: removeListing,
            style: 'destructive',
          },
          { text: 'No' },
        ],
        { cancelable: false },
      );
    }
  };

  const removeListing = () => {
    listingsAPI.removeListing(selectedItem.id, ({ success }) => {
      if (success) {
        return;
      }
      alert(IMLocalized('There was an error deleting listing!'));
    });
  };

  const approveListing = () => {
    listingsAPI.approveListing(selectedItem.id, ({ success }) => {
      if (success) {
        alert('Listing successfully approved!');
        return;
      }
      alert('Error approving listing!');
    });
  };

  const onPressSavedIcon = (item) => {
    listingsAPI.saveUnsaveListing(item, currentUser?.id, favorites, dispatch);
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
            item={item}
          />
          <Text style={{ ...twoColumnListStyle.listingName, maxHeight: 40 }}>
            {item.title}
          </Text>
          <Text style={twoColumnListStyle.listingPlace}>{item.place}</Text>
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

  if (loading) {
    return (
      <ActivityIndicator
        style={styles.mainContainer}
        size="small"
        color={DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor}
      />
    );
  }

  return (
    <View style={styles.mainContainer}>
      {listings.length > 0 ? (
        <ScrollView style={styles.container}>
          <Text style={[styles.title, styles.listingTitle]}>
            {'Awaiting Approval'}
          </Text>
          <FlatList
            vertical
            showsVerticalScrollIndicator={false}
            ListFooterComponent={showedAll ? '' : renderListingFooter}
            numColumns={2}
            data={listings}
            renderItem={renderListingItem}
            keyExtractor={(item) => `${item.id}`}
          />
        </ScrollView>
      ) : (
        <View style={styles.container}>
          <Text style={styles.noMessage}>
            {IMLocalized('There are no listings awaiting approval.')}
          </Text>
        </View>
      )}
      <ActionSheet
        ref={listingItemActionSheet}
        title={'Confirm'}
        options={['Approve', 'Delete', 'Cancel']}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={(index) => {
          onLisingItemActionDone(index);
        }}
      />
    </View>
  );
}

export default AdminDashboardScreen;
