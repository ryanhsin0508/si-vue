var productData = [];
var overlayData;
var stringsData = getString();
// var productData = JSON.parse(productData);

var widthArr = [];
var titleArr = [
  ['品號', 'p_number'],
  ['批號', 'b_number'],
  ['品名', 'MB002'],
  ['規格', 'MB003'],
  ['檢驗單位', 5],
  ['報告日期', 'reportdt'],
  ['品項', 6],
  ['數值', 7],
  ['目的', 'purpose'],
  ['金額', 'amount']
];
Vue.component('itemComponent', {
  props: ['updatePager'],
  mixins: [tableMixin],
  data() {
    return {
      searchArr: [
        ['品號', 'p_number'],
        ['批號', 'b_number'],
        ['報告編號', 's_number'],
        ['檢驗品項', 'item_name'],
        ['檢驗目的', 'purpose'],
        ['報告日期 - 起', 's_day', 'startDate'],
        ['報告日期 - 訖', 'e_day', 'endDate']
      ],
      searchCon: {'p_number':'',
        'b_number':'',
        's_number':'',
        'item_name':'',
        'purpose':'',
        's_day':'',
        'e_day':''
      },
      titleArr,
      list: productData,
      refresh:false
    }
  },
  template: `
  <div class="width-limiter">
  <form class="searchCon">
  <div class="heading">
    <h2>檢驗資料明細</h2>
    <ul class="flex btns">
    <li><button class="btn-box red" @click.prevent="clearInput"><i class="mr10 fas fa-eraser"></i>清除</button></li>
    <li><button class="btn-box orange" @click.prevent="down"><i class="mr10 fas fa-download"></i>下載</button></li>
    <li><button class="btn-box blue" @click.prevent="getFilteredItem"><i class="mr10 fas fa-search"></i>搜尋</button></li>
    </ul>
  </div>
  
    <ul class="grid5 spacing10 start wrap">
      <li v-for="item in searchArr" :class="{'sep-date':  item[2] == 'endDate'}">
        <h3>{{item[0]}}</h3>
        <input
          :class="item[2] ? 'date ' + item[2] : ''" type="text"
          v-model="searchCon[item[1]]" 
        />
      </li>
      
    </ul>
  </form>
  <item-table-component :list="list" :titleArr="titleArr" v-if="refresh"></item-table-component>
</div>
  `,
  methods:{
    getFilteredItem(){
      this.refresh = false;
      let json = {};
      for(let k in this.searchCon){
        if(this.searchCon[k]){
          json[k] = window.btoa(encodeURIComponent(this.searchCon[k]));
        }
      }

      console.log(json)
      // window.btoa(encodeURIComponent(s))
      this.list = JSON.parse(getAjax('Api/itemList/0', 'post' ,'', json));
      this.refresh = true
    },
    down(){
      let json = {};
      for(let k in this.searchCon){
        if(this.searchCon[k]){
          json[k] = window.btoa(encodeURIComponent(this.searchCon[k]));
        }
      }
      window.open(`${apiHost}Api/down/${window.btoa(JSON.stringify(json))}`)
    },
    clearInput(){
      for(k in this.searchCon){
        this.searchCon[k] = ''
      }
    }
  },
  computed: {

  },
  mounted() {
    let that = this;
    $('.date.startDate').dateRangePicker(
      {
        format:'YYYYMMDD',
        separator : ' to ',
        getValue: function()
        {
          if ($('.startDate').val() && $('.endDate').val() )
            return $('.startDate').val() + ' to ' + $('.endDate').val();
          else
            return '';
        },
        setValue: function(s,s1,s2)
        {
          that.searchCon.s_day = s1;
          that.searchCon.e_day = s2;
          // $('.endDate').val(s2);
        }
      });
    $('.date.endDate').dateRangePicker(
      {
        format:'YYYYMMDD',
        separator : ' to ',
        getValue: function()
        {
          if ($('.startDate').val() && $('.endDate').val() )
            return $('.startDate').val() + ' to ' + $('.endDate').val();
          else
            return '';
        },
        setValue: function(s,s1,s2)
        {
          that.searchCon.s_day = s1;
          that.searchCon.e_day = s2;
          // $('.endDate').val(s2);
        }
      });
    


  }
});
Vue.component('itemTableComponent',{
  mixins: [tableMixin],
  props:['list', 'titleArr'],
  template:`
  <table class="table-st1 dataTable" v-if="true">
    <thead>
      <tr>
        <th v-for="(arr, index) in titleArr" width="20%">{{titleArr[index][0]}}</th>
        <th>連結檔</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in list" v-if="item[1]">
        <td v-for="(arr, index) in titleArr">
          {{item[titleArr[index][1]]}}
        </td>
        <td><a :href="'/si/uploads/' + item['filename']" target="_blank"><i class="fas fa-file-pdf fa-2x"></i></a></td>
      </tr>
    </tbody>
  </table>
  `,
  beforeUpdate(){
    this.destroyDTable()
  },
  updated(){
    // this.dtable.destroy();
    this.addDataTable()
  }
})