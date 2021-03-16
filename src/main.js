import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VCalendar from 'v-calendar'
import firebase from 'firebase'

var firebaseConfig = {
  apiKey: "AIzaSyD-T6OWU4rwqPHtbhqdmUPbDW_bgH4zBKE",
  authDomain: "book-app-3161f.firebaseapp.com",
  projectId: "book-app-3161f",
  storageBucket: "book-app-3161f.appspot.com",
  messagingSenderId: "69916855156",
  appId: "1:69916855156:web:663d0a87805e258a44ba21",
  measurementId: "G-ZDQEJHLFZB"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();

Vue.config.productionTip = false

export const  db = firebase.firestore()
export const  user = firebase.auth().currentUser
// export const  uid = firebase.auth().currentUser.uid


Vue.use(VCalendar, {
  componentPrefix: 'vc', 
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
