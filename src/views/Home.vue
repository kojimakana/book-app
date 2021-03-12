<template>
  <div class="home">
    <v-container fill-height>
      <div class="box text-center">
        <div class="content">
          <h1  class="teal--text darken-4 display-3 font-weight-bold">読書メモ</h1>
          <p class="white--text">あなたの読書を記録するアプリ</p>
          <div v-if="!isSignIn">
            <v-btn class="mr-2" color="primary lighten-1" to="/signin" data-cy="signinBtn">ログイン</v-btn>
            or
            <v-btn to="/signup" class="nav-join ml-2" data-cy="joinBtn">ユーザー登録
            </v-btn>
            <!-- <div>
              <v-btn text class="my-3" color="primary" @click="signInAnonymously">登録せずに機能だけ試す</v-btn>
            </div> -->
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  },
  computed: {
    isSignIn() {
      return this.$store.getters.isSignIn
    }
  },
  // methods: {
  //   signInAnonymously() {
  //     this.$store.dispatch('anonymityUserLogin')
  //   }
  // }
}
</script>

<style lang="scss" scoped>
  .home {
    width: 100%;
    height: 100%;
    background: url('../assets/img/home.jpg') no-repeat;
    background-size: cover;
  }

// .box {
//   background-color: rgba(136, 132, 132, 0.3);
//   border-radius: 50%;
//   height: 80%;
//   width: 80%;
//   position: relative;
//   margin: 0 auto;
// }

// .content {
//   position: absolute;
//   left: 50%;
//   top: 50%;
//   transform: translate(-50%, -50%);
//   width: 80%;
// }
</style>
