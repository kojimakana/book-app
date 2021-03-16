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
import globalValiables from '../mixins/globalValiables'


export default {
  name: 'App',
  mixins:[globalValiables],
  components: {
    Menu,
    Nav,
  },

  data: () => ({
    //
  }),
};
</script>

