<template>
  <div class="home">
    <v-container fill-height justify-space-around>
      <v-flex xs12 sm8 md5 class="box text-center my-3">
        <div class="content">
          <h1  class="teal--text darken-4 display-3 font-weight-bold">読書メモ</h1>
          <div>あなたの読書を記録するアプリ</div>
          <div v-if="!isAuthenticated" class="mt-2">
            <v-btn class="mr-2" color="primary lighten-1" to="/signin" data-cy="signinBtn">ログイン</v-btn>
            or
            <v-btn to="/signup" class="nav-join ml-2" data-cy="joinBtn">ユーザー登録
            </v-btn>
          </div>
        </div>
      </v-flex>
      <v-flex xs12 md5 v-if="!isAuthenticated">
        <v-expansion-panels flat tile class="app-description">
          <v-expansion-panel
          >
            <v-expansion-panel-header>
              <span class="text-decoration-underline">読書メモとは</span><v-icon color="blue darken-2">mdi-help-circle-outline</v-icon>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <p>
              読書習慣をつけたい人、読書を振り返りたい人のための『読書記録アプリ』です。
              </p>
              <div class="my-4 step-list" v-for="(step, index) in stepList" :key="index">
                <span class="teal--text darken-4 font-weight-bold">{{ step.title }}
                <v-icon color="teal darken-4">{{ step.icon }}</v-icon></span>
                <br>
                  {{ step.detail }}
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-flex>
    </v-container>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data() {
    return {
      stepList: [
        {title: '【Step1】 探す', icon: 'mdi-magnify', detail: 'キーワードで本を検索'},
        {title: '【Step2】 保存', icon: 'mdi-bookmark', detail: '気になる本を登録する'},
        {title: '【Step3】 記録', icon: 'mdi-pencil-plus', detail: '自分だけのメモや感想を記録'},
      ]
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  },
}
</script>

<style lang="scss" scoped>
  .home {
    width: 100%;
    height: 100%;
    background: url('../assets/img/home.jpg') no-repeat;
    background-size: cover;
  }

  .content {
    padding: 50px 0;
    margin: 0 auto;
    background-color: rgba(255, 255, 255, 0.7);
  }

  .theme--light.v-expansion-panels .v-expansion-panel {
    background-color: rgba(255, 255, 255, 0.7);
  }

  i {
    margin: 0 10px;
    flex: none !important;
  }

  .v-expansion-panel-content {
    font-size: 85%;
  }
</style>
