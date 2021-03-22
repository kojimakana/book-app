<template>
  <div id="bg">
    <v-container grid-list-md>
      <div class="d-flex flex-row align-baseline">
        <v-text-field
          placeholder="キーワードを入力"
          v-model="query"
          filled
          rounded
          dense
          clear-icon="mdi-close-circle"
          clearable
        >
        </v-text-field>
        <v-btn @click="search" color="teal" class="ml-2" small outlined>検索<v-icon>mdi-magnify</v-icon></v-btn>
      </div>
    <v-layout wrap>
      <v-flex v-for="(book, index) in displayBooks"
        :key="index"
        xs12 sm6>
          <v-card
          class="mx-auto mt-3 pt-1"
          outlined
          >
              <v-list-item three-line>
              <div
                  v-if="book.volumeInfo.imageLinks"
                ><img :src="book.volumeInfo.imageLinks.thumbnail" :alt="book.volumeInfo.title" width="80" height="100"></div>
                <v-list-item-content>

                  <v-list-item-title class="heading5 font-weight-bold">
                    {{ book.volumeInfo.title }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <span v-if="!book.volumeInfo.authors">No authors to display</span>
                  <span v-else>
                    By
                    <span v-for="(author, index) in book.volumeInfo.authors" :key="index" class="font-italic">
                      <em>
                        {{
                        index + 1 !== book.volumeInfo.authors.length && index + 1 !== book.volumeInfo.authors.length-1 ? author + ', ' : index + 1 == book.volumeInfo.authors.length && index+1 !== 1 ? ' and ' + author : author
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
                    @click.stop="openModal(book)"
                    :disabled="book.disabled"
                  >記録
                    <v-icon>mdi-pencil-plus</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn text v-if="checkKeeped(book.id)" @click.prevent="removeKeep(book)">
                  <v-icon>mdi-bookmark</v-icon>
                </v-btn>
                <v-btn text v-else @click.prevent="addKeep(book)"
                right
                >
                  <v-icon>mdi-bookmark-outline</v-icon>
                </v-btn>
              </v-card-actions>
                <v-expansion-panels v-if="book.volumeInfo.description">
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    説明
                  </v-expansion-panel-header>
                  <v-expansion-panel-content class="description">
                    {{ book.volumeInfo.description }}
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
          </v-card>
      </v-flex>
        <v-dialog
          v-if="item"
          max-width="600"
          :retain-focus="false"
          @before-close="closeModal"
          v-model="dialog"
        >
        <CommitMemo 
          :bookTitle="item.volumeInfo.title"
          @postBook="postBook"
          @closeModal="closeModal">
          </CommitMemo>
      </v-dialog>
      <div class="text-center mx-auto my-5">
        <v-pagination
          v-model="page"
          :length="length"
          @input="pageChange"
        ></v-pagination>
      </div>
    </v-layout>
    </v-container>
  </div>
</template>

<script>
import _ from "lodash"
import firebase from 'firebase'
import { db } from '@/main.js'
import CommitMemo from "@/components/CommitMemo"

export default {
  name: 'Search',
  data() {
    return {
      dialog: false,
      item: null,
      page: 1,
      length: 0,
      displayBooks: [],
      pageSize: 10
    }
  },
  components: {
    CommitMemo
  },
  computed: {
    books() {
      return this.$store.state.books
    },
    getPostBooks() {
      return this.$store.state.postBooks
    },
    query: {
      get() { return this.$store.state.query },
      set(value) {
        this.$store.dispatch('doUpdate', value)
      }
    },
  },
  mounted() {
    this.createPagination();
  },
  watch: {
    query: function() {
      this.debouncedGetAnswer();
    },
    books: function() {
      this.checkPosted();
    },
  },
  created() {
    this.debouncedGetAnswer = _.debounce(this.search, 1000);
    this.checkPosted();
  },
  methods: {
    openModal(book) {
      this.dialog = true
      this.item = book
    },
    closeModal() {
      this.dialog = false
    },
    search() {
      this.$store.dispatch("searchBook");
      this.createPagination();
      this.page = 1
    },
    pageChange(pageNumber) {
      this.displayBooks = this.books.slice(this.pageSize*(pageNumber -1), this.pageSize*(pageNumber));
      window.scrollTo({top: 0, behavior: "instant"});
    },
    addKeep(book) {
      this.$store.dispatch('addKeep', book)
    },
    removeKeep(book) {
      this.$store.dispatch('removeKeep', book)
    },
    postBook(emitValue) {
      console.log(this.item);
      const uid = firebase.auth().currentUser.uid;
      db.collection('users').doc(uid).collection('post').add({
        bid: this.item.id,
        title: this.item.volumeInfo.title,
        date: emitValue.date,
        comment: emitValue.comment,
        volumeInfo: this.item.volumeInfo
      })
      .then(() => {
          this.item.disabled = true;
          this.dialog = false;
          console.log('完了')
      })
      .catch(err => {
        console.log(err);
      })
    },
    checkKeeped(bookId) {
      let keeps = this.$store.state.keepBooks.map(keepbook => keepbook.bid)
      return keeps.includes(bookId);
    },
    checkPosted() {
      const user = firebase.auth().currentUser
      if(user) {
        let array = this.$store.state.postBooks
        this.$store.state.books.forEach(book => {
          function checkAlreadyPost(arr, id) {
            return arr.some(function(value) {
              return id === value.bid
            })
          }
          if(checkAlreadyPost(array, book.id)) {
            book.disabled = true
            console.log('checkPosted', book.disabled)
          } else {
            book.disabled = false
          }
        })
      }
    },
    createPagination() {
      this.displayBooks = this.books.slice(this.pageSize*(this.page -1), this.pageSize*(this.page));
      this.length = Math.ceil(this.books.length/this.pageSize);
    }
  },
}
</script>

<style>
  .description {
    font-size: 70%  !important;
  }
</style>