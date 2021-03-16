import firebase from 'firebase'
// // import "firebase/auth";
// // import "firebase/firestore";

// const user = firebase.auth().currentUser
// // const uid = firebase.auth().currentUser.uid

export default {
  data() {
    return {
      user: firebase.auth().currentUser,
      // uid: firebase.auth().currentUser.uid,
      db: firebase.firestore(),
// //       // keep_db: firebase.firestore().collection('users').doc(this.uid).collection('keep'),
// //       // post_db: firebase.firestore().collection('users').doc(this.uid).collection('post'),
    }
  },
}