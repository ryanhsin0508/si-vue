var headerComponent = {
  template: `
    
  `,
  data() {
    return {
    }
  },
}
Vue.component('headerComponent', {
  template:`
    <header>
      <nav>
        <div class="width-limiter">
          <h2>品保檢驗系統</h2>
          <ul>
            <li><a href="${host}product.html">產品資訊</a></li>
            <li><a href="${host}report.html">檢驗報告</a></li>
            <li><a href="${host}info.html">檢驗資料</a></li>
          </ul>
        </div>
      </nav>
    </header>
  `,
  method:{
    toggleActive(){

    }
  }
})