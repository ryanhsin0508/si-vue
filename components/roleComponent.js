var roleData = getData('Api/role/', 'post', '');
console.log(roleData)
var overlayData;
var stringsData = getString();
// var reportData = JSON.parse(reportData);
var titleArr = [
  ['更新時間', 'update_dt'],
  ['角色名稱', 'title']
];


Vue.component('roleComponent', {
  props: ['updatePager'],
  mixins: [tableMixin],
  data() {
    return {
      list: roleData,
      titleArr,
      itemFrom: 0,
      itemTo: 14,
      pager: 0,
      optActive: undefined
    }
  },
  template: `
  <div class="width-limiter">
    <div class="heading">
      <h2>權限管理</h2>
      <a class="btn-box blue" href="javascript:;" @click="add(list.length)">新增</a>
    </div>
    <div class="table-filter" @click="showFilterDropdown ? showFilterDropdown=false : showFilterDropdown=true">{{titleArr[primary][0]}}</div>
    <table class="table-st1">
      <thead v-show="showFilterDropdown">
      <tr>
        <th v-for="(arr, index) in titleArr" @click="changePrimary(index)">{{titleArr[index][0]}}</th>
        <th>角色權限</th>
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
            <template v-for="(v,k,i) in item['permissions']">
              <template v-if="i < Object.keys(item['permissions']).length - 1">{{v}}、</template>
              <template v-else>{{v}}</template>
            </template>
            
          </td>
          <td>
            <ul class="btns flex center">
              <li><a class="btn-box blue small"  href="javascript:;" @click="modify(item)">編輯</a></li>
              <li><a class="btn-box red small"  href="javascript:;" @click="$emit('overlay', 'delGroup', item['id'])">刪除</a></li>
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  `,
  methods: {
    add(l) {

      this.$emit('overlay', 'role', l+1)
    },
    modify(item) {
      // vm.loadingVisible = true;
      this.$emit('overlay', 'role', item)
    },
    updateRole(id, role_id, listIndex) {
      console.log(this.list[listIndex])
      let token = getToken();
      this.list[listIndex].role_id = role_id
      console.log(token)
      this.optActive = null;
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