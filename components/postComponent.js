Vue.component('postComponent', {
  mixins: [formMixin, modifyMixin],
  data() {
    return {
      info:'',
      overlayData: [],
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
  <form action="/si/Api/infoadd" class="width-limiter form-st1" method="post" @submit.prevent="onSubmit" enctype="multipart/form-data">
    <div class="top-bar">
      <button class="btn-box blue" type="submit">儲存</button>
    </div>
    <h2 class="accor-ttl mt20 " :class="{active : basicProps.active}" @click="toggleActive('basicProps')">基本資料</h2>
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
            autocomplete="off"
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
    let url = window.location.href;
    let apiItem = url.substr(url.lastIndexOf('=') + 1)
    if(url.indexOf('=') > 0){
    this.overlayData = getData(`Api/infodetail/${apiItem}`, '')

    }
    // if
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