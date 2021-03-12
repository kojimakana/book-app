<template>
  <v-card class="pa-4"> 
    <div class="text-center">
      <p class="font-weight-bold">{{ postTitle }}</p>
    </div>
    <v-form>
      <vuejs-datepicker 
      name="postdate"
      v-model="postValue.date"
      :value="postValue.date"
      :format="customFormat"
      @input="dateSelected"
      input-class="input-class"
      >
      </vuejs-datepicker>
      <v-textarea class="mt-2"  name="comment" v-model="postValue.comment" :value="postValue.comment"
        placeholder="メモ・感想" outlined></v-textarea>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="gray"
          text
          @click.prevent="close"
        >
          キャンセル
        </v-btn>
        <v-btn
          color="green darken-2"
          outlined
          type="submit"
          @click.prevent="updatePost(postValue)"
        >
          上書きする
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import vuejsDatepicker from 'vuejs-datepicker'
import moment from 'moment'

export default {
  name: 'EditDialog',
  props: {
    postTitle: {
      type: String,
      require: true
    },
    postDate: {
      type: String,
      require: true
    },
    postComment: {
      type: String,
      require: true
    },
  },
  components: {
    'vuejs-datepicker': vuejsDatepicker
  },
  data () {
    return {
      DatePickerFormat: 'yyyy-MM-dd',
      postValue: {
        date: new Date(),
        comment: ''
      },
    }
  },
  created() {
    // if(this.postDate || this.postComment) {
      this.postValue.date = this.postDate;
      this.postValue.comment = this.postComment
    // }
  },
  watch: {
    postTitle(newValue, oldValue) {
      console.log(newValue, oldValue);
      this.postValue.date = this.postDate;
      this.postValue.comment = this.postComment;
    }
  },
  methods: {
    close() {
      this.$emit('closeModal')
    },
    updatePost() {
      this.$emit('updatePost', this.postValue)
      console.log(this.postValue);
    },
    customFormat(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    dateSelected() {
      //入力されたdateを上書きする
        let post_date = moment(this.postValue.date).format('YYYY-MM-DD')
        this.postValue.date = post_date
    },
    commentInput() {
        this.postValue.comment = this.comment
    }
  },
}
</script>

<style lang="scss">
  .input-class {
    border: 1px solid #666;
    border-radius: 4px;
  }
</style>