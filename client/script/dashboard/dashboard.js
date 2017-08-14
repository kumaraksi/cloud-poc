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
			"byLocationUids": [window.currentSelectedLocationUID],
			"includeSubLocations": false,
			//"byVsomUid": "09bebf28-dcc6-4d2c-aabc-d16700d4c756"
		}
	};
	
	onSuccess = function(data, textStatus, jqXHR ) {
		data = JSON.parse(data);
		console.info(data);
		if(data.data.totalRows == 0 ){
			var emptyDeviceDiv = $('#emptyDeviceDiv');
			var emptyDeviceDivHTML = emptyDeviceDiv[0].innerHTML;
			
			emptyDeviceDivHTML = emptyDeviceDivHTML.formatUnicorn('No Servers Under Current Location');
			
			var serverListCmp = $('#serverList');
			serverListCmp[0].innerHTML = emptyDeviceDivHTML;
			
			$('#serverCountBadge').text('0');
			return;
		}
		var servers = data.data.items;
		servers.push(servers[0]);
		servers.push(servers[0]);
		servers.push(servers[0]);
		servers.push(servers[0]);
		servers.push(servers[0]);
		servers.push(servers[0]);
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
			$('#serverDetails').modal({
				show:true,
				backdrop:'static'
			});
			var serverDetailTemplateStr = $('#serverDetails')[0].innerHTML;

			$('#serverDetails').on('shown.bs.modal', function () {
				var server = window.allServers[serverIndex];
				console.log(window.allServers[serverIndex]);
				var serverDetailsJSON = {
					serverName: server.name,
					serverType : server.umsService.umsRedundancyConfig.serverRoleType, 
					serverModel : server.model, 
					cpuNum : server.umsSystemSummary.numberOfCPUs,
					totalMemory : server.umsSystemSummary.totalPhysicalMemory, 
					raidControllers: server.umsSystemSummary.raidControllerDetail, 
					os : server.umsSystemSummary.osType,
					storage : server.umsSystemSummary.totalSwapMemory,
					vsfVersion: server.vsfService.softwareVersion,
					vsfActive: server.vsfService.serviceActivationState,					
					umsVersion: server.umsService.softwareVersion,
					umsActive: server.umsService.serviceActivationState,					
					mapServerVersion: server.mapService.softwareVersion,
					mapServerActive: server.mapService.serviceActivationState,					
					metadataServerVersion: server.motionMetadataService.softwareVersion,
					metadataServerActive: server.motionMetadataService.serviceActivationState,					
					vsomVersion: server.vsomService.softwareVersion,
					vsomActive: server.vsomService.serviceActivationState
				};
				serverDetailTemplateStr = serverDetailTemplateStr.formatUnicorn(serverDetailsJSON);
					this.innerHTML = serverDetailTemplateStr;
			});
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
			"byLocationUids": [window.currentSelectedLocationUID],
			"includeSubLocations": false,
			//"byVsomUid": "09bebf28-dcc6-4d2c-aabc-d16700d4c756"
		}
	};
	
	onSuccess = function(data, textStatus, jqXHR ) {
		data = JSON.parse(data);
		console.info(data);
		
		if(data.data.totalRows == 0 ){
			var emptyDeviceDiv = $('#emptyDeviceDiv');
			var emptyDeviceDivHTML = emptyDeviceDiv[0].innerHTML;
			
			emptyDeviceDivHTML = emptyDeviceDivHTML.formatUnicorn('No Cameras Under Current Location');
			
			var cameraListCmp = $('#cameraList');
			cameraListCmp[0].innerHTML = emptyDeviceDivHTML;
			
			$('#cameraCountBadge').text('0');
			return;
		}
		
		
		
		var cameras = data.data.items;
		cameras.push(cameras[0]);
		cameras.push(cameras[0]);
		cameras.push(cameras[0]);
		cameras.push(cameras[0]);
		cameras.push(cameras[0]);
		cameras.push(cameras[0]);
		cameras.push(cameras[0]);
		cameras.push(cameras[0]);
		cameras.push(cameras[0]);
		cameras.push(cameras[0]);
		cameras.push(cameras[0]);
		cameras.push(cameras[0]);
		cameras.push(cameras[0]);
		
		window.allCameras = cameras;
		var cameraListStr = "";
		var i=0;
		cameras.forEach(function(camera, index){
			var cameraName = camera.name;
			var adminState = camera.adminState;
			var deviceState = camera.deviceState.aggregateState;
			var model = camera.model;
			var managedBy = camera.managedByRef.refName;
			var ip = camera.deviceAccess.hostname_ip;
			var cameraTemplate = $('#cameraTemplate');
			var cameraTemplateStr = cameraTemplate[0].innerHTML;
			
			var panelCss = 'panel-primary';
			if(deviceState == 'ok'){
				panelCss = 'panel-success';
			}
			
			
			cameraListStr += cameraTemplateStr.formatUnicorn(panelCss, i, cameraName, deviceState, ip, model, managedBy);
			
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


function fixLocationData(locationTree){


		//Ignore First Level
		//locationTree = locationTree.childGroups[0];
		var locationTreeHtml = '<div class="sidebar-nav navbar-collapse" ><ul class="nav in" id="side-menu"><li>';
		
		var rootLocation = locationTree.childGroups[0];
		
		locationTreeHtml += '<a uid="'+rootLocation.uid+'" href="#" class="text-default selected"><i class="fa fa-sitemap fa-fw"></i>'+rootLocation.localName+'<span class="fa arrow"></span></a>';
		window.currentSelectedLocationUID = rootLocation.uid;
			if(rootLocation.hasChildGroups){
				var secondLevelLocation = rootLocation.childGroups;
				locationTreeHtml+= '<ul class="nav nav-second-level">';
				
				secondLevelLocation.forEach(function(sl){
					if(sl.hasChildGroups){
						locationTreeHtml+='<li>';
						locationTreeHtml+='<a uid="'+sl.uid+'" class="text-default" href="#">'+sl.localName+' <span class="fa arrow"></span></a>';
						locationTreeHtml+='<ul class="nav nav-third-level">';
						
						var thirdLevelLocation = sl.childGroups;
						thirdLevelLocation.forEach(function(tl){
							locationTreeHtml+= '<li><a uid="'+tl.uid+'" class="text-default" href="#">'+tl.localName+'</a></li>';
						});
						
						
						locationTreeHtml+='</ul>';
						locationTreeHtml+='</li>';
					}else{
						locationTreeHtml+= '<li><a uid="'+sl.uid+'" class="text-default" href="#">'+sl.localName+'</a></li>';
					}
				});
				
				
				
				
				locationTreeHtml+='</ul>';
			}
		
		locationTreeHtml+='</ul></div>';
		
		return locationTreeHtml;
}



function updateLocationTree(){
	
	var url = utils.getBaseUrl() + 'location/getLocationTree';
	var filterData = {
		"treeFilter": {
			"getLocalTreeOnly": true,
			"objectTypes": [],
			"depth": 4,
		}
	};
	
	
	onSuccess = function(data, textStatus, jqXHR ) {
		data = JSON.parse(data);
		console.info(data);
		var locationTree = data.data;
		window.locationTree = locationTree;
		var locationTreeTemplate = $('#locationTreeTemplate');
		var locationTreeTemplateStr = locationTreeTemplate.html();
		var locationSidebar = $('#location-sidebar');
		//locationSidebar.html(locationTreeTemplateStr);
		
		
		var locationTreeHtml = fixLocationData(locationTree);
		locationSidebar.html(locationTreeHtml);
		
		//utils.initializeMenu();
		utils.initializeMenu('side-menu');
		updateServerList();
		updateCameraList();
		updateEvents();
		$('#location-sidebar a').on('click', function(event){
			console.info(event);
			var currentTarget = $(event.currentTarget);
			$('#location-sidebar a').removeClass('selected');
			currentTarget.addClass('selected');
			
			var selectedLocationUID = event.currentTarget.getAttribute('uid');
			window.currentSelectedLocationUID = selectedLocationUID;
			updateServerList();
			updateCameraList();
			updateEvents();
			//Set Location UID And Refersh Everything
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



updateLocationTree();
//updateServerList();
//updateCameraList();
$("#logOutBtn").click(function() {
	utils.logOut();
});
$("#logOutBtn1").click(function() {
	utils.logOut();
});