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
      <a class="btn-box blue" href="javascript:;" @click="$emit('overlay', 'add')">新增</a>
    </div>
    <table class="table-st1">
      <thead>
      <tr>
        <th v-for="(arr, index) in titleArr" width="20%">{{titleArr[index][0]}}</th>
        <th>檢驗預設值</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list" v-if="item[1]">
          <td v-for="(arr, index) in titleArr">
            <template v-if="titleArr[index][1] == '7'">{{item[titleArr[index][1]] | date}}</template>
            <template v-else>{{item[titleArr[index][1]]}}</template>
          </td>
          <td><a href="javascript:;" @click="$emit('overlay', 'inspectItems', item)"><i class="fa fa-database fa-2x"></i></a></td>
        </tr>
      </tbody>
    </table>
  </div>
  `,
  methods: {
    test() {
      alert('asd')
      this.$emit('test')
    }
  },
  computed: {

  },
  mounted() {
    console.log('ooo')
    
    
  }
});