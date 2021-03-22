<template>
  <div id="bg">
    <v-container grid-list-md>
      <v-row>
        <h1 class="my-2">読んだ本 一覧</h1>
        <p class="mt-5 ml-3">{{ getPostBooks.length }}件</p>
      </v-row>
    <v-layout v-if="getPostBooks" wrap>
      <v-flex 
        v-for="(postbook, index) in getPostBooks" 
        :key="index" xs12 sm6>
        <v-card
          class="mx-auto mt-3 pt-1"
          outlined
        >
          <v-list-item three-line>
          <div
              v-if="postbook.volumeInfo"
            ><img :src="postbook.volumeInfo.imageLinks.thumbnail" :alt="postbook.volumeInfo.title" width="50" height="70"></div>
            <v-list-item-content>
              <v-list-item-title class="heading5 font-weight-bold">
                {{ postbook.title }}
              </v-list-item-title>
              <p>{{ postbook.date }}</p>
              <p class="comment pa-3 indigo lighten-5 ma-1">{{ postbook.comment }}</p>
            </v-list-item-content>
          </v-list-item>
            <v-card-actions>
              <v-btn
                    color="success"
                    @click.prevent="editPost(postbook)"
                  > 編集
                    <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn text
              @click.prevent="deletePost(postbook)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-card-actions>
        </v-card>
      </v-flex>
        <v-dialog
        v-if="postItem"
        max-width="600"
        :retain-focus="false"
        @before-close="closeModal"
        v-model="dialog"
      >
        <EditMemo
          :postTitle="postItem.volumeInfo.title"
          :postDate="postItem.date"
          :postComment="postItem.comment"
          @updatePost="updatePost"
          @closeModal="closeModal"
        >
        </EditMemo>
      </v-dialog>
    </v-layout>
  </v-container>
  </div>
</template>

<script>
import firebase from "firebase";
import moment from 'moment'
import { db } from '@/main.js'
import EditMemo from "@/components/EditMemo"

export default {
  name: 'ReadBooks',
  data() {
    return {
      dialog: false,
      postItem: null,
    }
  },
  components: {
    EditMemo
  },
  created() {
    const user = firebase.auth().currentUser
    if(user) {
      this.$store.dispatch('getPostBooks');
      console.log(this.getPostBooks);
    }
  },
  computed: {
    getPostBooks() {
      return this.$store.state.postBooks
    },
  },
  methods: {
    editPost(postbook) {
      this.dialog = true
      this.postItem = postbook
    },
    closeModal() {
      this.dialog = false
    },
    updatePost(postValue) {
      const uid = firebase.auth().currentUser.uid;
      db.collection('users').doc(uid).collection('post').where('bid', '==', this.postItem.bid).get()
      .then(doc => {
          doc.forEach(ele => {
            let element = ele.data()
            let id = ele.id
            if(element.bid === this.postItem.bid) {
              db.collection('users').doc(uid).collection('post').doc(id).update({
                date: postValue.date,
                comment: postValue.comment
              })
            }
          })
        })
      .then(() => {
        this.dialog = false;
        console.log('更新')
      })
      .catch(err => {
        console.log(err)
      })
    },
    deletePost(postbook) {
      const uid = firebase.auth().currentUser.uid;
      db.collection('users').doc(uid).collection('post').where('bid', '==', postbook.bid).get().then(snap => {
        snap.forEach(ele => {
          let delete_post = ele.data()
          let id = ele.id
          if(delete_post.bid === postbook.bid) {
            db.collection('users').doc(uid).collection('post').doc(id).delete()
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
  },
  filters: {
    customFormat(date) {
      return moment(date).format('YYYY-MM-DD')
    }
  }
}
</script>

<style scoped>
  .comment {
    font-size: 80%;
    border-radius: 8px;
  }
</style>