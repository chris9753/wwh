import React, { useState } from 'react';
import { Modal, Text, TextInput, View } from 'react-native';
import TextButton from 'react-native-button';
import StarRating from 'react-native-star-rating';
import { connect } from 'react-redux';
import { useColorScheme } from 'react-native-appearance';
import { reviewAPI } from '../../Core/listing/api';
import Button from 'react-native-button';
import { IMLocalized } from '../../Core/localization/IMLocalization';
import DynamicAppStyles from '../../DynamicAppStyles';
import dynamicStyles from './styles';

function ReviewModal(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);

  const appIcon = DynamicAppStyles.appIcon;
  const modalHeaderStyle = DynamicAppStyles.modalHeaderStyle(colorScheme);

  const listing = props.listing;

  const [content, setContent] = useState('');
  const [starCount, setStarCount] = useState(5);

  const onPostReview = () => {
    if (!content) {
      alert(IMLocalized('Please enter a review before submitting.'));
      return;
    }

    const { user, onDone } = props;

    reviewAPI.postReview(user, listing, starCount, content, ({ success }) => {
      if (success) {
        onDone();
        return;
      }
      alert(error);
    });
  };

  onCancel = () => {
    props.onCancel();
  };

  return (
    <Modal animationType="slide" transparent={false} onRequestClose={onCancel}>
      <View style={styles.body}>
        <View style={modalHeaderStyle.bar}>
          <Text style={modalHeaderStyle.title}>
            {IMLocalized('Add Review')}
          </Text>
          <TextButton
            style={{ ...modalHeaderStyle.rightButton, paddingRight: 10 }}
            onPress={onCancel}>
            {IMLocalized('Cancel')}
          </TextButton>
        </View>
        <View style={styles.bodyContainer}>
          <StarRating
            containerStyle={styles.starRatingContainer}
            disabled={false}
            maxStars={5}
            starSize={25}
            starStyle={styles.starStyle}
            selectedStar={(rating) => setStarCount(rating)}
            emptyStar={appIcon.images.starNoFilled}
            halfStarColor={
              DynamicAppStyles.colorSet[colorScheme].mainThemeForegroundColor
            }
            fullStar={appIcon.images.starFilled}
            rating={starCount}
          />
          <TextInput
            multiline={true}
            style={styles.input}
            onChangeText={(text) => setContent(text)}
            value={content}
            placeholder={IMLocalized('Start typing')}
            placeholderTextColor={DynamicAppStyles.colorSet[colorScheme].grey}
            underlineColorAndroid="transparent"
          />
          <Button
            containerStyle={styles.btnContainer}
            style={styles.btnText}
            onPress={() => onPostReview()}>
            {IMLocalized('Add review')}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(ReviewModal);
