var productData = getData('Api/invmb/', 'Api/invmb', '');
var overlayData;
var stringsData = getString();
// var productData = JSON.parse(productData);
var titleArr = [
  ['更新時間', 7],
  ['產品名稱', 1],
  ['產品規格', 2],
  ['產品號碼', 0]
];
var widthArr = [];

Vue.component('productComponent', {
  props: ['updatePager'],
  mixins: [tableMixin],
  data() {
    return {
<<<<<<< Updated upstream
=======
      
>>>>>>> Stashed changes
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
    <div class="table-filter" @click="showFilterDropdown ? showFilterDropdown=false : showFilterDropdown=true">{{titleArr[primary]['name']}}</div>
    <table class="table-st1">
      <thead v-show="showFilterDropdown">
      <tr>
<<<<<<< Updated upstream
        <th v-for="(arr, index) in titleArr">{{titleArr[index][0]}}</th>
        <th>檢驗預設值</th>
=======
        <th
          v-for="(arr, index) in titleArr" 
          @click="changePrimary(index)"
          :class="arr['className']"
        >
          {{titleArr[index]['name']}}
        </th>
        <th class="hide-640">檢驗預設值</th>
>>>>>>> Stashed changes
      </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" v-if="item[1]">
          <td v-for="(arr, index) in titleArr">
            <template v-if="titleArr[index][1] == '7'">{{item[titleArr[index][1]] | date}}</template>
            <template v-else>{{item[titleArr[index][1]]}}</template>
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
    }
  },
  computed: {

  },
  mounted() {
    console.log('ooo')
    
    
  }
});