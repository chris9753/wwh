import { firebase } from '../../../api/firebase/config';
import ServerConfiguration from '../../../../ServerConfiguration';

const filterRef = firebase
  .firestore()
  .collection(ServerConfiguration.database.collection.FILTERS);

export const subscribeFilters = (categoryID, callback) => {
  return filterRef.onSnapshot((querySnapshot) => {
    var updatedData = [];
    querySnapshot.forEach(doc => {
      const updatedFilter = doc.data();
      const isFilterCategory = getIsFilterCategory(updatedFilter, categoryID);
      if (isFilterCategory) {
        updatedData.push({ ...updatedFilter, id: doc.id });
      }
    })
    callback(updatedData);
  });
};

const getIsFilterCategory = (filter, categoryID) => {
  if (filter.categories) {
    return filter.categories.includes(categoryID);
  } else {
    return true;
  }
};
