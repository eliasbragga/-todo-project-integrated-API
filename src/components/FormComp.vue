<template>
  <v-container grid-list-md>
    <v-layout row wrap class="layout">
      <v-flex xs12 class="mb-7">
        <h1 style="font-size: 3.5rem" class="text-center messageTitle">
          Sua To-Do List
        </h1>
      </v-flex>
      <v-flex
        class="pl-9"
        xs12
        @keyup.enter="nextStep === 0 ? nextStep++ : createTodoAUX()"
        v-if="nextStep === 0"
      >
        <p class="">Quais são as atividades de hoje? </p>
        <v-text-field
          :disabled="loadingField || loadingCard"
          autofocus
          placeholder="digite algo :)"
          class="mt-2"
          :dark="true"
          dense
          outlined
          v-model="todo"
        />
      </v-flex>
      <v-flex
      class="pl-9"
        xs12
        @keyup.enter="nextStep === 0 ? nextStep++ : createTodoAUX()"
        v-else
      >
        <span>Que tal fazer uma breve descrição da atividade? </span>
        <v-textarea
          :append-icon="'mdi-arrow-left'"
          @click:append="nextStep--"
          rows="3"
          :disabled="loadingField || loadingCard"
          autofocus
          placeholder="descrição..."
          class="mt-2"
          :dark="true"
          dense
          outlined
          v-model="description"
        />
      </v-flex>
      <v-flex xs12 class="mb-9 mt-n5 ml-8">
        <v-btn
          :class="{ 'btn-disabled': todo.length < 1 }"
          title="Digite algo"
          :disabled="todo.length < 1 || loadingCard"
          :loading="loadingField"
          @click="nextStep === 0 ? nextStep++ : createTodoAUX()"
          color="black"
          class="btn"
        >
          <span class="btn-text">{{
            nextStep === 0 ? "Adicionar" : "Salvar"
          }}</span>
          <span class="btn-icon"> <v-icon class="i">mdi-check</v-icon></span>
        </v-btn>
        <v-btn
          v-show="toDelete.length > 0"
          @click="toDeleteItens()"
          small
          color="error"
        >
          <span style="color: black">excluir itens selecionados </span>
          <v-icon color="black">mdi-delete</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex class="mt-n8 container-todo-item">
        <div
          :style="{ display: 'flex' }"
          v-for="(todo, index) in todoList"
          :key="todo._id"
        >
          <div>
            <v-checkbox
              :disabled="loadingField || loadingCard"
              dark
              @click="addToDelete(todo._id)"
              color="white"
            />
          </div>
          <div
            :style="{ backgroundColor: background[index] }"
            class="todoItem"
            @dblclick="openDialog(todo.todo, $event, index)"
          >
            <v-checkbox
              :disabled="loadingField || loadingCard"
              @click="checkTodo(todo._id, todo.todo, todo.isDone)"
              v-model="todo.isDone"
              color="black"
            ></v-checkbox>
            <div style="width: 80%">
              <span
                style="font-size: 1.3rem"
                :class="todo.isDone ? 'textDecorateOff' : 'textDecorate'"
                >{{ todo.todo }}</span
              >
            </div>
            <v-icon
              :disabled="loadingField || loadingCard"
              :class="todo.priority ? 'yellow--text' : ''"
              @click="priorityTodo(todo)"
            >
              {{ todo.priority ? "mdi-star" : "mdi-star-outline" }}
            </v-icon>
            <EditTodo
              :loadingField="loadingField"
              :loadingCard="loadingCard"
              :isDone="todo.isDone"
              :idTodo="todo._id"
              @switchDialog="switchDialog"
            />
            <v-btn
              :disabled="todo.priority || loadingField || loadingCard"
              color="error"
              class="ml-3"
              @click="confirmDelete(todo._id)"
              icon
            >
              <v-icon size="29">mdi-delete</v-icon>
            </v-btn>
            <v-flex>
              <v-menu  bottom offset-x  offset-y dark>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn dark icon v-bind="attrs" v-on="on">
                    <v-icon color="black">mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>
                      <Description :id="todo._id" :todo="todo.todo"/>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">

                          <v-icon v-bind="attrs" v-on="on" @click="openDialog(todo.todo, $event, index)" color="#fbc531"> mdi-lightbulb </v-icon>
                        </template>
                        <span style="font-family: Arial, Helvetica, sans-serif; color: white;">Diquinha</span>
                      </v-tooltip>
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-flex>
            <InfoMessage
              @closeDialog="closeDialog"
              :dialog="dialog"
              :index="index"
              :infoMessage="messageAPI"
              :loadingEnd="loadingEnd"
            />
          </div>
        </div>
      </v-flex>
    </v-layout>
    <Timeline :todoList="todoList" class="layout"/>
  </v-container>
