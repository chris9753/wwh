import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { AppRegistry, StatusBar } from 'react-native';
import { Appearance, AppearanceProvider } from 'react-native-appearance';
import { setI18nConfig } from './Core/localization/IMLocalization';
import configureStore from './redux/store';
import { AppNavigator } from './navigators/AppNavigation';
import * as RNLocalize from 'react-native-localize';
import { enableScreens } from 'react-native-screens';
import { LogBox } from 'react-native';
import { NativeBaseProvider } from 'native-base';
const store = configureStore();
const useForceUpdate = () => useState()[1];

const App = props => {
  enableScreens()
  Appearance.set({ colorScheme: 'dark' })
  const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

  useEffect(() => {
    LogBox.ignoreAllLogs();
    setI18nConfig();

    RNLocalize.addEventListener('change', handleLocalizationChange);
    Appearance.addChangeListener(({ colorScheme }) => {
      setColorScheme(colorScheme);
    });
    return () => {
      RNLocalize.removeEventListener('change', handleLocalizationChange);
    };
  }, []);

  const handleLocalizationChange = () => {
    setI18nConfig();
    useForceUpdate();
  };

  return (
    <Provider store={store}>
      <NativeBaseProvider>

        <AppearanceProvider>
          <StatusBar />
          <AppNavigator screenProps={{ theme: colorScheme }} />
        </AppearanceProvider>
      </NativeBaseProvider>
    </Provider>
  );
};

App.propTypes = {};

App.defaultProps = {};

AppRegistry.registerComponent('App', () => App);

export default App;
