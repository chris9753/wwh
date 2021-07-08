import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { BackHandler } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { listingsAPI } from '../../Core/listing/api';
import { Configuration } from '../../Configuration';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import DynamicAppStyles from '../../DynamicAppStyles';
import Geolocation from '@react-native-community/geolocation';
import { useColorScheme } from 'react-native-appearance';
import styles from './styles';
import { useSelector } from 'react-redux';

function MapScreen(props) {
  const { navigation, route } = props;
  const colorSceme = useColorScheme();
  const currentTheme = DynamicAppStyles.navThemeConstants[colorSceme];

  const favorites = useSelector((state) => state.favorites.favoriteItems);

  useLayoutEffect(() => {
    props.navigation.setOptions({
      title: IMLocalized('Map View'),
      headerTintColor: currentTheme.activeTintColor,
      headerTitleStyle: { color: currentTheme.fontColor },
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
    });
  }, []);

  const item = route?.params?.item;

  const [data, setData] = useState([]);
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
  const [shouldUseOwnLocation, setShouldUseOwnLocation] = useState(true); // Set this to false if you don't want the current user's location to be considered

  const unsubscribe = useRef(null);
  const willBlurSubscription = useRef(null);
  const didFocusSubscription = useRef(
    props.navigation.addListener('focus', (payload) =>
      BackHandler.addEventListener(
        'hardwareBackPress',
        onBackButtonPressAndroid,
      ),
    ),
  );

  useEffect(() => {
    if (item) {
      unsubscribe.current = listingsAPI.subscribeListings(
        { categoryId: item.id },
        onListingsUpdate,
      );
    } else {
      unsubscribe.current = listingsAPI.subscribeListings(
        {},
        favorites,
        onListingsUpdate,
      );
    }

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

  const onChangeLocation = (location) => {
    setLongitude(location.longitude);
    setLatitude(location.latitude);
  };

  const onBackButtonPressAndroid = () => {
    props.navigation.goBack();

    return true;
  };

  const onListingsUpdate = (listingsData) => {
    let max_latitude = -400,
      min_latitude = 400,
      max_longitude = -400,
      min_logitude = 400;

    for (let i = 0; i < listingsData.length; i++) {
      const listing = listingsData[i];
      if (max_latitude < listing.latitude) max_latitude = listing.latitude;
      if (min_latitude > listing.latitude) min_latitude = listing.latitude;
      if (max_longitude < listing.longitude) max_longitude = listing.longitude;
      if (min_logitude > listing.longitude) min_logitude = listing.longitude;
    }

    setData(listingsData);

    if (!shouldUseOwnLocation || !latitude) {
      setLongitude((max_longitude + min_logitude) / 2);
      setLatitude((max_latitude + min_latitude) / 2);
      setLatitudeDelta(
        Math.abs((max_latitude - (max_latitude + min_latitude) / 2) * 3),
      );
      setLongitudeDelta(
        Math.abs((max_longitude - (max_longitude + min_logitude) / 2) * 3),
      );
    }
  };

  const onPress = (item) => {
    props.navigation.navigate('SingleListingScreen', {
      item: item,
      customLeft: true,
      headerLeft: () => <View />,
      routeName: 'Map',
    });
  };

  const markerArr = data.map((listing, index) => (
    <Marker
      key={index}
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
  ));

  return (
    <MapView
      style={styles.mapView}
      showsUserLocation={true}
      region={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: latitudeDelta,
        longitudeDelta: longitudeDelta,
      }}>
      {markerArr}
    </MapView>
  );
}

export default MapScreen;
