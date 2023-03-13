<template>
  <div>
    <v-flex xs12 mb-3>
      <v-btn @click="handleClick" color="#33d9b2">
        receber cronogramaca pelo whatsapp  &#x1F4F1;
      </v-btn>
    </v-flex>
    <v-dialog  width="600" v-model="dialog">
      <v-card dark class="pa-3">
        <v-layout row wrap>
          <v-flex>
            <label for=""></label>
            <v-text-field label="Digite seu número do whatsapp" placeholder="DDD 9 9999-9999" dense outlined v-model="number" />
          </v-flex>
          <v-flex>
            <v-btn @click="sendTimeline()" color="primary" block>receber</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { sendTimeline } from "@/services/whatsappService";
import Vue from "vue";
interface Data {
  number: string;
  dialog: boolean;
}
export default Vue.extend({
    props:['timeline'],
  data(): Data {
    return {
      number: "",
      dialog: false,
    };
  },
  methods: {
    handleClick() {
      this.dialog = true;
    },

    sendTimeline() {
        let numberFormatted = this.number.replace(/\s+/g, '');
      let body = {
        phone: numberFormatted,
        message: this.timeline,
      };
      
      if(numberFormatted.length < 11) {
        this.$swal({
          iconHtml: "<span class='emoji'>🤔</span>",
          text: "Ops. Verifique o número digitado ",
        });
        return
      }
      sendTimeline(body)
        .then((res) => {
            this.$swal({
          iconHtml: "<span class='emoji'>😛</span>",
          text: "Cronograma enviado com sucesso ",
        });
        this.number = ""
        this.dialog = false
        })
        .catch((err) => console.log(err));
    },
  },
});
</script>

<style>

</style>