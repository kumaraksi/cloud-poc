var utils = (function() {
	
	window.LOGIN_PAGE = '/client/pages/login.html';
	window.DASHBOARD_PAGE = '/client/pages/dashboard.html';
	
	window.CSRF_TOKEN = 'Mvl4GpiA6oF5wXJhC+0IRr61lEq9g3NVz5YbrqByROI';
	window.JSESSIONID = 'C7113DDD33C6FF594BBD865E7EB1D41B+0IRr61lEq9g3NVz5YbrqByROI';
	document.cookie = "CSRF_TOKEN="+CSRF_TOKEN+"; expires=Thu, 18 Dec 2018 12:00:00 UTC; path=/";
    document.cookie = "JSESSIONID="+JSESSIONID+"; expires=Thu, 18 Dec 2018 12:00:00 UTC; path=/";
    
	/**
     * load mustache templates using AJAX
     * @param {any} templatePath 
     * @param {any} successCb 
     * @param {any} failureCb 
     */
    function templateLoader(templatePath, successCb, failureCb) {
        var path = './templates/' + templatePath;
        // jQuery async request
        $.ajax({
            url: path,
            success: successCb,
            error: function(e) {
                console.error(e);
                failureCb(e);
            }
        });
    }

    /**
     *initialize material design. 
     */
    function initializeMaterialDesign() {
       // $.material.init();
    }

    function initializeMenu(selectorId, options) {
        options = $.isEmptyObject(options) || typeof options == 'undefined' ? {} : options;
        $('#' + selectorId).metisMenu(options);
    }
	
	
	function sendPost(url, data, onSuccess, onError) {
		data = JSON.stringify(data);
		$.ajax({
			type: "POST",
			url: url,
			data: data,
			contentType: "application/json; charset=utf-8",
			success: onSuccess,
			error: onError,
			xhrFields: {
			  withCredentials: true
		   },
		   headers: {
			   'csrftoken' : window.CSRF_TOKEN
		   }
			//dataType:
		});
	}
	
	function getBaseUrl(){
		return localStorage.getItem('baseUrl');
	}
	
	function setBaseUrl(serverHostName){
		localStorage.setItem('serverHostName', serverHostName);
		var baseUrl = 'https://' + serverHostName + '/ismserver/json/';
		localStorage.setItem('baseUrl', baseUrl);
	}
	
	function clearBaseUrl(){
		localStorage.removeItem('serverHostName');
		localStorage.removeItem('baseUrl');
	}
	
	function verifySession(isLoginPage, onSuccess,onError) {
		var baseUrl = utils.getBaseUrl();
		if(isLoginPage && baseUrl == null){
			return;
		}else if(baseUrl == null){
			window.location = window.LOGIN_PAGE;
		}
		
		var url = baseUrl + '/authentication/verifySession';
		var data = {};
		
		if(typeof onSuccess == 'undefined'){
			onSuccess = function(data, textStatus, jqXHR ) {
				data = JSON.parse(data);
				if(data.status.errorType != 'SUCCESS'){
					utils.clearBaseUrl();
					window.location = window.LOGIN_PAGE;
				}
			}
		}
		if(typeof onError == 'undefined'){
			onError = function(jqXHR, textStatus, errorThrown  ) {
				console.error('Server Error');
			}
		}
		
		sendPost(url, data, onSuccess, onError);
		
	}

	
	function logOut(){
		var baseUrl = utils.getBaseUrl();
		if(baseUrl == null){
			window.location = window.LOGIN_PAGE;
		}
		var onSuccess = function(data, textStatus, jqXHR ) {
				utils.clearBaseUrl();
				window.location = window.LOGIN_PAGE;
				
		}
		var onError = function (jqXHR, textStatus, errorThrown  ) {
				console.error('Server Error');
		}
		var url = baseUrl + '/authentication/logout';
		sendPost(url, {}, onSuccess, onError);
	}
	
	function loginRequest(hostname, username, password, onSuccess,onError) {
		
		var baseUrl = 'https://' + hostname + '/ismserver/json/';
		
		var url = baseUrl + '/authentication/login';
		var data = {
			"username": username,
			"password": password,
			"domain": ""
		};
		
		if(typeof onSuccess == 'undefined'){
			onSuccess = function(data, textStatus, jqXHR ) {
				data = JSON.parse(data);
				if(data.status.errorType == 'SUCCESS'){
					utils.setBaseUrl(hostname);
					window.location = window.DASHBOARD_PAGE;
				}else{
					alert('login failed')
				}
			}
		}
		if(typeof onError == 'undefined'){
			onError = function (jqXHR, textStatus, errorThrown  ) {
				console.error('Server Error');
			}
		}
		
		
		sendPost(url, data, onSuccess, onError);
		
	}

    return {
        templateLoader: templateLoader,
        initializeMaterialDesign: initializeMaterialDesign,
        initializeMenu: initializeMenu,
		sendPost : sendPost,
		verifySession : verifySession,
		loginRequest : loginRequest,
		getBaseUrl : getBaseUrl,
		setBaseUrl : setBaseUrl,
		clearBaseUrl : clearBaseUrl,
		logOut : logOut
    }
})();