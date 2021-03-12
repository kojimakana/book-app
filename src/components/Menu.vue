<template>
  <v-navigation-drawer v-model="$store.state.drawer" absolute temporary app class="nav">
    <v-list nav>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title teal--text darken-4 font-weight-bold">
            読書メモ
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider></v-divider>

      <v-list-item v-for="(item, index) in items" :key="index" :to="item.link">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

export default {
  data () {
    return {
      items: [
        { title: 'ホーム', icon: 'mdi-home', link: { name: 'userhome' } },
        { title: '探す', icon: 'mdi-magnify', link: { name: 'search' } },
        { title: '保存済み', icon: 'mdi-bookmark', link: { name: 'keeplist' } },
        { title: '読んだ本', icon: 'mdi-bookshelf', link: { name: 'readbooks' } },
      ]
    }
  },
}
</script>

<style scoped>
  .nav {
    position: fixed !important;
  }
</style>