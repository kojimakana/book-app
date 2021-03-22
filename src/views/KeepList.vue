<template>
  <div id="bg">
    <v-container grid-list-md>
      <v-row>
      <h1 class="my-2">保存済み
      </h1>
      <p class="mt-5 ml-3">{{ getKeepBooks.length }}件</p>
      </v-row>
      <v-layout v-if="getKeepBooks" wrap>
        <v-flex 
          v-for="(keepbook, index) in getKeepBooks" 
          :key="index" xs12 sm6>
          <v-card
            class="mx-auto mt-3 pt-1"
            outlined
          >
            <v-list-item three-line>
            <div
                v-if="keepbook.volumeInfo.imageLinks"
              ><img :src="keepbook.volumeInfo.imageLinks.thumbnail" :alt="keepbook.volumeInfo.title" width="80" height="100"></div>
              <v-list-item-content>

                <v-list-item-title class="heading5 font-weight-bold ">
                  {{ keepbook.volumeInfo.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <span v-if="!keepbook.volumeInfo.authors">No authors to display</span>
                <span v-else>
                  By
                  <span v-for="(author, index) in keepbook.volumeInfo.authors" :key="index">
                    <em>
                      {{
                      index + 1 !== keepbook.volumeInfo.authors.length && index + 1 !== keepbook.volumeInfo.authors.length-1 ? author + ', ' : index + 1 == keepbook.volumeInfo.authors.length && index+1 !== 1 ? ' and ' + author : author
                      }}
                    </em>
                  </span>
                </span>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
              <v-card-actions>
                <v-btn
                      color="primary"
                      dark
                      @click.stop="openModal(keepbook)"
                      :disabled="keepbook.disabled"
                    >記録
                      <v-icon>mdi-pencil-plus</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn text @click.prevent="removeKeepList(keepbook)" >
                  <v-icon>mdi-bookmark</v-icon>
                </v-btn>

              </v-card-actions>
                  <v-expansion-panels v-if="keepbook.volumeInfo.description">
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    説明
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="description">
                    {{ keepbook.volumeInfo.description }}
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
          </v-card>
        </v-flex>
          <v-dialog
          v-if="keepItem"
          max-width="600"
          :retain-focus="false"
          @before-close="closeModal"
          v-model="dialog"
        >
          <CommitMemo
            :bookTitle="keepItem.title"
            @closeModal="closeModal"
            @postBook="postBook"
            >
          </CommitMemo>
        </v-dialog>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
import { db } from '@/main.js'
import CommitMemo from "@/components/CommitMemo"

export default {
  name: 'KeepList',
  data() {
    return {
      dialog: false,
      keepItem: null
    }
  },
  components: {
    CommitMemo
  },
  created() {
    const user = firebase.auth().currentUser
    if(user) {
      this.checkPosted();
      this.$store.dispatch('getKeepBooks');
    }
  },
  computed: {
    getKeepBooks() {
      return this.$store.state.keepBooks
    },
  },
  watch: {
    getKeepBooks: function() {
      this.checkPosted();
    }
  },
  methods: {
    openModal(keepbook) {
      this.dialog = true
      this.keepItem = keepbook
    },
    closeModal() {
      this.dialog = false
    },
    postBook(emitValue) {
      const uid = firebase.auth().currentUser.uid;
      db.collection('users').doc(uid).collection('post').add({
        bid: this.keepItem.bid,
        title: this.keepItem.title,
        date: emitValue.date,
        comment: emitValue.comment,
        volumeInfo: this.keepItem.volumeInfo
      })
      .then(() => {
        db.collection('users').doc(uid).collection('keep').where('bid', '==', this.keepItem.bid).get().then(snap => {
        snap.forEach(ele => {
          let delete_book = ele.data()
          let delete_bid = ele.id
          if(delete_book.bid === this.keepItem.bid) {
            db.collection('users').doc(uid).collection('keep').doc(delete_bid).delete()
            }
          })
        })
      })
      .then(() => {
          console.log(this.keepItem)
          this.dialog = false
          console.log('完了')
      })
      .catch(err => {
        console.log(err);
      })
    },
    removeKeepList(keepbook) {
      this.$store.dispatch('removeKeepList', keepbook)
    },

    deleteKeep(keepbook) {
      const uid = firebase.auth().currentUser.uid;
      db.collection('users').doc(uid).collection('keep').where('bid', '==', keepbook.bid).get().then(snap => {
        snap.forEach(ele => {
          let delete_book = ele.data()
          let delete_id = ele.id
          if(delete_book.bid === keepbook.bid) {
            db.collection('users').doc(uid).collection('keep').doc(delete_id).delete()
            .then(() => { 
              console.log('削除');
            })
            .catch(err => {
              console.log(err);
            })
          }
        })
      })
    },
    checkPosted() {
      const user = firebase.auth().currentUser
      if(user) {
        let array = this.$store.state.postBooks
        this.$store.state.keepBooks.forEach(keepbook => {
          function checkAlreadyPost(arr, id) {
            return arr.some(function(value) {
              return id === value.bid
            })
          }
          if(checkAlreadyPost(array, keepbook.bid)) {
            keepbook.disabled = true
            console.log('checkPosted', keepbook.disabled)
          } else {
            keepbook.disabled = false
          }
        })
      }
    }

  },
}
</script>

<style>
  .description {
    font-size: 70%  !important;
  }
</style>
