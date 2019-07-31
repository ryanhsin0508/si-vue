var productData = getData('Api/invmb/', 'Api/invmb', '');
var overlayData;
var stringsData = getString();
// var productData = JSON.parse(productData);

var titleArr = [
  {
    'name': '更新時間',
    'key': 7,
    'className': 'update_time'
  },
  {
    'name': '產品名稱',
    'key': 'MB002',
    'className': 'name'
  },
  {
    'name': '產品規格',
    'key': 'MB003',
    'className': 'spec'
  },
  {
    'name': '產品號碼',
    'key': 'MB001',
    'className': 'p_number'
  },
]
var widthArr = [];

Vue.component('productComponent', {
  props: ['updatePager'],
  mixins: [tableMixin],
  data() {
    return {
      primary:1,
      list: productData,
      titleArr,
      itemFrom: 0,
      itemTo: 14,
      pager: 0
    }
  },
  template: `
  <div class="width-limiter">
    <div class="heading">
      <h2>產品基本資料</h2>
      <a class="btn-box blue" href="javascript:;" @click="add">新增</a>
    </div>
    <table class="table-st1">
      <thead>
      <tr>
        <th
          v-for="(arr, index) in titleArr" 
          
          :class="arr['className']"
        >
          {{titleArr[index]['name']}}
        </th>
        <th class="hide-640">檢驗預設值</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" v-if="item[1]">
          <td v-for="(arr, index) in titleArr"
            :class="[arr['className'], {primary:primary == index}]"
          >
            <template v-if="arr['key'] == '7'">{{item[titleArr[index]['key']] | date}}</template>
            <template v-else>{{item[titleArr[index]['key']]}}</template>
          </td>
          <td class="text-center"><a href="javascript:;" @click="inspect(item)"><i class="fa fa-database fa-2x"></i></a></td>
        </tr>
      </tbody>
    </table>
  </div>
  `,
  methods: {
    add() {
      
      this.$emit('overlay', 'add')
    },
    inspect(item) {
      vm.loadingVisible = true;
      setTimeout(()=>{

      this.$emit('overlay', 'inspectItems', item)
    },1)
    },
    changePrimary(i){
      this.primary = i
    }
  },
  computed: {

  },
  mounted() {
    console.log('ooo')
    
    
  }
});