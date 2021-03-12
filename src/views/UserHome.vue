<template>
  <div id="bg">
    <v-layout wrap class="pa-5 mx-auto">
      <v-flex xs12 md4>
        <vc-calendar :attributes="attributes" 
        ></vc-calendar>
      </v-flex>
      <v-flex xs12 md7>
        <div>
          <h2 class="my-2">最近の記録 <v-btn to="/readbooks" text color="primary">
              一覧を表示
            </v-btn></h2>
          <p v-if="getRecentBooks.length < 1">現在、記録はありません。</p>
          <v-card v-for="(newpost, index) in getRecentBooks" :key="index" 
            class="mx-auto mt-3 pt-1"
            outlined
          >
            <v-list-item three-line>
            <div
                v-if="newpost.volumeInfo.imageLinks"
              ><img :src="newpost.volumeInfo.imageLinks.thumbnail" :alt="newpost.volumeInfo.title" width="50" height="70"></div>
              <v-list-item-content>
                <v-list-item-title class="heading5 font-weight-bold">
                  {{ newpost.volumeInfo.title }}
                </v-list-item-title>
                <p>{{ newpost.date }}</p>
                <p class="comment pa-3 indigo lighten-5 ma-1">{{ newpost.comment }}</p>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </div>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import firebase from 'firebase'
// import { user } from '@/main.js'

export default {
  name: 'UserHome',
  data() {
    return {
      dialog: false,
      date: new Date(),
      comment: '',
      postItem: '',
    }
  },
  created() {
    const user = firebase.auth().currentUser
    if(user) {
      this.$store.dispatch('getRecentBooks');
    }
  },
  computed: {
    getStateUser() {
      return this.$store.getters.getUser
    },
    postBooks() {
      return this.$store.state.postBooks
    },
    attributes() {
      return [
        ...this.postBooks.map(post => ({
          dates: post.date,
          title: post.title,
          highlight: {
            color: 'green',
            fillMode: 'light'
          },
          popover: {
            label: post.title
          },
        }))
      ]
    },
    getRecentBooks() {
      return this.$store.state.recentBooks
    },
  },
}
</script>

<style>
  .comment {
    font-size: 80%;
    border-radius: 8px;
  }

  #bg {
    background-color: #F1F8E9;
    height: 100%;
  }
</style>