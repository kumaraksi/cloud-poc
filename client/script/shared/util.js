var utils = (function() {
	
	var randomString = function(length) {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for(var i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
	function getCookie(cname) {
		var name = cname + "=";
		var decodedCookie = decodeURIComponent(document.cookie);
		var ca = decodedCookie.split(';');
		for(var i = 0; i <ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}
	
	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+ d.toUTCString();
		document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	}
	
	window.LOGIN_PAGE = "/"+extractFolderFromPath(1)+'/client/pages/login.html';
	window.DASHBOARD_PAGE = "/"+extractFolderFromPath(1)+'/client/pages/dashboard.html';
	
	if(getCookie('CSRF_TOKEN') == ''){
		window.CSRF_TOKEN = randomString(36);
		setCookie('CSRF_TOKEN', window.CSRF_TOKEN, 10);
	}else{
		window.CSRF_TOKEN = getCookie('CSRF_TOKEN');
	}
	
	if(getCookie('JSESSIONID') == ''){
		window.JSESSIONID = randomString(36);
		setCookie('JSESSIONID', window.JSESSIONID, 10);
	}else{
		window.JSESSIONID = getCookie('JSESSIONID');
	}
	
	String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
	function () {
		"use strict";
		var str = this.toString();
		if (arguments.length) {
			var t = typeof arguments[0];
			var key;
			var args = ("string" === t || "number" === t) ?
				Array.prototype.slice.call(arguments)
				: arguments[0];

			for (key in args) {
				str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
			}
		}

		return str;
	};

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

    function extractFolderFromPath(index){
    	return window.location.pathname.split('/')[index];
    }

    /**
     *initialize material design. 
     */
    function initializeMaterialDesign() {
        $.material.init();
    }

    function initializeMenu(selectorId, options) {
        options = $.isEmptyObject(options) || typeof options == 'undefined' ? {} : options;
        $('#' + selectorId).metisMenu(options);
    }
	
	
	function sendPost(url, data, onSuccess, onError) {
		var onSuccessParent = function(data, textStatus, jqXHR ) {
			onSuccess(data, textStatus, jqXHR);
		};
		
		var onErrorParent = function(data, textStatus, jqXHR ) {
			console.info(data, textStatus, jqXHR);
			switch(data.status){
				case 403:
					window.location = window.LOGIN_PAGE;
					break;
			}
			onError(data, textStatus, jqXHR);
			
		}
		
		
		data = JSON.stringify(data);
		$.ajax({
			type: "POST",
			url: url,
			data: data,
			contentType: "application/json; charset=utf-8",
			success: onSuccessParent,
			error: onErrorParent,
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
				}else{
					if(isLoginPage){
						window.location = window.DASHBOARD_PAGE;
					}
				}
			}
		}
		if(typeof onError == 'undefined'){
			onError = function(jqXHR, textStatus, errorThrown  ) {
				window.open(baseUrl, 'CDAF', "height=400,width=400");
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
				try{
					window.open(baseUrl, 'CDAF', "height=400,width=400");
					console.error('Server Error');
				}catch(e){
					alert('Invalid Server');
				}
			}
		}
		
		
		sendPost(url, data, onSuccess, onError);
		
	};
	
	if($.fn.dataTable){
		$.fn.dataTable.render.ellipsis = function ( cutoff, wordbreak, escapeHtml ) {
			var esc = function ( t ) {
				return t
					.replace( /&/g, '&amp;' )
					.replace( /</g, '&lt;' )
					.replace( />/g, '&gt;' )
					.replace( /"/g, '&quot;' );
			};

			return function ( d, type, row ) {
				// Order, search and type get the original data
				if ( type !== 'display' ) {
					return d;
				}

				if ( typeof d !== 'number' && typeof d !== 'string' ) {
					return d;
				}

				d = d.toString(); // cast numbers

				if ( d.length <= cutoff ) {
					return d;
				}

				var shortened = d.substr(0, cutoff-1);

				// Find the last white space character in the string
				if ( wordbreak ) {
					shortened = shortened.replace(/\s([^\s]*)$/, '');
				}

				// Protect against uncontrolled HTML input
				if ( escapeHtml ) {
					shortened = esc( shortened );
				}

				return '<span class="ellipsis" title="'+esc(d)+'">'+shortened+'&#8230;</span>';
			};
		};
	}

	function bytesToSize(bytes) {
	    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	    if (bytes == 0) return 'n/a';
	    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
	    if (i == 0) return bytes + ' ' + sizes[i];
	    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
	};

	function convertToBytes(value,unit) {
	    var sizes = ['bytes', 'K', 'M', 'G', 'T'];
	    if (value == 0) return 'n/a';
	    var i = sizes.indexOf(unit);
	    if (i == 0) return value + ' ' + sizes[i];
	    return (value * Math.pow(1024, i)).toFixed(1);
	};

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
		logOut : logOut,
		bytesToSize: bytesToSize,
		convertToBytes: convertToBytes
    }
})();