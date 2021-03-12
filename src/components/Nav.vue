<template>
  <v-app-bar app>
    <v-app-bar-nav-icon v-show="$store.state.user" @click.stop="toggleMenu"></v-app-bar-nav-icon>
    <router-link to="/">
      <v-toolbar-title to="/" class="teal--text darken-4 font-weight-bold">
        読書メモ
      </v-toolbar-title>
    </router-link>
    <v-spacer></v-spacer>
      <!-- <div>
        <router-link to="/search">探す</router-link>
        <router-link to="/keeplist"><v-icon>mdi-bookmark</v-icon></router-link>
      </div> -->
      <v-btn text v-if="$store.state.user" @click="logout" data-cy="logout" right>ログアウト</v-btn>
      <v-btn to="/mypage" text icon v-if="$store.state.user"><v-icon>mdi-account</v-icon></v-btn>
  </v-app-bar>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Nav',
  data () {
    return {
    }
  },
  methods: {
    ...mapActions(['toggleMenu']),
    logout() {
      this.$store.dispatch("userSignOut")
    }
  },
}
</script>

<style scoped>
a {
  color: #333;
  text-decoration: none;
}

.router-link-exact-active {
  color: #333;
  text-decoration: none;
}
.v-toolbar__title {
  color: #333;
  text-decoration: none;
}
</style>