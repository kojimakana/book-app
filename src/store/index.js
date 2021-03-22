import Vue from 'vue'
import Vuex from 'vuex'
import router from "@/router/index.js"
import firebase from 'firebase'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'
import { db } from '@/main.js'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    isSignIn: false,
    drawer: false,
    books: [],
    query: '',
    keepBooks: [],
    postBooks: [],
    recentBooks: []
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    setSignIn(state, payload) {
      state.isSignIn = payload
    },
    deleteLoginUser (state) {
      state.user = null
    },
    toggleMenu (state) {
      state.drawer = !state.drawer
    },
    getBooks(state, books) {
      state.books = books
    },
    setQuery(state, payload) {
      state.query = payload.query
    },
    setKeepBooks(state, payload) {
      state.keepBooks = payload
    },
    setAdd(state, book) {
      const uid = firebase.auth().currentUser.uid;
      const addBook = {
        bid: book.id,
        title: book.volumeInfo.title,
        volumeInfo: book.volumeInfo
      }
        db.collection('users').doc(uid).collection('keep').add(
        addBook
      )
      .then(() => {
        state.keepBooks.push(addBook)
        console.log('お気に入り登録')
      })
      .catch(err => {
        console.log(err);
      })
    },
    setRemove(state, book) {
      const uid = firebase.auth().currentUser.uid;
      db.collection('users').doc(uid).collection('keep').where('bid', '==', book.id).get().then(snap => {
        snap.forEach(ele => {
          let delete_book = ele.data()
          let delete_bid = ele.id
          if(delete_book.bid === book.id) {
            db.collection('users').doc(uid).collection('keep').doc(delete_bid).delete()
            .then(() => {
              console.log(state.keepBooks);
              console.log('お気に入り削除');
            })
            .catch(err => {
              console.log(err);
            })
          }
        })
      })
    },
    setKeepRemove(state, keepbook) {
      const uid = firebase.auth().currentUser.uid;
      db.collection('users').doc(uid).collection('keep').where('bid', '==', keepbook.bid).get()
      .then(snap => {
        snap.forEach(ele => {
          let delete_book = ele.data()
          let delete_bid = ele.id
          if(delete_book.bid === keepbook.bid) {
            db.collection('users').doc(uid).collection('keep').doc(delete_bid).delete()
            .then(() => { 
              console.log('お気に入り削除');
            })
            .catch(err => {
              console.log(err);
            })
          }
        })
      })
    },
    setPostBooks(state, payload) {
      state.postBooks = payload
    },
    setRecentBooks(state, payload) {
      state.recentBooks = payload
    },
    initialize(state) {
      state.user = null,
      state.isSignIn = false,
      state.books = [],
      state.query = '',
      state.keepBooks = [],
      state.postBooks = [],
      state.recentBooks = []
    }
  },
  actions: {
    setLoginUser ({ commit }, user) {
      commit('setUser', user)
    },
    deleteLoginUser ({ commit }) {
      commit('deleteLoginUser')
    },
    userLogin ({ commit }, { email, password}) {
      firebase
      .auth().signInWithEmailAndPassword(email, password)
      .then(user => {
        commit('initialize')
        commit('setUser', user)
        commit('setSignIn', true)
        router.push('/userhome')
      })
      .catch(() => {
        commit('setUser', null)
        commit('setSignIn', false)
        alert('入力内容を再度確認してください。')
      })
    },
    userSignOut ({ commit }) {
      firebase
      .auth()
      .signOut()
      .then(() => {
        commit('setUser', null)
        commit('setSignIn', false)
        router.push('/')
      })
      .catch(err => {
        console.log(err)
        commit('setUser', null)
        commit('setSignIn', false)
        router.push('/')
      })
    },
    toggleMenu ({ commit }) {
      commit('toggleMenu')
    },
    userJoin ({ commit }, {  email, password, userName }) {
      firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        user.user.updateProfile({
          displayName: userName
        })
        commit('initialize')
        commit('setUser', user)
        commit('setSignIn', true)
        router.push('/userhome')

        const uid = user.user.uid;
        db.collection("users").doc(uid).collection('userInfo')
        .add({
          userName: userName,
          email: email,
          password: password
        })

      })
      .catch(err => {
        console.log(err);
        commit('setUser', null)
        commit('setSignIn', false)
        alert('入力内容を再度確認してください。')
      })
    },
    userDelete({ commit }) {
      firebase
      .auth()
      .currentUser.delete()
      .then(() => {
        commit('setUser', null)
        commit('isSignIn', false)
        router.push('/')
        commit('clearData')
      })
      .catch(() => {
        commit('setUser', null)
        commit('isSignIn', false)
        router.push('/')
      })
    },
    doUpdate({ commit }, query) {
      commit('setQuery', { query })
    },
    searchBook({ commit, state }) {
      if(!state.query) {
        return
      }
      const params = {
        q: state.query,
        Country: "JP",
        maxResults: 40,
      }
      axios.get('https://www.googleapis.com/books/v1/volumes', { params: params })
      .then(response => {
        let books = response.data.items
        commit("getBooks", books)
      })
      .catch(error => {
        console.log(error);
      })
    },
    addKeep({ commit }, book) {
      commit('setAdd', book)
    },
    removeKeep({ commit }, book) {
      commit('setRemove', book)
    },
    removeKeepList({ commit }, keepbook) {
      commit('setKeepRemove', keepbook)
    },
    getKeepBooks({ commit }) {
      var uid = firebase.auth().currentUser.uid
      db.collection('users').doc(uid).collection('keep').onSnapshot(snap => {
        let get_keeps = []
        snap.forEach(ele => {
          let keep = ele.data();
          get_keeps.push(keep)
        })
          commit('setKeepBooks', get_keeps)
          console.log('キープを取得', get_keeps)
      })
    },
    getPostBooks({ commit }) {
      var uid = firebase.auth().currentUser.uid
      db.collection('users').doc(uid).collection('post').onSnapshot(snap => {
        let get_posts = []
        snap.forEach(ele => {
          let post = ele.data();
          get_posts.push(post)
        })
          commit('setPostBooks', get_posts)
          console.log('ポストを取得', get_posts)
      })
    },
    getRecentBooks({ commit }) {
      var uid = firebase.auth().currentUser.uid
      db.collection('users').doc(uid).collection('post').orderBy('date', 'desc').limit(4).get()
      .then(snap => {
        let recent_posts = []
        snap.forEach(doc => {
          let recent_item = doc.data();
          recent_posts.push(recent_item)
        })
        commit('setRecentBooks', recent_posts)
        console.log('setRecentBooks', recent_posts)
      })
      .catch(error => {
        console.log(error);
      })
    }
  },
  getters: {
    isAuthenticated(state) {
      return state.user !== null && state.user !== undefined
    },
  },
  plugins: [createPersistedState({
    key: 'book-app',
    storage: window.sessionStorage
  })]

})
