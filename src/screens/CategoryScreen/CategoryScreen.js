import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useColorScheme } from 'react-native-appearance';
import { listingsAPI } from '../../Core/listing/api';
import dynamicStyles from './styles';
import DynamicAppStyles from '../../DynamicAppStyles';

function CategoryScreen(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);
  const { navigation } = props;
  let currentTheme = DynamicAppStyles.navThemeConstants[colorScheme];
  const [data, setData] = useState([]);

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

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Categories',
      headerStyle: {
        backgroundColor: currentTheme.backgroundColor,
        borderBottomColor: currentTheme.hairlineColor,
      },
    });
  }, []);

  useEffect(() => {
    unsubscribe.current = listingsAPI.subscribeListingCategories(
      onCategoriesUpdate,
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

  const onBackButtonPressAndroid = () => {
    BackHandler.exitApp();
    return true;
  };

  const onCategoriesUpdate = (categoriesData) => {
    setData(categoriesData);
  };

  const onPress = (item) => {
    props.navigation.navigate('ListingsList', { item: item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={styles.container}>
        <FastImage style={styles.photo} source={{ uri: item.photo }} />
        <View style={styles.overlay} />
        <Text numberOfLines={3} style={styles.title}>
          {item.name || item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      style={styles.flatContainer}
      vertical
      showsVerticalScrollIndicator={false}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => `${item.id}`}
    />
  );
}

export default CategoryScreen;
