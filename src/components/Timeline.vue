<template>
  <v-layout row wrap style="width: 80% !important;" class="text-center">
    <v-flex xs12 mb-8>
        <h1 class="text-center" style="color:#1976D2">Sua timeline</h1>
    </v-flex>
    <v-flex xs12>

    <v-timeline dark align-top :dense="$vuetify.breakpoint.smAndDown" class="mx-auto">
      <v-timeline-item
        v-for="(item, i) in todoList"
        :key="i"
      >
        <v-card  dark width="500px">
          <v-card-title class="text-h6"  style="color:white;"> {{item.todo | capitalize }}</v-card-title>
          <v-card-text color="" class="" style="background: #e1b17a;">
            <p style=" color: black;">
              {{item.description ? item.description : 'Você não adicionou uma descrição :('}}
            </p>
            <!-- <v-btn :color="item.color" class="mx-0" outlined> Button </v-btn> -->
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
</v-flex>
  </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
interface Data {
}
export default Vue.extend({
  name: "Timeline",
  props:['todoList'],
  data(): Data {
    return {
     
    };
  },
  mounted() {
    console.log('aqqq', this.todoList)
  }
});
</script>

<style>


</style>