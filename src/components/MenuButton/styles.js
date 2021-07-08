import { StyleSheet } from 'react-native';
import DynamicAppStyles from '../../DynamicAppStyles';

const styles = theme => StyleSheet.create({
  btnClickContain: {
    flexDirection: 'row',
    padding: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  btnIcon: {
    height: 25,
    width: 25,
    tintColor: DynamicAppStyles.colorSet[theme].text,
  },
  btnText: {
    fontFamily: DynamicAppStyles.fontFamily.regularFont,
    color: DynamicAppStyles.colorSet[theme].text,
    fontSize: 16,
    marginLeft: 10,
    marginTop: 2,
  },
});

export default styles;
