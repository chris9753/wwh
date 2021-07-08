import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { FlatList, Text, View, BackHandler } from 'react-native';
import { ListItem } from 'react-native-elements';
import Geolocation from '@react-native-community/geolocation';
import { useColorScheme } from 'react-native-appearance';
import { listingsAPI } from '../../Core/listing/api';
import HeaderButton from '../../components/HeaderButton/HeaderButton';
import { Configuration } from '../../Configuration';
import MapView, { Marker } from 'react-native-maps';
import FilterViewModal from '../../components/FilterViewModal/FilterViewModal';
import DynamicAppStyles from '../../DynamicAppStyles';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import { timeFormat } from '../../Core';
import dynamicStyles from './styles';
import ListingAppConfig from '../../ListingAppConfig';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { IMAdMobBanner } from '../../Core/ads/google';
import { TNActivityIndicator } from '../../Core/truly-native';

function ListingsListScreen(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  const appIcon = DynamicAppStyles.appIcon;
  const listStyle = DynamicAppStyles.listStyle(colorScheme);
  const headerButtonStyle = DynamicAppStyles.headerButtonStyle(colorScheme);
  const { navigation, route } = props;

  let currentTheme = DynamicAppStyles.navThemeConstants[colorScheme];

  const favorites = useSelector((state) => state.favorites.favoriteItems);

  useLayoutEffect(() => {
    navigation.setOptions({
      title:
        typeof route.params == 'undefined' ||
          typeof route.params.item == 'undefined'
          ? IMLocalized('Listings')
          : route.params.item.name || route.params.item.title,
      headerTintColor: currentTheme.activeTintColor,
      headerTitleStyle: { color: currentTheme.fontColor },
      headerRight: () => (
        <View style={headerButtonStyle.multi}>
          <HeaderButton
            customStyle={styles.toggleButton}
            style={{
              tintColor:
                DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor,
            }}
            icon={mapMode ? appIcon.images.list : appIcon.images.map}
            onPress={() => {
              onChangeMode();
            }}
          />
          <HeaderButton
            customStyle={styles.filtersButton}
            style={{
              tintColor:
                DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor,
            }}
            icon={appIcon.images.filters}
            onPress={() => onSelectFilter()}
          />
        </View>
      ),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
    });
  }, []);
  const item = route.params.item;

  const [category, setCategory] = useState(item);
  const [filter, setFilter] = useState({});
  const [data, setData] = useState(null);
  const [mapMode, setMapMode] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [latitude, setLatitude] = useState(Configuration.map.origin.latitude);
  const [longitude, setLongitude] = useState(
    Configuration.map.origin.longitude,
  );
  const [latitudeDelta, setLatitudeDelta] = useState(
    Configuration.map.delta.latitude,
  );
  const [longitudeDelta, setLongitudeDelta] = useState(
    Configuration.map.delta.longitude,
  );
  const [shouldUseOwnLocation, setShouldUseOwnLocation] = useState(false); // Set this to false to hide the user's location
  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  );
  const willBlurSubscription = useRef(null);
  const unsubscribe = useRef(null);

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack();

    return true;
  };

  const onChangeLocation = (location) => {
    setLatitude(location.latitude);
    setLongitude(location.longitude);
  };

  const onSelectFilter = () => {
    setFilterModalVisible(true);
  };

  const onSelectFilterCancel = () => {
    setFilterModalVisible(false);
  };

  const onSelectFilterDone = (filter) => {
    setFilter(filter);
    setFilterModalVisible(false);

    unsubscribe.current = listingsAPI.subscribeListings(
      { categoryId: category.id },
      favorites,
      onListingsUpdate,
    );
  };

  const onChangeMode = () => {
    const newMode = !mapMode;
    setMapMode(newMode);
  };

  const onListingsUpdate = (listingsData) => {
    let max_latitude = -400,
      min_latitude = 400,
      max_longitude = -400,
      min_logitude = 400;

    const filter = filter;

    for (let i = 0; i < listingsData.length; i++) {
      let matched = true;
      filter &&
        Object.keys(filter).forEach(function (key) {
          if (
            filter[key] != 'Any' &&
            filter[key] != 'All' &&
            listing.filters[key] != filter[key]
          ) {
            matched = false;
          }
        });

      console.log('matched=' + matched);

      if (!matched) return;

      const listing = listingsData[i];
      if (max_latitude < listing.latitude) max_latitude = listing.latitude;
      if (min_latitude > listing.latitude) min_latitude = listing.latitude;
      if (max_longitude < listing.longitude) max_longitude = listing.longitude;
      if (min_logitude > listing.longitude) min_logitude = listing.longitude;
    }

    if (!shouldUseOwnLocation || !latitude) {
      setLongitudeDelta(
        Math.abs((max_longitude - (max_longitude + min_logitude) / 2) * 3),
      );
      setLatitudeDelta(
        Math.abs((max_latitude - (max_latitude + min_latitude) / 2) * 3),
      );
      setData(listingsData);
      setLatitude((max_latitude + min_latitude) / 2);
      setLongitude((max_longitude + min_logitude) / 2);
    } else {
      setData(listingsData);
    }
  };

  const onPress = (item) => {
    props.navigation.navigate('SingleListingScreen', {
      item: item,
      customLeft: true,
      routeName: 'ListingsList',
    });
  };

  const renderItem = ({ item, index }) => {
    return (
      <>
        <ListItem
          key={item.id}
          title={item.title}
          titleStyle={listStyle.title}
          subtitle={
            <View style={listStyle.subtitleView}>
              <View style={listStyle.leftSubtitle}>
                <Text style={listStyle.time}>{timeFormat(item.createdAt)}</Text>
                <Text style={listStyle.place}>{item.place}</Text>
              </View>
            </View>
          }
          onPress={() => onPress(item)}
          avatarStyle={listStyle.avatarStyle}
          avatarContainerStyle={listStyle.avatarStyle}
          rightSubtitle={item.price}
          rightSubtitleStyle={listStyle.price}
          leftAvatar={
            <FastImage
              style={listStyle.avatarStyle}
              source={{ uri: item.photo }}
            />
          }
          containerStyle={listStyle.container}
          hideChevron={true}
        />
        {ListingAppConfig.adMobConfig && (index + 1) % 3 == 0 && (
          <IMAdMobBanner
            onAdFailedToLoad={(error) => console.log(error)}
            onAdLoaded={() => console.log('Ad loaded successfully')}
            appConfig={ListingAppConfig}
          />
        )}
      </>
    );
  };

  useEffect(() => {
    unsubscribe.current = listingsAPI.subscribeListings(
      { categoryId: category.id },
      favorites,
      onListingsUpdate,
    );

    if (shouldUseOwnLocation) {
      Geolocation.getCurrentPosition(
        (position) => {
          onChangeLocation(position.coords);
        },
        (error) => console.log(error.message)
      );
    }

    willBlurSubscription.current = props.navigation.addListener(
      'blur',
      (payload) =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          onBackButtonPressAndroid,
        ),
    );

    return () => {
      unsubscribe?.current && unsubscribe?.current();
      didFocusSubscription.current && didFocusSubscription.current();
      willBlurSubscription.current && willBlurSubscription.current();
    };
  }, []);

  const markerArr = () => {
    return data.map((listing) => (
      <Marker
        title={listing.title}
        description={listing.description}
        onCalloutPress={() => {
          onPress(listing);
        }}
        coordinate={{
          latitude: listing.latitude,
          longitude: listing.longitude,
        }}
      />
    ))
  };

  return (
    <View style={styles.container}>
      {!data && (
        <TNActivityIndicator appStyles={DynamicAppStyles} />
      )}
      {mapMode && data && (
        <MapView
          style={styles.mapView}
          showsUserLocation={shouldUseOwnLocation}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          }}>
          {markerArr()}
        </MapView>
      )}
      {!mapMode && data && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.id}`}
          initialNumToRender={5}
          refreshing={false}
        />
      )}
      {filterModalVisible && (
        <FilterViewModal
          value={filter}
          onCancel={onSelectFilterCancel}
          onDone={onSelectFilterDone}
          category={category}
        />
      )}
    </View>
  );
}

export default ListingsListScreen;
