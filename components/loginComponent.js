Vue.component('loginComponent', {
	mixins: ['formMixin'],
	data(){
		return {
			act:'',
			pwd:''
		}
	},
	template:`
	<div class="login">
	<form class="form-signin" @submit.prevent="login">
	<img class="mb-4" src="https://www.enutrition.com.tw/content/images/logo.png" alt="" width="100%">
	<h1 class="h3 mb-3 font-weight-normal">品保檢驗系統</h1>
	<label for="inputEmail" class="sr-only">帳號</label>
	<div class="custom-input">
		<ul>
			<li><input v-model="act" type="text" id="inputAccount" class="form-control" placeholder="帳號" required autofocus></li>
			<li><input v-model="pwd" type="password" id="inputPassword" class="form-control" placeholder="密碼" required></li>
		</ul>
	</div>
	
	
	<div class="flex column v-center"><button class="btn-box blue" type="submit">登入</button><p class="mt-5 mb-3 text-muted">&copy; 2018-2019</p></div>
	</form>
	</div>
	`,
	methods:{
		login(){
			let token = getToken();
			let options = {'act': this.act, 'pwd': this.pwd, 'csrf_post':undefined}
			$.ajax({
				url: `${apiHost}Api/login`,
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				cache: false,
				async: false,
				data: options,
				beforeSend: function (xhr) {
					xhr.setRequestHeader("Authorization", "Bearer " + token);
				},
				success: function (data) {
					console.log(data)
					if (data && data!='false'){
						let jsonArr	= JSON.parse(data);
						sessionStorage.setItem('menu', jsonArr['menu']);
						sessionStorage.setItem('features', jsonArr['features']);
						if (typeof(JSON.parse(jsonArr['menu']))=='object' && JSON.parse(jsonArr['menu'])){
							location.replace(Object.keys(JSON.parse(jsonArr['menu']))[0].toLowerCase() + '.html');
						} else {
							alert('403權限不足');
						}
					} else {
						alert('Error登入失敗');
						$("input[type='hidden']").load("Login/get_csrf", function(responseText, statusTxt, xhr) {
							$(this).val(responseText);
						}); 
					}
				},
				error: function(xhr) {
					$.confirm({
						text: "Ajax request 發生錯誤",
						confirm: function() {
							location.reload();
						}
					});
				}
			});
		}
	}
})