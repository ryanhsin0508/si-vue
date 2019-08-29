let menu,features;
if(!sessionStorage.menu){
  location.replace('login.html');
} else {
  menu = JSON.parse(sessionStorage.getItem('menu'));
  features = JSON.parse(sessionStorage.getItem('features'));
}
Vue.component('headerComponent', {
  data() {
    return {
      active:false,
      menu,
      features
    }
  },
  template:`
    <header>
      <nav>
        <div class="width-limiter">
          <h2>品保檢驗系統</h2>
          <ul v-show="active || $root.window.width > 640">
            <li v-for="(item, key) in menu">
              <a :href="key.toLowerCase() + '.html'">{{item}}</a>
            </li>
            <li><a href="" @click.prevent="logout">登出</a></li>
          </ul>
          <button
            class="btn-menu" 
            @click.prevent="active ? active = false : active = true"
            v-if="$root.window.width <= 640"
          ><span></span>
          </button>
        </div>
      </nav>
    </header>
  `,
  methods:{
    logout(){
      sessionStorage.clear();
      location.replace('login.html');
    }
  }
})