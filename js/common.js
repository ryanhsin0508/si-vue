var apiHost = "/si/";
function getToken() {
  return $.ajax({
    async: false,
    type: "POST", //GET, POST, PUT
    url: `${apiHost}Api/lssue` //the url to call
  }).done((res) => {}).fail(function(err) {
    //Error during request
  }).responseText;
}
var token = getToken();


function getAjax(uri, type, p_number) {
  token = getToken();

  return $.ajax({
    async: false,
    url: apiHost + uri,
    method: "POST",
    contentType: "application/json; charset=utf-8",
    cache: false,
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Bearer " + token);
    },
    error: function(xhr) {
      $.confirm({
        text: "Ajax request 發生錯誤",
        confirm: function() {
          location.reload();
        }
      });
    },
    success: function(data) {
      
      // setINFO(data);
    }
  }).responseText;
}

function getString(){
  return $.ajax({
    async:false,
    dataType: "json",
    url: host + 'json/strings.json',
    success: function(data){
       data
    }
  }).responseJSON;
}
function getData(uri, type, p_number){
  return JSON.parse(getAjax(uri, type, p_number));

}