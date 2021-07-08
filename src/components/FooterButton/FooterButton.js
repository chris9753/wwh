import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import styles from './styles';

export default function FooterButton(props) {
  const {
    title,
    onPress,
    disabled,
    footerTitleStyle,
    footerContainerStyle,
    iconSource,
    iconStyle,
  } = props;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[styles.footerContainer, footerContainerStyle]}>
      {iconSource && <Image style={iconStyle} source={iconSource} />}
      <Text style={[styles.footerTitle, footerTitleStyle]}> {title}</Text>
    </TouchableOpacity>
  );
}
