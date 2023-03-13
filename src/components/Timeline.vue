<template>
  <div>
    <v-btn class="mt-4" @click="showTimeline()">Gerar rotina</v-btn>
    <v-dialog persistent width="900" v-model="dialog">
      <v-card >
        <v-container grid-list-md class="container-timeline" pa-0>
          <v-flex xs12 class="text-end">
            <v-btn icon @click="dialog = false">
              <v-icon color="white">mdi-close</v-icon>
            </v-btn>
          </v-flex>
          <v-layout row wrap v-if="!requestEnd" class="container-loading">
            <v-flex xs12 class="text-center mt-4">
              <p class="loading"><span style="width: 20px;">Aguarde um pouco</span></p>
            </v-flex>
            <v-flex class="text-center" xs12 >
              <img src="https://i.pinimg.com/originals/57/61/5b/57615b8c0092a66c1d4058b1692955cc.gif" alt="">
            </v-flex>
          </v-layout>
          <v-layout
          v-else
          v-model="timelineConditional"
            row
            wrap
            class="card-timeline"
            pa-3
          >
            <v-flex xs12 class="container-text-timeline">
              <p class="text-timeline">{{ timeline }}</p>
            </v-flex>
            <v-flex xs12> </v-flex>
            <WhatsappMessage :timeline="timeline"/>
            <v-flex xs12 class="text-center">
              <v-btn @click="hideTimeline()"> fechar </v-btn>
              
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { integrationChatgpt } from "@/services/chatgptServices";
import WhatsappMessage from "./WhatsappMessage.vue";
import Vue, { watch } from "vue";

interface Message {
  phone: string;
  message: string;
}

interface Data {
  timelineConditional: boolean;
  infoMessage: Message;
  dialog: boolean;
  itensTodo: any[];
  bodyRequest: BodyAPIChatgpt;
  timeline: string;
  requestEnd: boolean
}

interface BodyAPIChatgpt {
  model: string;
  prompt: string;
  max_tokens: number;
  temperature: number;
}

export default Vue.extend({
  name: "Timeline",
  props: ["todoList"],
  components: {
    WhatsappMessage
  },
  data(): Data {
    return {
      requestEnd: false,
      timeline: "",
      bodyRequest: {
        model: "text-davinci-003",
        prompt: "",
        max_tokens: 900,
        temperature: 1.2,
      },
      itensTodo: [],
      dialog: false,
      timelineConditional: false,
      infoMessage: {
        phone: "",
        message: "",
      },
    };
  },
  methods: {
    showTimeline() {
      this.dialog = true;
      this.timelineConditional = true;

      console.log(this.itensTodo);
      this.apiChatGPT().then(() => this.requestEnd = true) 
    },

    apiChatGPT() {
      let prefix = ` lista de tarefas do dia ${this.itensTodo}. Faça um cronograma para minhas tarefas para que eu realize da melhor forma possível em um dia. Faça uma descrição para cada item fazendo uma breve descrição e se o tema for sobre estudo, me diga o que devo estudar. mande o texto formatado com linhas quebradas com emoticos legais que tenham haver com as atividades e me motive a realiza-las. Após o cronograma faça um breve texto sobre a importancia das atividades que lhe listei e me motive a realiza-las. "`;

      return integrationChatgpt({
        ...this.bodyRequest,
        prompt: prefix,
      }).then((res) => (this.timeline = res.data.choices[0].text));
    },

    hideTimeline() {
      this.dialog = false;
      this.requestEnd = false
    },

    
  },
  watch: {
    todoList(newValue) {
      this.itensTodo = newValue.map((item: any) => item.todo);
    },
  },
});
</script>

<style>
.card-timeline {
  min-width: 100% !important;
  height: 100%;
  background: rgba(0, 0, 0, 0.781) !important;
}

.container-timeline {
  height: 100%;
  background-image: url("https://i.pinimg.com/564x/2b/6e/ef/2b6eef49c99b78edd7c6aeee5ddaac3a.jpg");
  background-size: cover;
}

.text-timeline {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.74);
  font-size: 1.2rem;
}

.container-text-timeline {
  height: 80%;
  overflow: scroll;
  overflow-x: hidden;
}




.loading {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        display: inline-block;
      }

      .loading:after {
        content: "...";
        animation: dots 1s ease-in-out infinite;
      }

      @keyframes dots {
        0% {
          content: "";
        }
        33% {
          content: ".";
        }
        66% {
          content: "..";
        }
        100% {
          content: "...";
        }
      }
</style>