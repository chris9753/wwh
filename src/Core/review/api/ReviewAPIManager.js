import { firebase } from '../../api/firebase/config';

export class ReviewAPIManager {
  constructor(onReviewsFetchedCallback, id, tableName) {
    this.onReviewsFetchedCallback = onReviewsFetchedCallback;
    this.tableName = tableName;
    this.entityID = id;
    this.ref = firebase.firestore().collection(tableName);
  }

  subscribe() {
    this.unsubscribe = this.ref
      .where('entityID', '==', this.entityID)
      .onSnapshot(this.onCollectionUpdate, (error) => {
        console.log(error);
      });
  }

  addReview(rating, text, user) {
    this.ref
      .add({
        author: user,
        authorID: user.id,
        authorName: `${user.firstName} ${user.lastName}`,
        authorProfilePic: user.profilePictureURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        entityID: this.entityID,
        id: user.id,
        rating,
        text,
      })
      .catch((error) => console.log(error));
  }

  onCollectionUpdate = (querySnapshot) => {
    var reviews = [];
    querySnapshot.forEach((doc) => {
      const singleReview = doc.data();
      reviews.push({
        id: doc.id,
        singleReview,
      });
    });
    this.onReviewsFetchedCallback && this.onReviewsFetchedCallback(reviews);
  };

  unsubscribe = () => {
    this.unsubscribe();
  };
}
