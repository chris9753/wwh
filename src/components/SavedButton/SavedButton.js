import React from 'react';
import { StyleSheet, TouchableOpacity, Image, Text, View } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import DynamicAppStyles from '../../DynamicAppStyles';

export default function SavedButton(props) {
  const colorScheme = useColorScheme();

  const appIcon = DynamicAppStyles.appIcon;

  const { style, isSaved } = props;

  return (
    <TouchableOpacity style={style} onPress={props.onPress}>
      <Image
        style={{
          ...appIcon.style,
          tintColor: isSaved
            ? DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor
            : DynamicAppStyles.colorSet[colorScheme].mainThemeBackgroundColor,
        }}
        source={appIcon.images.heartFilled}
      />
    </TouchableOpacity>
  );
}
