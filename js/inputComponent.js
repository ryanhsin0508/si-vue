Vue.component('inputComponent',{
  template:`
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" autofocus autocomplete="off"
        placeholder="What needs to be done?"
        v-model="newTodo" @keyup.enter="addTodo">
    </header>
  `,
  data:function(){
    return {
      newTodo:""
    }
  },
  methods:{
    addTodo:function(){
      this.newTodo = this.newTodo.trim()
      if (!this.newTodo) {
        return
      }
      this.$store.commit('add',this.newTodo)
      this.newTodo=''
    }
  }
})