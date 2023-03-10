<template>
  <v-container grid-list-md>
    <v-layout row wrap class="layout">
      <v-flex xs12 class="mb-7">
        <h1 style="font-size: 3.5rem" class="text-center messageTitle">
          Sua ToDo List
        </h1>
      </v-flex>
      <v-flex xs12>
        <span>Quais são as atividades de hoje? </span>
        <v-text-field
          placeholder="digite algo :)"
          class="mt-2"
          :dark="true"
          dense
          outlined
          v-model="todo"
        />
      </v-flex>
      <v-flex xs12 class="mb-9 mt-n5">
        <v-btn
          :class="{ 'btn-disabled': todo.length < 1 }"
          title="Digite algo"
          :disabled="todo.length < 1"
          :loading="loadingField"
          @click="createTodoAUX"
          color="black"
          class="btn"
        >
          <span class="btn-text">Adicionar</span>
          <span class="btn-icon"> <v-icon class="i">mdi-check</v-icon></span>
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <div class="todoItem" v-for="todo in todoList" :key="todo._id">
          <v-checkbox
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
            :class="todo.priority ? 'yellow--text' : ''"
            @click="priorityTodo(todo)"
            
          >
            {{ todo.priority ? "mdi-star" : "mdi-star-outline" }}
          </v-icon>
          <EditTodo :idTodo="todo._id" @switchDialog="switchDialog" />
          <v-btn
            :disabled="todo.priority"
            color="error"
            class="ml-3"
            @click="confirmDelete(todo._id)"
            icon
          >
            <v-icon size="29">mdi-delete</v-icon>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Swal from "sweetalert2";
import EditTodo from "./EditTodo.vue";
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from "@/services/formService";
import Vue from "vue";
interface Data {
  todo: string;
  todoList: any[];
  loadingField: boolean;
  isDone: boolean;
  isStarEnabled:boolean
}
export default Vue.extend({
  name: "FormComp",
  components: {
    EditTodo,
  },
  data(): Data {
    return {
      isStarEnabled:false,
      isDone: false,
      todo: "",
      todoList: [],
      loadingField: false,
    };
  },
  methods: {
    async priorityTodo(todo: any) {
      this.isStarEnabled  = todo.priority
      this.isStarEnabled = !this.isStarEnabled
      const update = await updateTodo({ ...todo, priority: this.isStarEnabled }, todo._id)
      this.getAllTodos();
    },

    checkTodo(id: string, todo: string, isDone: boolean) {
      const update = updateTodo({ todo: todo, isDone: isDone }, id);
    },

    async createTodoAUX() {
      this.loadingField = true;
      try {
        await createTodo<Data>({ todo: this.todo });
        this.$swal({
          icon: "success",
          text: "Atividade criada com sucesso \u{1F60E}",
        });
        this.getAllTodos();
      } catch (err) {
        this.$swal({
          iconHtml: "<span class='emoji'>\u{1F622}</span>",
          text: "Deu ruim. Porfavor tente novamente ",
        });
      } finally {
        this.todo = "";
        this.loadingField = false;
      }
    },

    confirmDelete(idTodo: string) {
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
          Swal.fire(
            "Atividade excluída!",
            "A atividade foi excluída com sucesso.",
            "success"
          ).then(async () => {
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

.btn:hover .btn-text {
  opacity: 0;
}

.btn:hover .btn-icon {
  opacity: 1;
}

.btn-text {
  position: relative;
  transition: opacity 0.3s ease-out;
}

.btn-icon {
  opacity: 0;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  transition: opacity 0.3s ease-out;
}

.btn-disabled {
  opacity: 1.6;
  color: #fff !important;
  background-color: #fa0c0c !important;
}
</style>
