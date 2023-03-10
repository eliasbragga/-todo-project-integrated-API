<template>
  <div>
    <v-btn @click="openPopup()" class="ml-3" icon color="black">
      <v-icon size="29">mdi-pencil</v-icon>
    </v-btn>
    <v-dialog width="600" persistent v-model="dialog">
      <v-card class="pa-2">
        <v-flex xs12 class="d-flex" style="justify-content: center">
          <v-flex xs5>
            <v-text-field dense outlined v-model="todo" />
          </v-flex>
        </v-flex>
        <v-flex xs12 class="d-flex" style="justify-content: center">
          <v-btn small color="error" class="mr-3" @click="dialog = false"
            >cancelar</v-btn
          >
          <v-btn @click="updateTodoAUX" small color="primary">salvar</v-btn>
        </v-flex>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { getTodosById, updateTodo } from "@/services/formService";
import Vue from "vue";

interface Data {
  dialog: boolean;
  todo?: string;
}
export default Vue.extend({
  name: "FormComp",
  props: ["idTodo"],
  data(): Data {
    return {
      dialog: false,
      todo: "",
    };
  },
  methods: {
    async openPopup() {
      this.dialog = true;
      const todos = await getTodosById<Data>(this.idTodo);
      this.todo = todos.todo;
    },

    updateTodoAUX() {
      this.$swal({
        icon: "success",
        text: "Atividade atualizada com sucesso!",
      });
      const update = updateTodo({ todo: this.todo }, this.idTodo);
      console.log(update);
      this.$emit("switchDialog");
      this.dialog = false;
    },
  },
});
</script>
