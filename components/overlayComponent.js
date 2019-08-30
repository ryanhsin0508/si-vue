Vue.component('modal', {
  props: ['overlayData'],
  template: `
<transition name="modal">
  <div class="modal-mask" @click="$emit('close')">
    <div class="modal-wrapper">
      <div class="modal-container" @click.stop>

        <div class="modal-header">
          <h3>{{overlayData.title}}</h3>
          <button class="btn-close" @click="$emit('close')"></button>
        </div>

        <div class="modal-body">
          <add-form-component v-if="overlayData.type == 'add'"></add-form-component>
          <inspect-items-component v-if="overlayData.type == 'inspectItems'" :info="overlayData.info"></inspect-items-component>
          <preview-inspect-component v-if="overlayData.type == 'previewInspect'" :info="overlayData.info"></preview-inspect-component>
          <add-report-component v-if="overlayData.type == 'addReport'" :info="overlayData.info ? overlayData.info : ''"></add-report-component>
          <edit-permission-component v-if="overlayData.type == 'role'" :info="overlayData.info ? overlayData.info : ''"></edit-permission-component>
          <alert-msg-component v-if="overlayData.type == 'delReport'" @close="$emit('close')" :info="overlayData.info"></alert-msg-component>
          <add-user-component v-if="overlayData.type == 'addUser'" @close="$emit('close')" :info="overlayData.info"></add-user-component>
          <del-user-component v-if="overlayData.type == 'delUser'" @close="$emit('close')" :info="overlayData.info"></del-user-component>
          <del-group-component v-if="overlayData.type == 'delGroup'" @close="$emit('close')" :info="overlayData.info"></del-group-component>
          <success-msg-component v-if="overlayData.type == 'success'"></success-msg-component>
        </div>


      </div>
    </div>
    <!-- split -->
  </div>
</transition>
`,
  methods: {
    updatePager: function() {
      alert('asd')
    }
  }
})
Vue.component('addFormComponent', {
  data() {
    return {
      overlayData: {
        MB001: "",
        MB002: "",
        MB003: ""
      }
    }
  },
  mixins: [formMixin],
  template: `
<form class="custom-input" action="/si/Api/addInvmb" method="post" @submit.prevent="onSubmit">
  <ul>
    <li><input type="text" class="form-control" name="MB001" minlength="10" placeholder="產品號碼" v-model="overlayData.MB001" required></li>
    <li><input type="text" class="form-control" name="MB002" placeholder="產品名稱" v-model="overlayData.MB002" required></li>
    <li><input type="text" class="form-control" name="MB003" placeholder="產品規格" v-model="overlayData.MB003"></li>
  </ul>
  <div class="flex center"><button type="submit" class="btn-box blue">儲存</button></div>
</form>
`,
  methods: {


  }
})
Vue.component('inspectItemsComponent', {
  props: ['info'],
  mixins: [formMixin, modifyMixin],
  data() {
    return {
      titleArr: [
        ['檢驗名稱', 'name'],
        ['單位', 'unit'],
        ['上標', 'upper'],
        ['下標', 'lower'],
        ['生效日期', 'eff_day', 'date']
      ],
      overlayData: {}
    }
  },
  template: `
  <div>
    <h2 class="pl10 pr10 mb10">{{this.info[1]}} - {{this.info[2]}}</h2>
    <form action="/si/Api/itemdetail" method="post" @submit.prevent="onSubmit">
      <ul class="btns pl10 pr10 flex between">
        <li><button class="btn-box green" @click.prevent="checkPermission('Info', 'upd') ? addRow(titleArr) : permissionDeny()" :disabled="!(checkPermission('Info', 'upd'))">新增檢驗品項</button></li>
        <li><button class="btn-box blue" type="submit" :disabled="!(checkPermission('Info', 'upd'))">儲存</button></li>
      </ul>
      <div class="form-table">
        <table class="table-input">
          <thead class="hide-m">
            <tr :class="'grid' + titleArr.length">
              <th v-for="(item, index) in titleArr">{{item[0]}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(list, listIndex) in overlayData">
              <td v-for="(item, index) in titleArr">
                <span class="title-mobile">{{item[0]}}</span>
                <input type="text" v-model="list[item[1]]"
                :class="item[2] ? item[2]+'-single' : ''" 
                :data-index="parseInt(Number(listIndex)+1)"
                :name="'detail[' + parseInt(Number(listIndex)+1) + '][' + item[1] + ']'"
                autocomplete="off"
                @click.stop="hideOtherDate"
                />
              </td>
              <td>
                <button
                  class="btn-remove"
                  @click.prevent="overlayData.splice(listIndex, 1)"
                  :disabled="!(checkPermission('Info', 'upd'))"
                  :title="!(checkPermission('Info', 'upd')) ? '權限不足' : ''"
                ></button>
              </td>
            </tr>

          </tbody>
        </table>
        
      </div>
    </form>
  </div>
  `,
  methods:{
    hideOtherDate(){
      $('.date-picker-wrapper').not(':hidden').hide();
    }
  },
  beforeCreate(){
    vm.loadingVisible = true;
  },
  beforeMount() {
    //inspectItemsComponent
    console.log('asdfhuio')
    
    this.overlayData = getData('Api/exdelist/' + this.info[0], 'post' + this.info[0], '')
  },
  mounted(){
    vm.loadingVisible = false;
    this.addRow(this.titleArr)
  }
})
Vue.component('previewInspectComponent', {
  props: ['info'],
  mixins: [formMixin],
  data() {
    return {
      titleArr: [
        ['品號', 0],
        ['品名', 6],
        ['單位', 7],
        ['報告日期', 2],
        ['檢驗日期', 10]
      ],
      inspectArr: [
        ['檢驗項目', 'name'],
        ['單位', 'unit'],
        ['結果', 'result'],
        ['上標', 'upper'],
        ['下標', 'lower']
      ],
      overlayData: {},
      hasImgPreview: false
    }
  },
  template: `
  <div class="preview-inspect-component inspect-table">
    <div class="top">
      <ul>
      <li v-for="(arr, index) in titleArr">{{arr[0]}}: {{info[arr[1]]}}</li>
      </ul>
      <div class="img-preview" v-show="hasImgPreview">
        <div class="show">
        </div>
      </div>
      <div class="print"><a href="" @click.prevent="print">列印檢驗資訊</a></div>
    </div>
    <div>
      <table class="table-st1 no-mobile">
        <thead>
          <tr>
            <th v-for="arr in inspectArr">{{arr[0]}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="list in overlayData">
            <td
              v-for="arr in inspectArr"
              :class="{
                'exceed': arr[1] == 'result' && parseInt(list['result']) > parseInt(list['upper']),
                'below': arr[1] == 'result' && parseInt(list['result']) < parseInt(list['lower'])
              }"
            >{{list[arr[1]]}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
  methods:{
    print(){
      var value = $('.inspect-table').html();
      var newHTML = $('<table>').append(value)
      // newHTML = newHTML.find('a').remove()
      newHTML.find('a').addClass('hide');
      console.log(newHTML.html())
      var printPage = window.open("","printPage","");
      printPage.document.open();
      printPage.document.write("<HTML><head><link rel='stylesheet' href='css/table.css' /></head><body onload='window.print();window.close()'>");
      printPage.document.write(newHTML.html());
      printPage.document.close("</body></HTML>");
    }
  },
  beforeCreate(){
    console.log('aaa')
    vm.loadingVisible = true;
  },
  beforeMount() {
    this.overlayData = getData(`Api/infodetail/${this.info[0]}/${this.info[1]}/${encodeURI(this.info[3])}`, 'post')
    // this.overlayData = getDa;
  },
  mounted(){
    vm.loadingVisible = false;
    if (this.overlayData[0].filename) {
      this.hasImgPreview = true;
      let url = this.overlayData[0].filename;
      
      let ext = url.substr(url.lastIndexOf('.')+1);
      console.log(`${apiHost}uploads/${url}`)
      console.log(ext)
      
      $('.img-preview').append(
        $('<a>').attr(
          {
            'href': `${apiHost}uploads/${url}`,
            'target': '_blank'
          }
        ).html(url)
      )
    }
  }
})
/*t3-2*/
Vue.component('addReportComponent', {
  props: ['info'],
  mixins: [formMixin, modifyMixin],
  data() {
    return {

      overlayData: {},
      basicProps: {
        active: this.info ? false : true
      },
      inspectProps: {
        active: true
      },
      titleArr: [
        ['品號', 'p_number', ''],
        ['批號', 'b_number', ''],
        ['報告編號', 's_number', ''],
        ['報告日期', 'reportdt', 'date'],
        ['檢驗日期', 'examinedt', 'date'],
        ['有效日期', 'e_day', ''],
        ['緊急送件', 'urgent', '']
      ],
      formData: {
        p_number: '',
        b_number: '',
        s_number: '',
        reportdt: '',
        examinedt: '',
        e_day: ''
      },
      inspectTitleArr: [
        ['檢驗目的', 'purpose'],
        ['檢驗單位', 'inspection']
      ],
      inspectTableTitleArr: [
        ['檢驗項目', 'name'],
        ['檢驗值', 'result'],
        ['單位', 'unit'],
        ['上標', 'upper'],
        ['下標', 'lower'],
        ['金額', 'amount'],
        ['','show']
      ],
      timer: '',
      candi_p: []
    }
  },
  template: `
  <form action="/si/Api/infoadd" class="form-st1" method="post" @submit.prevent="onSubmit" enctype="multipart/form-data">
    <h2 class="accor-ttl" :class="{active : basicProps.active}" @click="toggleActive('basicProps')">基本資料</h2>
    <div class="content">
      <div class="custom-input" style="float:left;">
        <ul>
          <li v-for="item in titleArr" :class="item[1] == 'urgent' ? 'custom-checkbox' : ''">
            <h3 class="ttl">{{item[0]}}</h3>
            <input
            v-model="formData[item[1]]"
            :type="item[1] == 'urgent' ? 'checkbox' : 'text'"
            :name="item[1]"
            :class="item[2] ? item[2]+'-single' : ''"
            :autocomplete="item[2] ? 'off' : 'on'"
            :readonly="info != '' && (item[1] == 'p_number' || item[1] == 'b_number' || item[1] == 's_number')"
            :required="item[1] == 'p_number' || item[1] == 'b_number' || item[1] == 's_number'"
            @keydown="keyDown"
            @keyup="keyUp(item[1])"
            />
            <ul class="candidate" v-if="item[1] == 'p_number' && candi_p.length > 0">
              <li v-for="item in candi_p" @click="selectCandidate('p_number', item)">
                {{item}}
              </li>
            </ul>
          </li>
          <li>
            <h3 class="ttl">報告掃描檔</h3>
            <input type="file" name="img" class="file-input" multiple data-show-upload="false" data-show-caption="true" />
          </li>
        </ul>
      </div>
      <div class="img-preview" style="float:right;">
        <div class="show" style="height:360px;"></div>
      </div>
    </div>
    <ul class="btns overlay-submit-btns">
      <li><button class="btn-box blue" type="submit">儲存</button></li>
    </ul>
    <h2 class="accor-ttl" :class="{active : inspectProps.active}" @click="toggleActive('inspectProps')">檢驗項目</h2>
    <div class="content">
      <div class="custom-input">
        <ul>
          <li v-for="item in inspectTitleArr">
            <h3 class="ttl">{{item[0]}}</h3>
            <input
            :name="'detail[1]['+item[1]+']'"
            type="text"
            v-model="formData[item[1]]"
            @keydown="keyDown"
            @keyup="keyUp(item[1])"
            required
            />
          </li>
        </ul>
      </div>
      <ul class="btns flex pl10 pb10">
        <li><button class="btn-box green" @click.prevent="addRow(inspectTableTitleArr)">新增檢驗值</button></li>
        <li><button class="btn-box green" @click.prevent="defInspectItems">帶入預設檢驗品項</button></li>
      </ul>

      <div class="form-table">
        <table class="table-input">
          <thead>
            
            <tr class="grid6">

              <th v-for="item in inspectTableTitleArr" v-if="item[1] != 'show'"">
                {{item[0]}}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(inspectItem, index) in overlayData">
              <td v-for="item in inspectTableTitleArr" v-if="item[1] != 'show'"">
                <input
                type="text"
                :name="'detail[' + parseInt(Number(index)+1) + '][' + item[1] + ']'"
                v-model="inspectItem[item[1]]">
              </td>
              <td>
                <button 
                  
                  class="btn-show"
                  @click.prevent="inspectItem['show'] == 'y' ? inspectItem['show'] = 'n' : inspectItem['show'] = 'y'">
                  <i class="fas" :class="inspectItem['show'] == 'y' ? 'fa-eye' : 'fa-eye-slash'" ></i>
                </button>
                <button 
                @click.prevent="overlayData.splice(index, 1)"
                ><i class="fas fa-trash-alt"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </form>
  `,
  methods: {
    toggleActive(t) {
      let status = this[t].active ? false : true;
      this[t].active = status;

    },
    selectCandidate(target, val) {
      this.formData[target] = val;
      this.candi_p = [];
    },
    defInspectItems() {
      let arr = getData('Api/exdelist/' + this.info[0], 'post' + this.info[0], '')
      let len = arr.length;
      this.overlayData.pop()
      for (i in arr) {
        this.overlayData.splice(len - 1, 0, arr[i])
      }
      this.addRow(titleArr);
      this.defInspectItems = () => {};
      // this.overlayData.push(getData('Api/exdelist/' + this.info[0], 'post' + this.info[0], ''))
    },
    keyDown() {
      clearTimeout(this.timer);

    },
    keyUp(name) {
      if (name == 'p_number' || name == 'b_number') {
        let f = '';
        if (name == 'p_number') {
          f = 'mb001';
        }
        if (name == 'b_number') {
          f = 'me001/' + this.formData['p_number'];
        }
        this.timer = setTimeout(() => {
          let val = this.formData[name];
          if (val.length > 1) {
            this.candi_p = getData(`Api/${f}/${val}/`, 'post', '')
          }
        }, 500)
      }
    },
    checkTyping() {

    }
  },
  beforeMount() {
    console.log(this.info)
    this.overlayData = getData(`Api/infodetail/${this.info[0]}/${this.info[1]}/${encodeURI(this.info[3])}`, '')
    if (this.overlayData.length) {
      this.formData = this.overlayData[0]
    }
  },
  updated(){
    //convert true / false to digit

    this.formData.urgent = this.formData.urgent ? +this.formData.urgent : 0;
    // console.log(this.formData.urgent)
  },
  computed:{
    
  },
  mounted() {
    this.addRow(this.inspectTableTitleArr)
    $('.file-input').fileinput({
        theme: 'fa',
        uploadUrl: '#',
        allowedFileExtensions: ['jpg', 'pdf']
    })
    let projectfileoptions = {
      showUpload: false,
      showRemove: false,
      language: 'zh',
      allowedPreviewTypes: ['image'],
      allowedFileExtensions: ['jpg', 'png', 'gif'],
      maxFileSize: 2000,
    }
    
    if (this.formData.filename) {
      let url = this.formData.filename;
      
      let ext = url.substr(url.lastIndexOf('.')+1);
      console.log(ext)
      if(ext == 'pdf'){
        let opt = {
          pdfOpenParams: {
            pagemode: "thumbs",
            navpanes: 0,
            toolbar: 0,
            statusbar: 0,
            view: "FitV"
          }
        }
        let PDF = PDFObject.embed(`${apiHost}uploads/${url}`, '.img-preview .show', opt);
      }
      if(ext == 'jpg'){
        $('.img-preview').append(
          $('<img>').attr({
            'src': `${apiHost}uploads/${url}`,
            'style': 'max-width:300px'
          })
        )
      }
      $('.img-preview').append(
        $('<a>').attr(
          {
            'href': `${apiHost}uploads/${url}`,
            'target': '_blank'
          }
        ).html(url)
      )
    }
  }
})
Vue.component('editPermissionComponent',{
  props: ['info'],
  mixins: [formMixin, modifyMixin],
  data() {
    return {
      titleArr: [ 
        ["產品資訊","Info"],
        ["檢驗資料","Item"],
        ["檢驗報告","Report"],
        ["權限管理","Role"],
        ["帳號管理","User"]
      ],
      perArr:[
        ["新增","ins"],
        ["修改","upd"],
        ["刪除","del"],
        ["匯出","dow"]
      ],
      pers:{
        Info:"產品資訊",
        Item:"檢驗資料",
        Report:"檢驗報告",
        Role:"權限管理",
        User:"帳號管理",
      },
      overlayData: {
        features:{

        }
      },
      formData:{
        permissions:{
          // Info:true
        },
        features:{
          Info:{},
          Item:{},
          Report:{},
          Role:{},
          User:{},
        },
        title:''
      }
    }
  },
  template: `
  <div>
    <form class="form-st1" action="/si/Api/upGroup" method="post" @submit.prevent="onSubmit">
      <ul class="btns pl10 pr10 flex end">
        <li><button class="btn-box blue" type="submit">儲存</button></li>
      </ul>
      <div class="custom-input">
        <ul>
          <li>
            <h3 class="ttl">角色名稱</h3>
            <input type="text" v-model="formData.title" />
          </li>
          <li>
            <h3 class="ttl">角色權限</h3>
            <ul style="margin-right:30px;margin-left: 10px;">
              <li v-for="item in titleArr" class="flex v-center" style="height:40px;">
                <input :id="item[1]" type="checkbox" v-model="formData.permissions[item[1]]" /><label :for="item[1]">{{item[0]}}</label>
                <ul class="flex v-center" style="margin-left:10px">
                  <li v-for="per in perArr" class="flex v-center" style="margin-right:10px;height:40px;margin-bottom:0;line-height">
                  <input 
                    :id="item[1] + '-' + per[1]" 
                    :class="{active:false}"
                    type="checkbox" 
                    v-model="formData.features[item[1]][per[1]]" 
                  />
                  <label :for="item[1] + '-' + per[1]">{{per[0]}}</label>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </form>
  </div>
  `,
  methods:{
    hideOtherDate(){
      $('.date-picker-wrapper').not(':hidden').hide();
    }
  },
  beforeCreate(){
    vm.loadingVisible = true;
  },
  beforeMount() {
    //inspectItemsComponent
    console.log('asdfhuio')
    if(!this.info.id){
      return
    }
    let o = {"id": this.info.id}
    this.overlayData = getData('Api/getGroup', 'post', '', o)
    this.formData.title = this.overlayData.title;
    $.each(this.overlayData.permissions, (k,v)=>{
      this.formData.permissions[k] = true
      // console.log()
    })
    $.each(this.overlayData.features, (k,v)=>{
      console.log(k)
      for(f in v){
        this.formData.features[k][v[f]] = true
      }
      // this.formData.features[k] = v;
    })
  },
  mounted(){
    vm.loadingVisible = false;
    // this.addRow(this.titleArr)
  }
})
Vue.component('msgComponent',{
  props:['type'],
  template:`
  <transition name="fade">
    <div class="msg-overlay">
      <div class="wrapper">
        <div class="container">
          <success-msg-component v-if="type == 'success'"></success-msg-component>
          <button class="btn-box center" @click="$emit('close')">確定</button>
        </div>
      </div>
    </div>
    </transition>
  `,
  mounted(){
    setTimeout(()=>{
      vm.msgVisible = false;
    },1000)
  }
})
Vue.component('loadingComponent',{
  template:
  `
  <div class="loading">
    <div class="text">Loading...</div>
  </div>
  `,


})
Vue.component('delMsgComponent',{
  template:`
    <div class="title"></div>
  `
})
Vue.component('alertMsgComponent', {
  props: ['info'],
  template: `
<div>
  <h2>確認刪除？</h2>
  <ul class="btns flex end">
    <li><a href="javascript:;" class="btn-box darkgray" @click="deleteReport(info)">YES</a></li>
    <li><a href="javascript:;" class="btn-box darkgray"  @click="$emit('close')">NO</a></li>
  </ul>
</div>
`,
  methods: {
    deleteReport(a) {
      let token = getToken();
      console.log(`${apiHost}Api/delinfodetail/${a}`)
      $.ajax({
        url: `${apiHost}Api/delinfodetail/${a}`,
        method: "DELETE",
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function(data) {
          location.reload();
          // getInList(mb001);
        }
      });
    }
  }
})

var roleData = getData('Api/role', 'post', '')
var roleId = {};
for(i in roleData){
  roleId[roleData[i].id] = roleData[i].title
}
Vue.component('addUserComponent', {
  props: ['info'],
  mixins: [formMixin],
  data(){
    return{
      optActive: false,
      roleId,
      role:'',
      formData:{
        status:0,
        role_id:"",
        name:"",
        act:"",
        pwd:"",
        mail:""
      }
    }
  },
  template: `
  <div>
    <form class="form-st1" action="/si/Api/upUser" method="post" @submit.prevent="onSubmit">
      <ul class="btns pl10 pr10 flex end">
        <li><button class="btn-box blue" type="submit">儲存</button></li>
      </ul>
      <div class="custom-input">
        <ul>
          <li class="custom-checkbox">
            <h3 class="ttl">啟用狀態</h3>
            <input type="checkbox" v-model="formData.status"/>
          </li>
          <li>
            <h3 class="ttl">角色名稱</h3>
            <div class="custom-select">
              <h3 class="ttl" 
                @click="optActive ? optActive = false : optActive = true"
              >{{role}}</h3>
              <ul class="opt" v-show="optActive">
                <li v-for="(item, id) in roleId" @click="updateRole(id)">
                  {{item}}
                </li>
              </ul>
            </div>
          </li>
          <li>
            <h3 class="ttl">姓名</h3>
            <input type="text" v-model="formData.name"/>
          </li>
          <li>
            <h3 class="ttl">帳號</h3>
            <input type="text" v-model="formData.act" :readonly="info">
          </li>
          <li>
            <h3 class="ttl">密碼</h3>
            <input type="password" v-model="formData.pwd">
          </li>
          <li>
            <h3 class="ttl">信箱</h3>
            <input type="email" v-model="formData.mail">
          </li>
          
        </ul>
      </div>
    </form>
  </div>
  `,
  methods:{
    updateRole(id){
      this.optActive = false;
      this.role = roleId[id]
      this.formData.role_id = id
    }
  },
  updated(){
    this.formData.status = this.formData.status ? +this.formData.status : 0;
  },
  beforeMount(){
    if(this.info){
      var userData = getData('Api/getuser/' + this.info, 'post', '');
      console.log(userData);
      for(key in this.formData){
        this.formData[key] = userData[key];
      }
      this.formData.status = parseInt(this.formData.status)
      this.formData.user_id = userData.id;
      this.role = this.roleId[userData.role_id];
    }
  }
})
Vue.component('delUserComponent', {
  props: ['info'],
  template: `
<div>
  <h2>確認刪除使用者？</h2>
  <ul class="btns flex end">
    <li><a href="javascript:;" class="btn-box darkgray" @click="deleteUser(info)">YES</a></li>
    <li><a href="javascript:;" class="btn-box darkgray"  @click="$emit('close')">NO</a></li>
  </ul>
</div>
`,
  methods: {
    deleteUser(a) {
      let token = getToken();
      console.log(`${apiHost}Api/delUser/${a}`)
      $.ajax({
        url: `${apiHost}Api/delUser/${a}`,
        method: "DELETE",
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function(data) {
          location.reload();
          // getInList(mb001);
        }
      });
    }
  }
})
Vue.component('delGroupComponent', {
  props: ['info'],
  template: `
<div>
  <h2>確認刪除使用者？</h2>
  <ul class="btns flex end">
    <li><a href="javascript:;" class="btn-box darkgray" @click="deleteGroup(info)">YES</a></li>
    <li><a href="javascript:;" class="btn-box darkgray"  @click="$emit('close')">NO</a></li>
  </ul>
</div>
`,
  methods: {
    deleteGroup(a) {
      let token = getToken();
      console.log(`${apiHost}Api/delGroup/${a}`)
      $.ajax({
        url: `${apiHost}Api/delGroup/${a}`,
        method: "DELETE",
        contentType: "application/json; charset=utf-8",
        cache: false,
        beforeSend: function(xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function(data) {
          location.reload();
          // getInList(mb001);
        }
      });
    }
  }
})
Vue.component('successMsgComponent',{
    template: `
    <div class="content">
      儲存成功
    </div>
    `,
    mounted(){
      setTimeout(()=>{
        this.$root.overlayVisible = false;
      },1000)
    }
})