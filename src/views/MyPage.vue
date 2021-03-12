<template>
  <v-container>
    <v-layout column>
      <h1 class="my-2">ユーザー情報</h1>
      <div class="my-3">
        <p class="display-1">{{ getStateUser.user.displayName }}</p>
        <v-btn color="error" outlined @click="deleteUser">アカウント削除</v-btn>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "MyPage",
  data() {
    return {
      user: this.$store.getters.getUser
    }
  },
  computed: {
    getStateUser() {
      return this.$store.getters.getUser
    }
  },
  methods: {
    deleteUser() {
      if(confirm('本当に削除しますか?')) {
        this.$store.dispatch("userDelete")
      }
    }
  }
}
</script>