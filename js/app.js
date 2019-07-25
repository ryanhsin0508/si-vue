var host = /si-vue/;
var tableMixin = {
  methods: {
    memorizeSort(name, which, seq) {
      let obj = {
        which: which,
        seq: seq
      }
      localStorage.setItem(`${name}Sort`, JSON.stringify(obj))
    }
  },
  filters: {
    date(val) {
      if (val)
        return val.split(' ')[0];
    }
  },
  mounted() {
    let that = this;
    let name = this.$options.name
    let columnCount = $('.table-st1 th').length;
    let colArr = [];
    let lsObj = JSON.parse(localStorage.getItem(`${name}Sort`));
    console.log(lsObj)
    let sortBy = lsObj ? lsObj['which'] : 0;
    let sortSeq = lsObj ? lsObj['seq'] : 'desc';


    for (let i = 0; i < columnCount; i++) {
      colArr.push(null);
    }
    $('.table-st1').DataTable({
      oLanguage: {
        "sProcessing": "處理中...",
        "sLengthMenu": "顯示 _MENU_ 項結果",
        "sZeroRecords": "沒有匹配結果",
        "sInfo": "顯示第 _START_ 至 _END_ 項結果，共 _TOTAL_ 項",
        "sInfoEmpty": "顯示第 0 至 0 項結果，共 0 項",
        "sInfoFiltered": "(從 _MAX_ 項結果過濾)",
        "sSearch": "搜索:",
        "oPaginate": {
          "sFirst": "首頁",
          "sPrevious": "上頁",
          "sNext": "下頁",
          "sLast": "尾頁"
        }
      },
      "columns": colArr,
      responsive: true,
      "order": [
        [sortBy, sortSeq]
      ],
      "lengthMenu": [
        [15, 50, 100, -1],
        [15, 50, 100, "All"]
      ]
    });
    $('.table-st1 th').click(function() {
      let idx = $(this).index();
      let seq = this.className == 'sorting_desc' ? 'desc' : 'asc'
      that.memorizeSort(name, idx, seq);
    })
  }
}
var formMixin = {
  methods: {
    onSubmit(e) {
      let that = this;
      let compName = this.$options.name;
      let overlayData = this.overlayData;
      let token = getToken();
      let arr = [];
      if (compName == 'addFormComponent') {
        for (key in overlayData) {
          // console.log(`${key}=${overlayData[key]}`)
          arr.push(`${key}=${overlayData[key]}`)
        }
      }
      if (compName == 'inspectItemsComponent') {
        let p_num = this.info[0];
        let titleArr = this.titleArr;
        let data = overlayData;
        arr.push(`p_number=${p_num}`)
        for (let key in data) {
          for (let i in titleArr) {
            let listKey = titleArr[i][1];
            if (data[key][listKey]) {
              arr.push(`detail[${parseInt(key)+1}][${listKey}]=${data[key][listKey]}`)
            }

          }
        }
      }
      if (compName == 'addReportComponent') {
        let titleArr = this.titleArr;
        let inspectArr = this.inspectTitleArr
        let inspectTableArr = this.inspectTableTitleArr;
        let data = overlayData;
        for (let i in titleArr) {
          arr.push(`${titleArr[i][1]}=${this.formData[titleArr[i][1]]}`)
        }
        for (let i in inspectArr) {
          let listKey = inspectArr[i][1];
          arr.push(`detail[1][${listKey}]=${this.formData[listKey]}`)
        }
        for (let key in data) {
          for (let i in inspectTableArr) {
            let listKey = inspectTableArr[i][1];
            if (data[key][listKey]) {
              arr.push(`detail[${parseInt(key)+1}][${listKey}]=${data[key][listKey]}`)
            }

          }
        }
      }

      let str = arr.join('&');
      let file = $("input[type='file']").val();
      console.log(e.target.action)

      if (file) {
        $.ajax({
          url: e.target.action,
          type: 'post',
          data: new FormData($('form')[0]),
          cache: false,
          contentType: false,
          processData: false,
          beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
          },
          success: function(data) {
            that.$root.overlayVisible = false;
            console.log('aaa')
          },
          error: function(xhr) {
            console.log('failed file')
          }
        });
      } else {
        $.ajax({
          url: e.target.action,
          type: 'post',
          data: decodeURI(str),
          cache: false,
          beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
          },
          success: function(data) {
            console.log('bbb')
            console.log(data)
            that.$root.overlayVisible = false;
          },
          error: function(xhr) {
            console.log(xhr)
            // action_msg('danger');
          }
        })
      }



    },
    sendAPI(e) {

    }
  },
  beforeMount() {

  },
  mounted() {
    let that = this;
    // this.addRow();
    $('.date-single').each(function(i) {
      let name = $(this).attr('name');
      $(this).dateRangePicker({
        autoClose: true,
        singleDate: true,
        showShortcuts: false,
        singleMonth: true,
        format: 'YYYYMMDD',
        setValue: function(s) {
          that.formData[name] = s;
        }
      })
    })
  }
}
var modifyMixin = {
  data() {
    return {
      sameVal: []
    }
  },
  methods: {
    addRow() {
      let last = this.itemLength - 1;
      let obj = { name: "" };
      console.log(this.overlayData)
      this.titleArr.map((v) => {
        if (this.overlayData.length > 0) {
          obj[v[1]] = this.sameVal.indexOf(v[1]) >= 0 ? this.overlayData[last][v[1]] : '';
        } else {
          obj[v[1]] = '';
        }
      })
      this.overlayData.push(obj)
    }

  },
  mounted() {
    this.addRow();
  },
  computed: {
    itemLength() {
      return this.overlayData.length;
    }
  },
  watch: {
    sameVal() {
      let last = this.itemLength - 1;
      if (this.overlayData.length > 1) {
        this.sameVal.map((v) => {
          this.overlayData[last][v] = this.overlayData[last - 1][v]
        })
      }
      /*for(let i=0; i<length; i++){
        let name = this.sameVal[i]
        this.overlayData[last][name] = this.overlayData[last-1][name];
      }*/
    }
  }
}
$(function() {


  var vm = new Vue({
    el: "#app",
    components: {},
    data: {
      instance: 'root',
      overlayVisible: false,
      overlayData: {}
    },
    methods: {
      alertHandler() {
        alert('alerted')
      },
      showOverlay(type, info) {
        this.overlayVisible = true;
        this.overlayData.type = type;
        switch (type) {
          case 'add':
            this.overlayData.title = getString()['product']['add_overlay']['title'];
            break;
          case 'inspectItems':
            this.overlayData.title = getString()['product']['inspect_overlay']['title'];
            break;
          case 'previewInspect':
            this.overlayData.title = getString()['report']['preview_inspect']['title'];
            break;
          case 'addReport':
            this.overlayData.title = getString()['report']['add_report']['title'];
            break;
          case 'delReport':
            this.overlayData.title = getString()['report']['del_report']['title'];
        }
        this.overlayData.info = info;


        // console.log(overlayData)
      }
    },
    updated() {},
    mounted() {
      console.log('mmm')
    }
  })
})