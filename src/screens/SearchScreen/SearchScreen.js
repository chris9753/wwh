import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  FlatList,
  Text,
  BackHandler,
  Image,
  Keyboard,
  View,
  Platform,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import { useColorScheme } from 'react-native-appearance';
import { listingsAPI } from '../../Core/listing/api';
import { timeFormat } from '../../Core';
import { SearchBar } from '../../Core/ui';
import dynamicStyles from './styles';
import DynamicAppStyles from '../../DynamicAppStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IMLocalized } from '../../Core/localization/IMLocalization';

function SearchScreen(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  const currentTheme = DynamicAppStyles.navThemeConstants[colorScheme];
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const listStyle = DynamicAppStyles.listStyle(colorScheme);
  const searchRef = useRef(null);

  const insets = useSafeAreaInsets();

  useLayoutEffect(() => {
    props.navigation.setOptions({
      ...Platform.select({
        ios: {
          header: () => (
            <View
              style={{
                paddingTop: insets.top,
              }}>
              <SearchBar
                appStyles={DynamicAppStyles}
                onChangeText={onSearch}
                onSearchBarCancel={onCancel}
                onSearch={onSearch}
                searchRef={searchRef}
                placeholder={IMLocalized("Search listings...")}
              />
            </View>
          ),
        },
        android: {
          headerTitle: () => (
            <SearchBar
              appStyles={DynamicAppStyles}
              onChangeText={onSearch}
              onSearchBarCancel={onCancel}
              onSearch={onSearch}
              searchRef={searchRef}
              placeholder={IMLocalized("Search listings...")}
            />
          ),
        },
      }),
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
    });
  }, [originalData]);

  const onCancel = () => {
    Keyboard.dismiss();
    searchRef.current.clearText();
  };

  const unsubscribe = useRef(null);
  const searchedText = useRef(null);
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
    unsubscribe.current = listingsAPI.subscribeListings(
      {},
      null,
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
      unsubscribe?.current && unsubscribe?.current();
      didFocusSubscription.current && didFocusSubscription.current();
      willBlurSubscription.current && willBlurSubscription.current();
    };
  }, []);

  const onSearch = (text) => {
    searchedText.current = text;
    filterByCurrentKeyword(originalData);
  };

  const filterByCurrentKeyword = (originalData) => {
    const data = [];
    if (!originalData) {
      return;
    }
    var text =
      searchedText.current !== null
        ? searchedText.current.toLowerCase().trim()
        : '';
    originalData.forEach((listing) => {
      if (listing?.title) {
        var index = listing.title.toLowerCase().search(text);
        if (index !== -1) {
          data.push(listing);
        }
      }
    });
    setData(data);
  };

  const onListingsUpdate = (listingsData) => {
    setOriginalData(listingsData);
    filterByCurrentKeyword(listingsData);
  };

  const onBackButtonPressAndroid = () => {
    BackHandler.exitApp();
    return true;
  };

  const onPress = (item) => {
    props.navigation.navigate('SearchDetail', {
      item: item,
      customLeft: true,
      headerLeft: () => <View />,
      routeName: 'Search',
    });
  };

  const renderItem = ({ item }) => (
    <ListItem
      key={item.id}
      title={item.title}
      titleStyle={listStyle.title}
      rightSubtitle={item.price}
      rightSubtitleStyle={listStyle.price}
      subtitle={
        <View style={listStyle.subtitleView}>
          <View style={listStyle.leftSubtitle}>
            <Text style={listStyle.time}>{timeFormat(item.createdAt)}</Text>
            <Text style={listStyle.place}>{item.place}</Text>
          </View>
        </View>
      }
      onPress={() => onPress(item)}
      leftElement={
        <Image style={listStyle.avatarStyle} source={{ uri: item.photo }} />
      }
      containerStyle={listStyle.container}
      hideChevron={true}
    />
  );

  return (
    <FlatList
      data={data}
      style={styles.container}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.id}`}
      initialNumToRender={5}
      refreshing={refreshing}
      keyboardDismissMode="on-drag"
    />
  );
}

export default SearchScreen;
