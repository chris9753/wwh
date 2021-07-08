import React from 'react';
import { BannerAd as AdMobBanner, TestIds } from '@react-native-firebase/admob';
import { View } from 'react-native';
import styles from './styles';
export default function IMAdMobBanner({
  appConfig,
  onAdLoaded,
  onAdFailedToLoad,
}) {
  const adUnitId = __DEV__ ? TestIds.BANNER : appConfig.adMobConfig.adUnitID;
  return (
    <View style={styles.adContainer}>
      <AdMobBanner
        size={appConfig.adMobConfig.adBannerSize}
        unitId={adUnitId}
        onAdFailedToLoad={onAdFailedToLoad}
        onAdLoaded={onAdLoaded}
      />
    </View>
  );
}
