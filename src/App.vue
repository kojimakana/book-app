<template>
  <v-app>
    <Menu />

    <Nav />

    <v-main>
      <router-view></router-view>
    </v-main>

  </v-app>
</template>

<script>
import Menu from './components/Menu'
import Nav from './components/Nav'


export default {
  name: 'App',
  components: {
    Menu,
    Nav,
  },

  data: () => ({
    //
  }),
};
</script>

