Vue.component('modal', {
  props: ['overlayData'],
  template: `
<transition name="modal">
  <div class="modal-mask">
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
          <alert-msg-component v-if="overlayData.type == 'delReport'" @close="$emit('close')" :info="overlayData.info"></alert-msg-component>

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
  <button type="submit">儲存</button>
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
        ['生效日期', 'eff_day']
      ],
      overlayData: { a: 'b' }
    }
  },
  template: `
  <div>
    <h2 class="pl10 pr10 mb10">{{this.info[1]}} - {{this.info[2]}}</h2>
    <form action="/si/Api/itemdetail" method="post" @submit.prevent="onSubmit">
      <div class="form-table">
        <table class="table-input">
          <thead>
            <tr :class="'grid' + titleArr.length" class="check-same">
              <th v-for="(item, index) in titleArr">
                <template v-if="index != 0">
                  <input :id="item[1]" :value="item[1]" type="checkbox" v-model="sameVal" />
                  <label :for="item[1]">項目一致</label>
                </template>
              </th>
            </tr>
            <tr :class="'grid' + titleArr.length">
              <th v-for="(item, index) in titleArr">{{item[0]}}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(list, listIndex) in overlayData">
              <td v-for="(item, index) in titleArr">
                <input type="text" v-model="list[item[1]]"
                :name="'detail[' + parseInt(Number(listIndex)+1) + '][' + item[1] + ']'"
                />
              </td>
              <td>
                <button
                class="btn-remove"
                @click.prevent="overlayData.splice(listIndex, 1)"
                ></button>
              </td>
            </tr>

          </tbody>
        </table>
        <ul class="btns pl10 pr10 flex between">
          <li><button class="btn-box green" @click.prevent="addRow()">輸入檢驗品項</button></li>
          <li><button class="btn-box blue" type="submit">儲存</button></li>
        </ul>
      </div>
    </form>
  </div>
  `,
  beforeMount() {
    //inspectItemsComponent
    this.overlayData = getData('Api/exdelist/' + this.info[0], 'post' + this.info[0], '')
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
      overlayData: {}
    }
  },
  template: `
  <div>
    <ul>
      <li v-for="(arr, index) in titleArr">{{arr[0]}}: {{info[arr[1]]}}</li>
    </ul>
    <div>
      <table class="table-st1">
        <thead>
          <tr>
            <th v-for="arr in inspectArr">{{arr[0]}}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="list in overlayData">
            <td v-for="arr in inspectArr">{{list[arr[1]]}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `,
  beforeMount() {
    this.overlayData = getData(`Api/infodetail/${this.info[0]}/${this.info[1]}/${encodeURI(this.info[3])}`, 'post')
    // this.overlayData = getDa;
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
        ['金額', 'amount']
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
          <li v-for="item in titleArr">
            <h3 class="ttl">{{item[0]}}</h3>
            <input
            type="text"
            v-model="formData[item[1]]"
            :name="item[1]"
            :class="item[2] ? item[2]+'-single' : ''"
            :data-aaa="info != '' && (item[1] == 'p_number' || item[1] == 'b_number' || item[1] == 's_number')"
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
          <li><input type="file" name="img" class="file" multiple data-show-upload="false" data-show-caption="true" /></li>
        </ul>
      </div>
      <div class="img-preview" style="float:right;height:360px;">

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
        <li><button class="btn-box green" @click.prevent="addRow()">新增檢驗值</button></li>
        <li><button class="btn-box green" @click.prevent="defInspectItems">帶入預設檢驗品項</button></li>
      </ul>

      <div class="form-table">
        <table class="table-input">
          <thead>
            <tr class="grid6 check-same">
              <th v-for="(item, index) in inspectTableTitleArr">
                <template v-if="index != 0">
                  <input :id="item[1]" :value="item[1]" type="checkbox" v-model="sameVal" />
                  <label :for="item[1]">項目一致</label>
                </template>
              </th>
            </tr>
            <tr class="grid6">

              <th v-for="item in inspectTableTitleArr">
                {{item[0]}}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(inspectItem, index) in overlayData">
              <td v-for="item in inspectTableTitleArr">
                <input
                type="text"
                :name="'detail[' + parseInt(Number(index)+1) + '][' + item[1] + ']'"
                v-model="inspectItem[item[1]]">
              </td>
              <td>
                <button><i class="fas fa-eye"></i></button>
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
      this.addRow();
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
    checkTyping(lastTime) {

    }
  },
  beforeMount() {
    console.log(this.info)
    this.overlayData = getData(`Api/infodetail/${this.info[0]}/${this.info[1]}/${encodeURI(this.info[3])}`, '')
    if (this.overlayData.length) {
      this.formData = this.overlayData[0]
    }
  },
  mounted() {
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
      console.log(`${apiHost}uploads/${url}`)
      let opt = {
        pdfOpenParams: {
          pagemode: "thumbs",
          navpanes: 0,
          toolbar: 0,
          statusbar: 0,
          view: "FitV"
        }
      }
      let PDF = PDFObject.embed(`${apiHost}uploads/${url}`, '.img-preview', opt);
    }
  }
})
Vue.component('alertMsgComponent', {
  props: ['info'],
  template: `
<div>
  <h2>確認刪除檢驗報告？</h2>
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