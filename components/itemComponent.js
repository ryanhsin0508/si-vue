var productData = getData('Api/invmb/', 'Api/invmb', '');
var overlayData;
var stringsData = getString();
// var productData = JSON.parse(productData);
var titleArr = [['更新時間',7],['產品名稱',1],['產品規格',2],['產品號碼',0]];

Vue.component('itemComponent', {
  props:['updatePager'],
  data() {
    return {
      list: productData,
      titleArr,
      itemFrom:0,
      itemTo:14,
      pager:0
    }
  },
  template: `
  <div class="width-limiter">
    <div class="heading">
      
    </div>
    <table class="table-st1">
      <thead>
      <tr>
        <th v-for="(arr, index) in titleArr">{{titleArr[index][0]}}</th>
        <th>檢驗預設值</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" v-if="index < 100">
          <td v-for="(arr, index) in titleArr">{{item[titleArr[index][1]]}}</td>
          <td><a href="javascript:;" @click="showOverlay(item[0])">{{item[0]}}</a></td>
        </tr>
      </tbody>
    </table>
  </div>
  `,
  methods:{
    say(){
      alert('asd')
    },
    showOverlay(id){
      overlayData = getData('Api/exdelist/' + id, 'Api/exdelist/' + id, '');
      console.log(overlayData)
    }
  },
  computed:{

  },
  mounted(){
    $('.table-st1').DataTable( {
            "order": [[ 0, "desc" ]],
            "lengthMenu": [[15, 50, 100, -1], [15, 50, 100, "All"]]
        } );
  }
});

Vue.component('overlayComponent',{
  data(){
    return{
      data:overlayData
    }
  },
  template:`

  `
})