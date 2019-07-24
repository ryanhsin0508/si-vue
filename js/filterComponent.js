Vue.component('filterComponent',{
  template:`
    <footer class="footer">
      <span class="todo-count">
        <strong>{{remaining}}</strong>
        {{pluralize('item', remaining)}} left
      </span>
      <ul class="filters">
        <li><a href="javascript:;"
          :class="{selected: visibility == 'all'}"
          @click="$router.replace('all')" >All</a>
        </li>
        <li><a href="javascript:;"
          :class="{selected: visibility == 'active'}"
          @click="$router.replace('active')" >Active</a>
        </li>
        <li><a href="javascript:;"
          :class="{selected: visibility == 'completed'}"
          @click="$router.replace('completed')" >Completed</a>
        </li>
      </ul>
      <button class="clear-completed"
        @click="removeCompleted"
        v-show="todos.length > remaining">
        Clear completed
      </button>
    </footer>
  `,
  computed:{
    todos: function(){
      return this.$store.state.todos
    },
    remaining: function () {
      return this.$store.getters.remaining
    },
    visibility: {
      get: function(){
        return this.$store.state.visibility
      },
      set: function(val){
        this.$store.commit('filter',val)
      }
    }
  },
  methods:{
    pluralize: function (word, count) {
      return word + (count === 1 ? '' : 's')
    },
    removeCompleted: function () {
      this.$store.commit('removeCompleted')
    }
  }
})