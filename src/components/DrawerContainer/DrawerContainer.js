import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import MenuButton from '../MenuButton/MenuButton';
import DynamicAppStyles from '../../DynamicAppStyles';
import dynamicStyles from './styles';
import { useColorScheme } from 'react-native-appearance';


function DrawerContainer(props) {
  const { navigation } = props;
  const colorScheme = useColorScheme()
  const styles = dynamicStyles(colorScheme)
  return (
    <View style={styles.content}>
      <View style={styles.container}>
        <MenuButton
          title="LOG OUT"
          source={DynamicAppStyles.appIcon.images.logout}
          onPress={() => {
            navigation.dispatch({ type: 'Logout' });
          }}
        />
      </View>
    </View>
  );
}

const mapStateToProps = (state) => ({
  isAdmin: state.auth.user.isAdmin,
});

export default connect(mapStateToProps)(DrawerContainer);
