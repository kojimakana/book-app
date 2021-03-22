<template>
  <v-app-bar app>
    <v-app-bar-nav-icon v-show="$store.state.user" @click.stop="toggleMenu" class="hidden-md-and-up"></v-app-bar-nav-icon>
    <router-link to="/">
      <v-toolbar-title to="/" class="teal--text darken-4 font-weight-bold">
        読書メモ
      </v-toolbar-title>
    </router-link>
    <v-spacer></v-spacer>
      <div v-if="$store.state.user">
        <v-btn v-for="(item, index) in items" :key="index" :to="item.link" text color="brown darken-3" class="font-weight-bold hidden-sm-and-down">{{ item.title }}</v-btn>
      </div>
      <v-menu v-if="$store.state.user">
        <template v-slot:activator="{ on, attrs }" >
          <v-btn text icon  v-bind="attrs" v-on="on" ><v-icon>mdi-account</v-icon></v-btn>
        </template>
        <v-list>
          <v-list-item><v-btn @click="logout" text>ログアウト</v-btn></v-list-item>
          <v-list-item><v-btn to="mypage" text>アカウント削除</v-btn>
            </v-list-item>
        </v-list>
      </v-menu>
  </v-app-bar>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Nav',
  data () {
    return {
      items: [
        { title: 'ホーム', link: { name: 'userhome' } },
        { title: '探す', link: { name: 'search' } },
        { title: '保存済み',  link: { name: 'keeplist' } },
        { title: '読んだ本', link: { name: 'readbooks' } },
      ]
    }
  },
  methods: {
    ...mapActions(['toggleMenu']),
    logout() {
      this.$store.dispatch("userSignOut")
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  }
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