Vue.component('listComponent', {
  template: `
    <section class="main">
      <input class="toggle-all" type="checkbox" v-model="allDone">
      <ul class="todo-list">
        <li class="todo"
          v-for="(todo,index) in filteredTodos"
          :class="{
            completed: todo.completed,
            editing: editing && index == editing.index}">
          <div class="view">
            <input class="toggle" type="checkbox"
              :checked="todo.completed"
              @click="switchComplete(index)">
            <label @dblclick="editTodo(index)">
              {{todo.title}}
            </label>
            <button class="destroy"
              @click="removeTodo(index)">
            </button>
          </div>
          <input class="edit" type="text"
            v-if="editing && index == editing.index"
            v-model.trim="editing.title"
            v-focus
            @blur="doneEdit(index)"
            @keyup.enter="doneEdit(index)"
            @keyup.esc="cancelEdit()">
        </li>
      </ul>
    </section>
  `,
  data: function () {
    return {
      editing: null
    }
  },
  computed: {
    filteredTodos: function () {
      return this.$store.getters.filteredTodos
    },
    allDone: {
      get: function () {
        return this.$store.getters.allDone
      },
      set: function (val) {
        this.$store.commit('allDone', val)
      }
    }
  },
  methods: {
    switchComplete: function (index) {
      this.$store.commit('switchComplete', { index })
    },
    removeTodo: function (index) {
      this.$store.commit('remove', { index })
    },
    editTodo: function (index) {
      this.editing = {
        index: index,
        title: this.filteredTodos[index].title
      }
    },
    doneEdit: function (index) {
      if (!this.editing) return;
      if (!this.editing.title.length) {
        this.removeTodo(index)
      } else {
        this.$store.commit('updateTitle', this.editing)
      }
      this.editing = null
    },
    cancelEdit: function () {
      this.editing = null
    }
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  }
})

