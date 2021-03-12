<template>
  <v-card class="pa-4"> 
    <div class="text-center">
      <p class="font-weight-bold">{{ bookTitle }}</p>
    </div>
    <v-form>
      <!-- 今日の日付 -->
      <vuejs-datepicker 
      name="date"
      v-model="emitValue.date"
      :value="emitValue.date"
      :format="customFormat"
      @input="dateSelected"
      input-class="input-class"
      >
      </vuejs-datepicker>
      <!-- 前回記録したcommentを表示 -->
      <v-textarea class="mt-2"  name="comment" v-model="emitValue.comment" :value="emitValue.comment" 
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
          color="blue"
          outlined
          type="submit"
          @click.prevent="post(emitValue)"
        >
          記録する
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
import vuejsDatepicker from 'vuejs-datepicker'
import moment from 'moment'

export default {
  name: 'CommitDialog',
  props: {
    bookTitle: {
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
      emitValue: {
        date: new Date(),
        comment: ''
      },
    }
  },
  created() {
      let book_date = moment(this.emitValue.date).format('YYYY-MM-DD')
      this.emitValue.date = book_date
  },
  watch: {
    bookTitle(newValue, oldValue) {
      console.log(newValue, oldValue);
      this.emitValue.comment = '';
    }
  },
  methods: {
    close() {
      this.$emit('closeModal')
    },
    post() {
      this.$emit('postBook', this.emitValue)
    },
    customFormat(date) {
      return moment(date).format('YYYY-MM-DD')
    },
    dateSelected() {
      //入力されたdateを上書きする
        let book_date = moment(this.emitValue.date).format('YYYY-MM-DD')
        this.emitValue.date = book_date
    },
  },
}
</script>

<style lang="scss">
  .input-class {
    border: 1px solid #666;
    border-radius: 4px;
  }
</style>