</template>

<script lang="ts">
import { integrationChatgpt } from "@/services/chatgptServices";
import Swal from "sweetalert2";
import EditTodo from "./EditTodo.vue";
import InfoMessage from "./InfoMessage.vue";
import Description from "./Description.vue";
import Timeline from './Timeline.vue'
import Vue from "vue";
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from "@/services/formService";
interface Teste {
  model: string;
  prompt: string;
  max_tokens: number;
  temperature: number;
}

interface Data {
  todo: string;
  description: string;
  todoList: any[];
  loadingField: boolean;
  isDone: boolean;
  isStarEnabled: boolean;
  toDelete: any[];
  bodyRequest: Teste;
  messageAPI: string;
  dialog: boolean;
  loadingCard: boolean;
  background: any;
  nextStep: number;
  idTodoItem: string
  loadingEnd: boolean
}
export default Vue.extend({
  name: "FormComp",
  components: {
    EditTodo,
    InfoMessage,
    Description,
     Timeline
  },
  data(): Data {
    return {
      loadingEnd: false,
      idTodoItem: '',
      nextStep: 0,
      background: {},
      loadingCard: false,
      dialog: false,
      isStarEnabled: false,
      isDone: false,
      todo: "",
      description: "",
      todoList: [],
      loadingField: false,
      toDelete: [],
      bodyRequest: {
        model: "text-davinci-003",
        prompt: "",
        max_tokens: 400,
        temperature: 0.6,
      },
      messageAPI: "",
    };
  },
  methods: {
    openDescription(id: string): void {
      this.idTodoItem = id
    },

    closeDialog(index: number): void {
      this.loadingEnd = true
      this.background = {};
      this.loadingCard = false;
      this.dialog = false;
      this.messageAPI = "";
    },

    async openDialog(todo: string, event: any, index: number): Promise<any> {
      this.dialog = true;
      return await this.apiChatGPT(todo)
        .then(async (res) => {
          this.todo = "";
          this.loadingField = false;
          this.loadingEnd = true
        })
        .finally(() => {
          this.loadingField = false;
          this.todo = "";
          this.loadingCard = false;
        });
    },

    toDeleteItens(): void {
      Swal.fire({
        title: "Excluir atividades?",
        text: "Tem certeza que deseja excluir estas atividades?",
        iconHtml: "<span class='emoji'>🤔</span>",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Atividades excluídas!",
            text: "As atividades foram excluídas com sucesso.",
            iconHtml: "<span class='emoji'>&#x1F609;</span>",
          }).then(async () => {
            await this.toDelete.forEach((todoId) => {
              deleteTodo(todoId);
              this.toDelete = [];
            });
            this.getAllTodos();
          });
        } else {
          Swal.fire({
            title: "Exclusões canceladas!",
            text: "As atividades não foram excluídas.",
            iconHtml: "<span class='emoji'>😛</span>",
          });
        }
      });
    },

    addToDelete(id: string): void {
      if (this.toDelete.includes(id)) {
        const index = this.toDelete.indexOf(id);
        this.toDelete.splice(index, 1);
        return;
      }
      this.toDelete.push(id);
    },

    async priorityTodo(todo: any) {
      this.isStarEnabled = todo.priority;
      this.isStarEnabled = !this.isStarEnabled;
      const update = await updateTodo(
        { ...todo, priority: this.isStarEnabled },
        todo._id
      );
      this.getAllTodos();
    },

    checkTodo(id: string, todo: string, isDone: boolean): void {
      const update = updateTodo({ todo: todo, isDone: isDone }, id);
    },

    async createTodoAUX(){
      this.loadingField = true;
      try {
        await createTodo<Data>({
          todo: this.todo,
          description: this.description,
        });
        this.nextStep--;
        this.getAllTodos();
      } catch (err) {
        this.$swal({
          iconHtml: "<span class='emoji'>\u{1F622}</span>",
          text: "Deu ruim. Porfavor tente novamente ",
        });
      } finally {
        this.todo = "";
        this.description = "";
        this.loadingField = false;
      }
    },

    confirmDelete(idTodo: string):void {
      Swal.fire({
        title: "Excluir atividade?",
        text: "Tem certeza que deseja excluir esta atividade?",
        iconHtml: "<span class='emoji'>🤔</span>",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sim, excluir!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Atividade excluída!",
            text: "A atividade foi excluída com sucesso.",
            iconHtml: "<span class='emoji'>&#x1F609;</span>",
          }).then(async () => {
            console.log(typeof idTodo);
            await deleteTodo(idTodo);
            this.getAllTodos();
          });
        } else {
          Swal.fire({
            title: "Exclusão cancelada!",
            text: "A atividade não foi excluída.",
            icon: "error",
            iconHtml: "<span class='emoji'>😛</span>",
          });
        }
      });
    },

    getAllTodos(): Promise<Data[]> {
      return getTodos<Data>().then((res) => (this.todoList = res));
    },

    switchDialog(): void {
      this.getAllTodos();
    },

    apiChatGPT(todo: string) {
      let prefix;
      if (todo.includes("estudar" || "estudo")) {
        prefix = "Me liste os principais conteudos deste assunto";
      } else {
        prefix =
          "Em um texto descontraido, me motivo a realizar esta tarefa e como posso fazer isso. Faça isso em um texto curto";
      }
      return integrationChatgpt({
        ...this.bodyRequest,
        prompt: `${todo}. ${prefix}`,
      }).then((res) => (this.messageAPI = res.data.choices[0].text));
    },
  },
  async mounted() {
    await this.getAllTodos();
  },
});
</script>

