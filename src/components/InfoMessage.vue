<template>
  <v-dialog
    persistent
    v-model="dialog"
    width="700"
    class="background-card px-4 py-6"
  >
    <v-card height="400px" class="background-card" width="700">
      <div class="background-filter pa-7">
        <div v-if="!loadingEnd" class="progress-circular">
          <v-flex class="mb-10">
            <h3 class="text-center" style="color:white">So um momento...</h3>
          </v-flex>
          <v-flex class="mt-10">
            <v-progress-circular
              :size="100"
              :width="15"
              color="purple"
              indeterminate
            />

          </v-flex>
        </div>
        <div v-else>
          <v-flex mb-4>
            <h1 class="text-center title-card">
              Uma diquinha sobre sua atividade
            </h1>
          </v-flex>
          <v-flex class="text-card">
            <p
              style="
                font-family: Arial, Helvetica, sans-serif;
                font-weight: bolder; 
              "
            >
              {{ infoMessage }}
            </p>
          </v-flex>
        </div>
        <v-flex align-self-start>
          <v-btn v-if="loadingEnd" @click="closeDialog" block color="#33d9b2">Obrigado!</v-btn>
        </v-flex>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";

interface Data {}

export default Vue.extend({
  name: "InfoMessage",
  props: ["infoMessage", "dialog", "index", "loadingEnd", "progress"],
  data(): Data {
    return {};
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog", this.index);
    },
  },
});
</script>

<style>
.background-card {
  background-image: url("https://i.pinimg.com/564x/c3/1a/30/c31a304d7f00cf4346fa74902a4d1e67.jpg") !important;
  background-size: cover;
  background-position-y: calc(100% + 500px);
}

.background-filter {
  background: rgba(0, 0, 0, 0.808) !important;
  height: 100% !important;
}

.title-card {
  text-shadow: 2px 2px 2px black;
  color: rgba(233, 233, 233, 0.849);
}

.text-card {
  height: 60%;
  overflow: scroll;
  overflow-x: hidden;
  font-size: 1.1rem;
}

*::-webkit-scrollbar {
  width: 5px;
  max-height: 100px !important;
}

*::-webkit-scrollbar-thumb {
  background-color: #a8a2a2;
  border-radius: 20px;
  max-height: 100px !important;
}


.progress-circular {
  width: 50%;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>