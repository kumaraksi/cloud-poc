utils.initializeMaterialDesign();

utils.initializeMenu('side-menu');

window.erverTemplateStr = "<div class='col-md-4'><div class='panel panel-default'><div class='panel-body'><div class='row'><div class='col-md-9'><span class='pull-left'><i class='material-icons'>developer_board</i></span><span>  CPU</span></div><div class='col-md-3'>{0}</div></div><div class='row'><div class='col-md-9'><span class='pull-left'><i class='material-icons'>memory</i></span><span>  memory</span></div><div class='col-md-3'>{1}</div></div><div class='row'><div class='col-md-9'><span class='pull-left'><i class='material-icons'>move_to_inbox</i></span><span>  memory</span></div><div class='col-md-3'>{2}</div></div></div><a href='#'><div class='panel-footer'><span class='pull-left'>{4}</span><span class='pull-right'><i class='fa fa-circle'></i></span><div class='clearfix'></div></div></a></div></div>";

function updateServerList(){
	var url = utils.getBaseUrl() + '/server/getServers';
	var filterData = {
		"filter": {
			"pageInfo": {
				"start": 0,
				"limit": 100
			},
			"sortCriteria": {
				"name": "name",
				"sortOrder": "ASC"
			},
			//"byLocationUids": ["40000000-0000-0000-0000-000000000005"],
			//"includeSubLocations": false,
			//"byVsomUid": "09bebf28-dcc6-4d2c-aabc-d16700d4c756"
		}
	};
	
	onSuccess = function(data, textStatus, jqXHR ) {
		data = JSON.parse(data);
		console.info(data);
		var servers = data.data.items;
		servers.push(servers[0]);
		servers.push(servers[0]);
		servers.push(servers[0]);
		servers.push(servers[0]);
		
		window.allServers = servers;
		
		var serverListStr = '';
		servers.forEach(function(server, index){
			var serverName = server.name;
			var adminState = server.adminState;
			var deviceState = server.deviceState.aggregateState;
			var umsSystemSummary = server.umsSystemSummary;
			var totalPhysicalMemory = umsSystemSummary.totalPhysicalMemory;
			var numberOfLogicalCores = umsSystemSummary.numberOfLogicalCores;
			
			var serverTemplate = $('#serverTemplate');
			var serverTemplateStr = serverTemplate[0].innerHTML;
			
			var panelCss = 'panel-primary';
			if(deviceState == 'ok'){
				panelCss = 'panel-success';
			}
			//Fake Data
			switch(index){
				case 1:
					serverName = serverName+'_warning';
					deviceState = 'warning';
					break;
				case 2:
					serverName = serverName+'_critical';
					deviceState = 'critical';
					break;
				case 3:
					serverName = serverName+'_disabled';
					deviceState = 'disabled';
					break;
				case 4:
					serverName = serverName+'_softdeleted';
					deviceState = 'soft_deleted';
					break;
			}
			
			
			
			serverListStr += serverTemplateStr.formatUnicorn(panelCss, index, serverName, deviceState);
			
			
			//serverListStr += window.erverTemplateStr.formatUnicorn(adminState, totalPhysicalMemory, numberOfLogicalCores, serverName);
		});
		
		var serverListCmp = $('#serverList');
		serverListCmp[0].innerHTML = serverListStr;
		
		
		$('#serverCountBadge').text(allServers.length);
		
		$('.serverDetailsBtn').on('click',function(event){
			console.info(event);
			window.event1 = event;
			var serverIndex = +event.currentTarget.getAttribute('server-index');
			console.info(serverIndex)
			alert("VSOM : "+ window.allServers[serverIndex].name + '. Next Load Details')
		});
	}
	onError = function(jqXHR, textStatus, errorThrown  ) {
		console.warn(errorThrown);
	}
	utils.sendPost(url, filterData, onSuccess, onError);
	
}



function updateCameraList(){
	var url = utils.getBaseUrl() + '/camera/getCameras';
	var filterData = {
		"filter": {
			"pageInfo": {
				"start": 0,
				"limit": 100
			},
			"sortCriteria": {
				"name": "name",
				"sortOrder": "ASC"
			},
			//"byLocationUids": ["40000000-0000-0000-0000-000000000005"],
			//"includeSubLocations": false,
			//"byVsomUid": "09bebf28-dcc6-4d2c-aabc-d16700d4c756"
		}
	};
	
	onSuccess = function(data, textStatus, jqXHR ) {
		data = JSON.parse(data);
		console.info(data);
		var cameras = data.data.items;
		window.allCameras = cameras;
		var cameraListStr = "";
		var i=0;
		cameras.forEach(function(camera, index){
			var cameraName = camera.name;
			var adminState = camera.adminState;
			var deviceState = camera.deviceState.aggregateState;
			
			var cameraTemplate = $('#cameraTemplate');
			var cameraTemplateStr = cameraTemplate[0].innerHTML;
			
			var panelCss = 'panel-primary';
			if(deviceState == 'ok'){
				panelCss = 'panel-success';
			}
			
			
			cameraListStr += cameraTemplateStr.formatUnicorn(panelCss, i, cameraName, deviceState);
			
		});
		
		var cameraListCmp = $('#cameraList');
		cameraListCmp[0].innerHTML = cameraListStr;
		
		$('#cameraCountBadge').text(allCameras.length);
		
		$('.cameraDetailsBtn').on('click',function(event){
			console.info(event);
			window.event1 = event;
			var cameraIndex = +event.currentTarget.getAttribute('camera-index');
			console.info(cameraIndex)
			alert("Camera  : "+ window.allCameras[cameraIndex].name + '. Next Load Details')
		});
	}
	onError = function(jqXHR, textStatus, errorThrown  ) {
		console.warn(errorThrown);
	}
	utils.sendPost(url, filterData, onSuccess, onError);
	
}




$('#tabList a').click(function(e) {
    e.preventDefault()
    $(this).tab('show')
});


utils.verifySession(false);

updateServerList();
updateCameraList();
$("#logOutBtn").click(function() {
	utils.logOut();
});
$("#logOutBtn1").click(function() {
	utils.logOut();
});