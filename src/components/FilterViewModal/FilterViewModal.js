import React, { useState, useRef, useEffect } from 'react';
import { Modal, ScrollView, Text, View } from 'react-native';
import { filterAPI } from '../../Core/listing/api';
import ModalSelector from 'react-native-modal-selector';
import { useColorScheme } from 'react-native-appearance';
import DynamicAppStyles from '../../DynamicAppStyles';
import TextButton from 'react-native-button';
import dynamicStyles from './styles';

function FilterViewModal(props) {
  const colorScheme = useColorScheme();
  const styles = dynamicStyles(colorScheme);

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(props.value);

  const unsubscribe = useRef(null);

  const onCollectionUpdate = (updatedData) => {
    updatedData.forEach((updatedFilter) => {
      if (!filter[updatedFilter.name]) {
        setFilter({
          ...filter,
          [updatedFilter.name]: updatedFilter.options[0],
        });
      }
    });
    console.log(updatedData);

    setData(updatedData);
  };

  useEffect(() => {
    unsubscribe.current = filterAPI.subscribeFilters(
      props.category,
      onCollectionUpdate,
    );
    return () => {
      unsubscribe?.current && unsubscribe?.current();
    };
  }, []);

  const onDone = () => {
    props.onDone(filter);
  };

  const onCancel = () => {
    props.onCancel();
  };

  const renderItem = (item) => {
    let filter_key = item.name;

    var newData = item.options.map((option, index) => ({
      key: option,
      label: option,
    }));
    newData.unshift({ key: 'section', label: item.name, section: true });

    let initValue = item.options[0];
    if (filter[filter_key]) {
      initValue = filter[filter_key];
    }

    const modalSelectorStyle = DynamicAppStyles.modalSelectorStyle(colorScheme);

    return (
      <ModalSelector
        touchableActiveOpacity={0.9}
        key={item.id}
        data={newData}
        sectionTextStyle={modalSelectorStyle.sectionTextStyle}
        optionTextStyle={modalSelectorStyle.optionTextStyle}
        optionContainerStyle={modalSelectorStyle.optionContainerStyle}
        cancelContainerStyle={modalSelectorStyle.cancelContainerStyle}
        cancelTextStyle={modalSelectorStyle.cancelTextStyle}
        selectedItemTextStyle={modalSelectorStyle.selectedItemTextStyle}
        backdropPressToClose={true}
        cancelText={'Cancel'}
        initValue={initValue}
        onChange={(option) => {
          setFilter({ ...filter, [filter_key]: option.key });
        }}>
        <View style={styles.container}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.value}>{initValue}</Text>
        </View>
      </ModalSelector>
    );
  };

  const selectorArray = data.map((item) => {
    return renderItem(item);
  });

  return (
    <Modal animationType="slide" transparent={false} onRequestClose={onCancel}>
      <ScrollView style={styles.body}>
        <View style={DynamicAppStyles.modalHeaderStyle(colorScheme).bar}>
          <Text style={DynamicAppStyles.modalHeaderStyle(colorScheme).title}>
            Filters
          </Text>
          <TextButton
            style={DynamicAppStyles.modalHeaderStyle(colorScheme).rightButton}
            onPress={onDone}>
            Done
          </TextButton>
        </View>
        {selectorArray}
      </ScrollView>
    </Modal>
  );
}

export default FilterViewModal;
