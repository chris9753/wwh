import React from 'react';
import { TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';
import { useColorScheme } from 'react-native-appearance';

export default function HeaderButton(props) {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      style={props.customStyle}
      onPress={props.onPress}
      disabled={props.disabled}>
      {props.loading ? (
        <ActivityIndicator
          style={{ padding: 6 }}
          size={5}
          color={
            DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor
          }
        />
      ) : (
        <Image
          style={[DynamicAppStyles.iconStyle, props.iconStyle]}
          source={props.icon}
        />
      )}
    </TouchableOpacity>
  );
}
