$(function () {
	utils.initializeMaterialDesign();
	
	function verifySession() {
		function onSuccess(data, textStatus, jqXHR ) {
			console.info('VerifySession');
			console.info(data);
			console.info(textStatus);
			console.info('=========================================\n\n');
		}
		function onError(jqXHR, textStatus, errorThrown  ) {
			console.info('VerifySession');
			console.warn(textStatus);
			console.warn(errorThrown);
			console.info('=========================================\n\n');
		}
		utils.verifySession(onSuccess, onError);
		
	}

	utils.verifySession(true);
	
	var loginBtn = $('#loginBtn');
	loginBtn.click(function () {
		var hostName = $('#hostNameField')[0].value;
		var userName = $('#userNameField')[0].value;
		var password = $('#passwordField')[0].value;
		
		if(hostName == '' || userName == '' || password == ''){
			alert('Values Enter Krna Chutiye');
			return;
		}
		
		
		function onSuccess(data, textStatus, jqXHR ) {
			console.info('Login Request');
			data = JSON.parse(data);
			if(data.status.errorType == 'SUCCESS'){
				
				window.location = window.DASHBOARD_PAGE;
			}else{
				alert('login failed')
			}
			console.info('=========================================\n\n');
			//verifySession();
		}
		function onError(jqXHR, textStatus, errorThrown  ) {
			console.info('Login Request');
			console.warn(textStatus);
			console.info('=========================================\n\n');
		}

		utils.loginRequest(hostName, userName, password);
	
	});
});