var userData = getData('Api/user/', 'post', '');
console.log(userData)
var overlayData;
var stringsData = getString();
// var reportData = JSON.parse(reportData);
var titleArr = [
  ['更新時間', 'update_dt'],
  ['帳號', 'act'],
  ['名稱', 'name']
];
var roleArr = [
  '系統管理者',
  '未啟用',
  '品保人員',
  '研發人員'
];

Vue.component('userComponent', {
  props: ['updatePager'],
  mixins: [tableMixin],
  data() {
    return {
      list: userData,
      titleArr,
      roleArr,
      itemFrom: 0,
      itemTo: 14,
      pager: 0,
      optActive: undefined
    }
  },
  template: `
  <div class="width-limiter">
    <div class="heading">
      <h2>帳號管理</h2>
      <a class="btn-box blue" href="javascript:;" @click="add(roleArr)">新增</a>
    </div>
    <div class="table-filter" @click="showFilterDropdown ? showFilterDropdown=false : showFilterDropdown=true">{{titleArr[primary][0]}}</div>
    <table class="table-st1">
      <thead v-show="showFilterDropdown">
      <tr>
        <th v-for="(arr, index) in titleArr" @click="changePrimary(index)">{{titleArr[index][0]}}</th>
        <th>角色名稱</th>
        <th v-show="$root.window.width > 640"></th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(item, listIndex) in list">
          <td v-for="(arr, index) in titleArr">
            <template v-if="titleArr[index][1] == 'update_dt'">
              <template v-if="item[titleArr[index][1]]">{{item[titleArr[index][1]]}}</template>
              <template v-else>{{item['create_dt']}}</template>
            </template>
            <template v-else>{{item[titleArr[index][1]]}}</template>
          </td>
          <td>
            <div class="custom-select bordered">
              <h3 class="ttl" @click="optActive = optActive >= 0 ? undefined : listIndex">
                {{roleArr[item['role_id'] - 1]}}
              </h3>
              <ul class="opt" v-show="optActive == listIndex">
                <li 
                  v-for="(opt, index) in roleArr"
                  @click="updateRole(item['id'], index+1, listIndex)"
                >
                  {{opt}}
                </li>
              </ul>
            </div>
            
          </td>
          <td>
            <ul class="btns flex center">
              <li><a class="btn-box red small"  href="javascript:;" @click="$emit('overlay', 'delUser', item['id'])">刪除</a></li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `,
  methods: {

    previewInspect(item) {
      vm.loadingVisible = true;
      setTimeout(() => {

        this.$emit('overlay', 'previewInspect', item)
      }, 1)
    },
    add(r) {
      this.$emit('overlay', 'addUser', r)
    },
    modify(info) {
      console.log(`${host}post.html${info['p_number']}/${info['b_number']}/${info['s_number']}`)
      location.href = `${host}post.html?api=${info['p_number']}/${info['b_number']}/${info['s_number']}`
    },
    updateRole(id, role_id, listIndex) {
      console.log(this.list[listIndex])
      let token = getToken();
      this.list[listIndex].role_id = role_id
      console.log(token)
      this.optActive = null;
      console.log(id)
      $.ajax({
        url: '/si/Api/putgroup',
        method: "POST",
        data: { 'id': id, 'role_id': role_id },
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function(data) {
          return true;
        },
        error: function(xhr) {
          console.log(error);
        }
      });
    }
  },
  computed: {

  },
  mounted() {}
});
Vue.component('detailBox', {
  props: ['info', 'pos'],
  data() {
    return {
      data: {}
    }
  },
  template: `
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
  beforeMount() {
    this.data = getData(`Api/infodetail/${this.info[0]}/${this.info[1]}/${encodeURI(this.info[3])}`, 'post')
  }
})