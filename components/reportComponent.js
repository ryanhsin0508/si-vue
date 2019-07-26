var reportData = getData('Api/reportList/', 'post', '');
var aData = getData('Api/mb001/P11/', 'post', '');
console.log(reportData)
console.log(aData)
var overlayData;
var stringsData = getString();
// var reportData = JSON.parse(reportData);
var titleArr = [
  ['更新時間', 'create_dt'],
  ['產品名稱', 6],
  ['批號', 1],
  ['報告編號', 3],
  ['報告日期', 2],
  ['檢驗日期', 10]
];
var widthArr = [];

Vue.component('reportComponent', {
  props: ['updatePager'],
  mixins: [tableMixin],
  data() {
    return {
      list: reportData,
      titleArr,
      itemFrom: 0,
      itemTo: 14,
      pager: 0
    }
  },
  template: `
  <div class="width-limiter">
    <div class="heading">
      <h2>檢驗報告管理</h2>
      <a class="btn btn-add" href="javascript:;" @click="$emit('overlay', 'addReport', '')">新增</a>
    </div>
    <table class="table-st1">
      <thead>
      <tr>
        <th v-for="(arr, index) in titleArr">{{titleArr[index][0]}}</th>
        <th></th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in list">
          <td v-for="(arr, index) in titleArr">
            <template v-if="titleArr[index][1] == 'create_dt'">{{item[titleArr[index][1]] | date}}</template>
            <template v-else>{{item[titleArr[index][1]]}}</template>
          </td>
          <td>
            <ul class="btns flex">
              <li><a class="btn-box gray small" href="javascript:;" @click="$emit('overlay', 'previewInspect', item)">預覽</a></li>
              <li><a class="btn-box blue small"  href="javascript:;" @click="$emit('overlay', 'addReport', item)">編輯</a></li>
              <li><a class="btn-box red small"  href="javascript:;" @click="$emit('overlay', 'delReport', item['p_number']+'/'+ item['b_number']+'/'+item['s_number'])">刪除</a></li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `,
  methods: {
    showInfo(info){
      console.log(`${host}post.html${info['p_number']}/${info['b_number']}/${info['s_number']}`)
      location.href=`${host}post.html?api=${info['p_number']}/${info['b_number']}/${info['s_number']}`
    }
  },
  computed: {

  },
  mounted() {}
});