<style>
.messageTitle {
  text-shadow: 4px 4px 1px rgba(255, 255, 255, 0.979);
}

.message {
  text-shadow: 2px 2px 1px rgba(0, 0, 0, 0.979);
  font-size: 1.4rem;
}

.layout {
  width: 60% !important;
  margin: auto !important;
}

.todoItem {
  color: black;
  background: #33d9b2;
  min-height: 60px;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0 1rem;
  border-radius: 5px;
  box-shadow: 3px 3px 10px 10px rgba(0, 0, 0, 0.363);
  width: 100%;
}

.todoItemLoading {
  background: #437468;
}

.textDecorate {
  background-image: linear-gradient(to right, #000 50%, transparent 90%);
  background-position: bottom;
  background-size: 100% 3px;
  background-repeat: no-repeat;
  display: inline-block;
  animation: moveBorderOff 0.4s forwards;
  color: black;
}
.textDecorateOff {
  background-image: linear-gradient(to right, #000 50%, transparent 90%);
  background-position: bottom;
  background-size: 100% 3px;
  background-repeat: no-repeat;
  display: inline-block;
  animation: moveBorder 0.9s forwards;
  color: rgba(53, 53, 53, 0.589) !important;
}

@keyframes moveBorder {
  0% {
    /* background-size: 0% 3px; */
    background-position: bottom;
  }
  100% {
    /* background-size: 100% 3px; */
    background-position: center;
  }
}
@keyframes moveBorderOff {
  0% {
    /* background-size: 0% 3px; */
    background-position: center;
  }
  100% {
    /* background-size: 100% 3px; */
    background-position: bottom;
  }
}

.marginButtonDeleteItens {
  margin-left: 4%;
}

.text-wait {
  color: black;
}

.container-todo-item {
  max-height: 420px;
  overflow: scroll;
  overflow-x: hidden;

}

*::-webkit-scrollbar {
  width: 5px;
  max-height: 100px !important;
}

*::-webkit-scrollbar-thumb {
  background-color: #a8a2a2;
  border-radius: 20px;
  max-height: 100px !important;
  margin-bottom: 1rem;
}
</style>
