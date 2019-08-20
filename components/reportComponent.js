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
  ['檢驗數','num'],
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
      pager: 0,
      showDetail: null,
      showDetailPos: {
        X:0,
        Y:0
      }
    }
  },
  template: `
  <div class="width-limiter">
    <div class="heading">
      <h2>檢驗報告管理</h2>
      <a class="btn-box blue" href="javascript:;" @click="add">新增</a>
    </div>
    <div class="table-filter" 
      @click="showFilterDropdown ? showFilterDropdown=false : showFilterDropdown=true"
    >{{titleArr[primary][0]}}</div>
    <table class="table-st1 dataTable">
      <thead v-show="showFilterDropdown">
      <tr>
        <th v-for="(arr, index) in titleArr"
          @click="changePrimary(index)"
        >{{titleArr[index][0]}}</th>
        <th v-show="$root.window.width > 640"></th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(item, listIndex) in list">
          <td v-for="(arr, index) in titleArr"
            :class="[{'text-blue text-center':titleArr[index][1] == 'num'}]"
            @mouseover="$root.window.width > 640 && titleArr[index][1] == 'num' && item[titleArr[index][1]] != 0 ? showDetailHandler($event ,listIndex) : this.showDetail = null" @mousemove="detailPosHandler($event)" @mouseout="showDetail = null">
            <template v-if="titleArr[index][1] == 'create_dt'">{{item[titleArr[index][1]] | date}}</template>
            <template v-else>{{item[titleArr[index][1]]}}</template>
            <detail-box :info="item" :pos="showDetailPos" v-if="titleArr[index][1] == 'num' && showDetail == listIndex"></detail-box>
          </td>
          <td>
            <ul class="btns flex center">
              <li><a class="btn-box gray small" href="javascript:;" @click="previewInspect(item)">預覽</a></li>
              <li><a class="btn-box blue small"  href="javascript:;" @click="modify(item)">編輯</a></li>
              <li><a class="btn-box red small"  href="javascript:;" @click="$emit('overlay', 'delReport', item['p_number']+'/'+ item['b_number']+'/'+item['s_number'])">刪除</a></li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `,
  methods: {
    detailPosHandler(e){
      // console.log(e)
      this.showDetailPos.X = e.offsetX+10;
      this.showDetailPos.Y = e.offsetY;
    },
    showDetailHandler(e, i){
      // console.log(e)
      
      this.showDetail = i;
    },
    detailCloseHandler(){
      this.showDetail = null;
    },
    previewInspect(item){
        vm.loadingVisible = true;
        setTimeout(()=>{

        this.$emit('overlay', 'previewInspect', item)
      },1)
    },
    add(){
      location.href=`${host}post.html`
    },
    modify(info){
      console.log(`${host}post.html${info['p_number']}/${info['b_number']}/${info['s_number']}`)
      location.href=`${host}post.html?api=${info['p_number']}/${info['b_number']}/${info['s_number']}`
    }
  },
  computed: {

  },
  mounted() {}
});
Vue.component('detailBox',{
  props:['info', 'pos'],
  data(){
    return {
      data:{}
    }
  },
  template:`
  <transition name="modal">
    <div class="detail-box" :style="{left:pos.X+'px', top:pos.Y+'px'}" @mousemove.stop>
      <ul>
        <li v-for="item in data">
          <span>{{item['name']}}</span>
          <span>{{item['unit']}}</span>
          <span
          :class="{
            'exceed': parseInt(item['result']) > parseInt(item['upper']),
            'below': parseInt(item['result']) < parseInt(item['lower'])
          }"
          >{{item['result']}}</span>
        </li>
      </ul>
    </div>
  </transition>
  `,
  beforeMount(){
    this.data = getData(`Api/infodetail/${this.info[0]}/${this.info[1]}/${encodeURI(this.info[3])}`, 'post')
  }
})