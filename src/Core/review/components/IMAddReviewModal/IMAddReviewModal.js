import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import Modal from 'react-native-modal-patch';
import Button from 'react-native-button';
import { Appearance } from 'react-native-appearance';
import dynamicStyles from './styles';
import { Icon } from 'react-native-elements';
import { IMLocalized } from '../../../localization/IMLocalization';

const COLOR_SCHEME = Appearance.getColorScheme();

export default function AddReviewModal({
  submitReview,
  appStyles,
  close,
  isVisible,
}) {
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState('');
  const styles = dynamicStyles(appStyles);

  const onTypeReview = (text) => {
    setReview(text);
  };

  const onSubmit = () => {
    submitReview(rating, review);
    close();
  };
  return (
    <Modal
      onSwipeComplete={close}
      swipeDirection="down"
      visible={isVisible}
      backdropColor={'grey'}>
      <View style={styles.container}>
        <View style={[styles.bar, styles.navBarContainer]}>
          <Text style={styles.headerTitle}>{IMLocalized('Add Review')}</Text>
          <Text
            style={[styles.rightButton, styles.selectorRightButton]}
            onPress={close}>
            {IMLocalized('Cancel')}
          </Text>
        </View>
        <View style={styles.starContainer}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Icon
              size={30}
              key={item}
              type="ionicon"
              style={styles.starStyle}
              onPress={() => setRating(item)}
              name={item <= rating ? 'ios-star-sharp' : 'ios-star-outline'}
              color={appStyles.colorSet[COLOR_SCHEME].mainThemeForegroundColor}
            />
          ))}
        </View>

        <TextInput
          placeholder={IMLocalized('Please write your review here')}
          placeholderTextColor={
            appStyles.colorSet[COLOR_SCHEME].mainSubtextColor
          }
          multiline
          onChangeText={onTypeReview}
          style={styles.input}
        />
        <Button
          containerStyle={styles.actionButtonContainer}
          style={styles.actionButtonText}
          onPress={onSubmit}>
          {IMLocalized('Add Review')}
        </Button>
      </View>
    </Modal>
  );
}
