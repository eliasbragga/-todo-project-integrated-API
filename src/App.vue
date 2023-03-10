<template>
    <v-app class="containerApp" >
      <div class="backgroundOpacity">
        <FormView/>
      </div>
    </v-app>
  </template>

<script lang="ts">
import FormView from '@/views/FormView.vue'
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
  components: {
    FormView
  }
});
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Bungee+Inline&display=swap');
@font-face {
  font-family: Chewy;
  src: url('https://fonts.googleapis.com/css2?family=Chewy&display=swap');
}
* {
  font-family: 'Bungee Inline', cursive;
  color: #33d9b2;

}
  .containerApp {
  background-image:url('https://i.pinimg.com/564x/de/4c/6e/de4c6e60744943ae2f65daad6cec7765.jpg') !important;
  background-size: contain !important;
  
  color: white !important;
}

.backgroundOpacity {
  background-color: rgba(0, 0, 0, 0.705) !important; 
  min-height: 100%;
  box-shadow: inset 15px 10px 25px 20px rgba(0, 0, 0, 0.418) !important;
}





</style>
