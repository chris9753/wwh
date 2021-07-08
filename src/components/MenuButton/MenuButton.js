import React from 'react';
import { Image, Text, TouchableHighlight, View } from 'react-native';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';

export default function MenuButton(props) {
  const colorScheme = useColorScheme()
  const styles = dynamicStyles(colorScheme)
  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={styles.btnClickContain}
      underlayColor="rgba(128, 128, 128, 0.1)">
      <View style={styles.btnContainer}>
        <Image source={props.source} style={styles.btnIcon} />
        <Text style={styles.btnText}>{props.title}</Text>
      </View>
    </TouchableHighlight>
  );
}
