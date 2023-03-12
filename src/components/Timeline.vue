<template>
  <div>
    <v-btn class="mt-4" @click="showTimeline()">Gerar rotina</v-btn>
    <v-layout row wrap v-if="timelineConditional">
      <v-flex>testando</v-flex>
      <v-flex xs-5>
          <v-text-field v-model="infoMessage.phone" dense outlined/>
        </v-flex>
        <v-btn @click="handleClick" color="primary">
            enviar cronograma
        </v-btn>
    </v-layout>
  </div>
</template>

<script lang="ts">
import {sendTimeline} from '@/services/whatsappService'
import Vue from "vue";

interface Message {
    phone: string,
    message: string
}

interface Data {
  timelineConditional: boolean;
  infoMessage: Message
}


export default Vue.extend({
  name: "Timeline",
  data(): Data {
    return {
        timelineConditional: false,
        infoMessage: {
            phone: '',
            message: ''
        }
    };
  },
  methods: {
    showTimeline() {
        this.timelineConditional = true 
    },

    handleClick() {
        let numberFormatted = `${this.infoMessage.phone}`
        let body = {
            phone: numberFormatted,
            message: 'Ola Mundo31231231231'
        }
        sendTimeline(body).then((res) => console.log(res))
        .catch(err => console.log(err))
    }


  }
});
</script>

<style>
</style>