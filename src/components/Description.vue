<template>
  <div>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon @click="handleClick" class="iconEyes" v-bind="attrs" v-on="on">
          mdi-eye
        </v-icon>
      </template>
      <span style="font-family: Arial, Helvetica, sans-serif; color: white;">Sua descrição</span>
    </v-tooltip>
    <br /><br />

    <v-dialog
      persistent
      v-model="dialog"
      width="700"
      class="background-card pa-4"
    >
      <v-card height="400px" class="background-card" width="700">
        <div class="background-filter pa-7">
          <v-flex mb-4>
            <h1 class="text-center title-card">Descrição da atividade</h1>
          </v-flex>
          <v-btn
            :disabled="editMode"
            dark
            class="mb-4"
            small
            @click="editDescription()"
          >
            <v-icon color="primary">mdi-pencil</v-icon>
          </v-btn>
          <v-flex class="text-card" v-if="!editMode">
            <p
              @dblclick="editDescription()"
              style="
                font-family: Arial, Helvetica, sans-serif;
                font-weight: bolder;
              "
            >
              {{ description }}
            </p>
          </v-flex>
          <v-flex class="text-card" v-else>
            <v-textarea dark outlined rows="2" v-model="description" />
          </v-flex>
          <v-flex align-self-start>
            <v-btn
              @loading="loadingFields"
              @click="!editMode ? closeDialog() : updateDescription()"
              block
              color="#33d9b2"
              >{{ !editMode ? "Fechar" : "Salvar" }}</v-btn
            >
          </v-flex>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
  
  <script lang="ts">
import Vue from "vue";
import { getTodosById, updateTodo } from "@/services/formService";

interface Data {
  dialog: boolean;
  description: string;
  editMode: boolean;
  loadingFields: boolean;
}

export default Vue.extend({
  name: "Description",
  props: ["id", "todo"],
  data(): Data {
    return {
      editMode: false,
      description: "",
      dialog: false,
      loadingFields: false,
    };
  },
  methods: {
    editDescription() {
      this.editMode = true;
    },

    async updateDescription() {
      try {
        this.loadingFields = true;
        const update = await updateTodo(
          { todo: this.todo, description: this.description },
          this.id
        );
        const todos = await getTodosById<Data>(this.id);
        this.editMode = false;
        this.$swal({
          iconHtml: "<span class='emoji'>&#128512</span>",
          text: "Descrição atualizada com sucesso!",
        });
      } finally {
        this.loadingFields = false;
      }
    },

    async handleClick() {
      const todos = await getTodosById<Data>(this.id);
      this.description = todos.description;
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = !this.dialog;
      this.description = "";
    },
  },
});
</script>
  
  <style>
.background-card {
  /* background-image: url("https://i.pinimg.com/564x/ae/2d/09/ae2d09a1f39189c1106ac6022d086246.jpg") !important; */
  background-size: 400px;
  background-repeat: repeat-x;
  background-position-y: calc(100% - 0px);
}

.background-filter {
  background: rgba(0, 0, 0, 0.897) !important;
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

.theme--dark.v-input input,
.theme--dark.v-input textarea {
  font-family: arial;
  font-weight: bold;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.808);
}

.iconEyes {
  color: #33d9b2 !important;
  transition: 0.6s;
}
.iconEyes:hover {
  color: #33d9b2;
  filter: brightness(1.5);
  transition: 0.6s;
}
</style>