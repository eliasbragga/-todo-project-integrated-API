<template>
  <FormComp/>
</template>

<script lang="ts">
import FormComp from '@/components/FormComp.vue'
  import Vue from 'vue'
  export default Vue.extend({
    name: 'FormView',
    components: {
      FormComp
    },
  })
</script>
