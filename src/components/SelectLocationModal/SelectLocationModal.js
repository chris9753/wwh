import React, { useState } from 'react';
import { Modal, Text, View, StyleSheet } from 'react-native';
import TextButton from 'react-native-button';
import MapView, { Marker } from 'react-native-maps';
import { Configuration } from '../../Configuration';
import styles from './styles';
import { useColorScheme } from 'react-native-appearance';
import DynamicAppStyles from '../../DynamicAppStyles';

function SelectLocationModal(props) {
  const colorScheme = useColorScheme();

  const modalHeaderStyle = DynamicAppStyles.modalHeaderStyle(colorScheme);

  const location = props.location;

  const [latitude, setLatitude] = useState(location.latitude);
  const [longitude, setLongitude] = useState(location.longitude);
  const [latitudeDelta, setLatitudeDelta] = useState(
    Configuration.map.delta.latitude,
  );
  const [longitudeDelta, setLongitudeDelta] = useState(
    Configuration.map.delta.longitude,
  );

  onDone = () => {
    props.onDone({
      latitude: latitude,
      longitude: longitude,
    });
  };

  onCancel = () => {
    props.onCancel();
  };

  onPress = (event) => {
    setLatitude(event.nativeEvent.coordinate.latitude);
    setLongitude(event.nativeEvent.coordinate.longitude);
  };

  onRegionChange = (region) => {
    setLatitude(region.latitude);
    setLongitude(region.longitude);
    setLatitudeDelta(region.latitudeDelta);
    setLongitudeDelta(region.longitudeDelta);
  };

  return (
    <Modal animationType="slide" transparent={false} onRequestClose={onCancel}>
      <View style={styles.body}>
        <MapView
          ref={(map) => (map = map)}
          onPress={onPress}
          style={styles.mapView}
          onRegionChangeComplete={onRegionChange}
          region={{
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: latitudeDelta,
            longitudeDelta: longitudeDelta,
          }}>
          <Marker
            draggable
            coordinate={{
              latitude: latitude,
              longitude: longitude,
            }}
            onDragEnd={onPress}
          />
        </MapView>
        <View style={[modalHeaderStyle.bar, styles.topbar]}>
          <TextButton
            style={[modalHeaderStyle.rightButton, styles.rightButton]}
            onPress={onDone}>
            Done
          </TextButton>
        </View>
      </View>
    </Modal>
  );
}

export default SelectLocationModal;
