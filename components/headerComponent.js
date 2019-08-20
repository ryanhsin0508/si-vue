var headerComponent = {
  template: `
    
  `,
  data() {
    return {
      active:false
    }
  },
}
Vue.component('headerComponent', {
  data() {
    return {
      active:false
    }
  },
  template:`
    <header>
      <nav>
        <div class="width-limiter">
          <h2>品保檢驗系統</h2>
          <ul v-show="active || $root.window.width > 640">
            <li><a href="${host}product.html">產品資訊</a></li>
            <li><a href="${host}report.html">檢驗報告</a></li>
            <li><a href="${host}item.html">檢驗資料</a></li>
            <li><a href="${host}role.html">權限管理</a></li>
            <li><a href="${host}user.html">帳號管理</a></li>
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
  method:{
    toggleActive(){

    }
  }
})