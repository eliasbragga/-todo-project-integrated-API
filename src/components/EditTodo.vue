<template>
  <div>
    <v-btn :disabled="isDone" @click="openPopup()" class="ml-3" icon color="black">
      <v-icon size="29">mdi-pencil</v-icon>
    </v-btn>
    <v-dialog width="500" persistent v-model="dialog" >
      <v-card width="500" class="pa-2 card" min-height="300" >
        <v-flex xs12 class="d-flex" style="justify-content: center">
          <v-flex xs5>
            <label>Editar atividade</label>
            <v-text-field dark dense outlined v-model="todo" />
          </v-flex>
        </v-flex>
        <v-flex xs12 class="d-flex" style="justify-content: center">
          <v-btn small color="error" class="mr-3" @click="dialog = false"
            >cancelar</v-btn
          >
          <v-btn :disabled="todo.length < 1" @click="updateTodoAUX" small color="primary">salvar</v-btn>
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
  todo: string;
}
export default Vue.extend({
  name: "FormComp",
  props: ["idTodo", "isDone"],
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
        iconHtml: "<span class='emoji'>&#128512</span>",
        text: "Atividade atualizada com sucesso!",
      });
      const update = updateTodo({ todo: this.todo }, this.idTodo);
      this.$emit("switchDialog");
      this.dialog = false;
    },
  },
});
</script>

<style>
.card {
  background-image: url('https://i.pinimg.com/564x/d1/28/62/d128629204dca175c9ec49326351381e.jpg');
  background-position: top;
  background-position-y: calc(100% + 500px);

}
</style>
