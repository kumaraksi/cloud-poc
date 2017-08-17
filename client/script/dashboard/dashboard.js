utils.initializeMaterialDesign();

utils.initializeMenu('side-menu');

window.erverTemplateStr = "<div class='col-md-4'><div class='panel panel-default'><div class='panel-body'><div class='row'><div class='col-md-9'><span class='pull-left'><i class='material-icons'>developer_board</i></span><span>  CPU</span></div><div class='col-md-3'>{0}</div></div><div class='row'><div class='col-md-9'><span class='pull-left'><i class='material-icons'>memory</i></span><span>  memory</span></div><div class='col-md-3'>{1}</div></div><div class='row'><div class='col-md-9'><span class='pull-left'><i class='material-icons'>move_to_inbox</i></span><span>  memory</span></div><div class='col-md-3'>{2}</div></div></div><a href='#'><div class='panel-footer'><span class='pull-left'>{4}</span><span class='pull-right'><i class='fa fa-circle'></i></span><div class='clearfix'></div></div></a></div></div>";

function updateServerList() {
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

	$('#serverEmptyList').hide();
	$('#serverList').hide();
	var loader = $('#loader');
	var serverListCmp = $('#serverList');
	serverListCmp[0].innerHTML = loader[0].innerHTML;
	$('#serverList').fadeIn();
	
    onSuccess = function(data, textStatus, jqXHR) {
        data = JSON.parse(data);
        console.info(data);
        if (data.data.totalRows == 0) {
            $('#serverList').hide();
			$('#serverEmptyList').fadeIn();
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
        servers.forEach(function(server, index) {
            var serverName = server.name;
            var adminState = server.adminState;
            var deviceState = server.deviceState.aggregateState;
            var umsSystemSummary = server.umsSystemSummary;
            var totalPhysicalMemory = umsSystemSummary.totalPhysicalMemory;
            var numberOfLogicalCores = umsSystemSummary.numberOfLogicalCores;

            var serverTemplate = $('#serverTemplate');
            var serverTemplateStr = serverTemplate[0].innerHTML;

            var panelCss = 'panel-primary';
            if (deviceState == 'ok') {
                panelCss = 'panel-success';
            }
            //Fake Data
            switch (index) {
                case 1:
                    serverName = serverName + '_warning';
                    deviceState = 'warning';
                    break;
                case 2:
                    serverName = serverName + '_critical';
                    deviceState = 'critical';
                    break;
                case 3:
                    serverName = serverName + '_disabled';
                    deviceState = 'disabled';
                    break;
                case 4:
                    serverName = serverName + '_softdeleted';
                    deviceState = 'soft_deleted';
                    break;
            }



            serverListStr += serverTemplateStr.formatUnicorn(panelCss, index, serverName, deviceState);


            //serverListStr += window.erverTemplateStr.formatUnicorn(adminState, totalPhysicalMemory, numberOfLogicalCores, serverName);
        });

		$('#serverList').fadeIn();
		$('#serverEmptyList').fadeOut();
		
        var serverListCmp = $('#serverList');
		serverListCmp[0].innerHTML = serverListStr;


        $('#serverCountBadge').text(allServers.length);

        $('.serverDetailsBtn').on('click', function(event) {
            var serverIndex = +event.currentTarget.getAttribute('server-index');
            window.selectedDevice = window.allServers[serverIndex];
            window.selectedDevice.cameraCDPNeighbours = {};
            getDeviceStatus();
        });
    }
    onError = function(jqXHR, textStatus, errorThrown) {
        console.warn(errorThrown);
    }
    utils.sendPost(url, filterData, onSuccess, onError);

}



function updateCameraList() {
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
	
	$('#cameraList').hide();
	$('#cameraEmptyList').hide();
	var loader = $('#loader');
	var serverListCmp = $('#cameraList');
	serverListCmp[0].innerHTML = loader[0].innerHTML;
	$('#cameraList').fadeIn();
	
    onSuccess = function(data, textStatus, jqXHR) {
        data = JSON.parse(data);
        console.info(data);

        if (data.data.totalRows == 0) {
			$('#cameraList').hide();
			$('#cameraEmptyList').fadeIn();
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
        var i = 0;
        cameras.forEach(function(camera, index) {
            var cameraName = camera.name;
            var adminState = camera.adminState;
            var deviceState = camera.deviceState.aggregateState;
            var model = camera.model;
            var managedBy = camera.managedByRef.refName;
            var ip = camera.deviceAccess.hostname_ip;
            var cameraTemplate = $('#cameraTemplate');
            var cameraTemplateStr = cameraTemplate[0].innerHTML;

            var panelCss = 'panel-primary';
            if (deviceState == 'ok') {
                panelCss = 'panel-success';
            }


            cameraListStr += cameraTemplateStr.formatUnicorn(panelCss, i, cameraName, deviceState, ip, model, managedBy);

        });

		$('#cameraList').show();
		$('#cameraEmptyList').hide();
			
        var cameraListCmp = $('#cameraList');
        cameraListCmp[0].innerHTML = cameraListStr;

        $('#cameraCountBadge').text(allCameras.length);

        $('.cameraDetailsBtn').on('click', function(event) {
            var cameraIndex = +event.currentTarget.getAttribute('camera-index');
            window.selectedDevice = window.allCameras[cameraIndex];
            getDeviceStatus();
        });
    }
    onError = function(jqXHR, textStatus, errorThrown) {
        console.warn(errorThrown);
    }
    utils.sendPost(url, filterData, onSuccess, onError);

}


function fixLocationData(locationTree) {


    //Ignore First Level
    //locationTree = locationTree.childGroups[0];
    var locationTreeHtml = '<div class="sidebar-nav navbar-collapse" ><ul class="nav in" id="side-menu"><li>';

    var rootLocation = locationTree.childGroups[0];

    locationTreeHtml += '<a uid="' + rootLocation.uid + '" href="#" class="selected"><i class="fa fa-sitemap fa-fw"></i>' + rootLocation.localName + '<span class="fa arrow"></span></a>';
    window.currentSelectedLocationUID = rootLocation.uid;
    if (rootLocation.hasChildGroups) {
        var secondLevelLocation = rootLocation.childGroups;
        locationTreeHtml += '<ul class="nav nav-second-level">';

        secondLevelLocation.forEach(function(sl) {
            if (sl.hasChildGroups) {
                locationTreeHtml += '<li>';
                locationTreeHtml += '<a uid="' + sl.uid + '" class="" href="#">' + sl.localName + ' <span class="fa arrow"></span></a>';
                locationTreeHtml += '<ul class="nav nav-third-level">';

                var thirdLevelLocation = sl.childGroups;
                thirdLevelLocation.forEach(function(tl) {
                    locationTreeHtml += '<li><a uid="' + tl.uid + '" class="" href="#">' + tl.localName + '</a></li>';
                });


                locationTreeHtml += '</ul>';
                locationTreeHtml += '</li>';
            } else {
                locationTreeHtml += '<li><a uid="' + sl.uid + '" href="#">' + sl.localName + '</a></li>';
            }
        });




        locationTreeHtml += '</ul>';
    }

    locationTreeHtml += '</ul></div>';

    return locationTreeHtml;
}



function updateLocationTree() {

    var url = utils.getBaseUrl() + 'location/getLocationTree';
    var filterData = {
        "treeFilter": {
            "getLocalTreeOnly": true,
            "objectTypes": [],
            "depth": 4,
        }
    };
	
	

    onSuccess = function(data, textStatus, jqXHR) {
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
        updateAlerts();
		
		$('#location-sidebar a').on('click', function(event) {
            //console.info(event);
			console.info(event.target.tagName);
			if(event.target.tagName == 'A'){
				var currentTarget = $(event.currentTarget);
				$('#location-sidebar a').removeClass('selected');
				currentTarget.addClass('selected');

				var selectedLocationUID = event.currentTarget.getAttribute('uid');
				window.currentSelectedLocationUID = selectedLocationUID;
				updateServerList();
				updateCameraList();
				updateAlerts();
				//Set Location UID And Refersh Everything
			}
        });

    }
    onError = function(jqXHR, textStatus, errorThrown) {
        console.warn(errorThrown);
    }
    utils.sendPost(url, filterData, onSuccess, onError);

}

function getDeviceStatus() {
    var device = window.selectedDevice;
    var url = utils.getBaseUrl() + 'devicehealth/getDeviceDetailState';

    var filterData = {
        "deviceRef": {
            "refName": device.name,
            "refObjectType": device.objectType,
            "refUid": device.uid,
            "refVsomUid": device.vsomUid
        }
    };

    onSuccess = function(data, textStatus, jqXHR) {
        data = JSON.parse(data);
        console.info(data);

        if (data.data.totalRows != 0) {
            if (window.selectedDevice.objectType === "device_vs_server") {
                $('#serverDetails').modal({
                    show: true,
                    backdrop: 'static'
                });
                var serverStatusTemplate = $('#serverStatusTemplate');
                var serverStatusTemplateStr = serverStatusTemplate.html();
                serverStatusTemplateStr = serverStatusTemplateStr.formatUnicorn(data.data);
                $('#serverStatusTemplate')[0].innerHTML = serverStatusTemplateStr;
            } else if (window.selectedDevice.objectType === "device_vs_camera_ip") {
                var cameraStatusTemplate = $('#cameraStatusTemplate');
                var cameraStatusTemplateStr = cameraStatusTemplate.html();
                cameraStatusTemplateStr = cameraStatusTemplateStr.formatUnicorn(data.data);
                $('#cameraStatusTemplate')[0].innerHTML = cameraStatusTemplateStr;
                getCameraCDPNeighbours();
            }
        }
    }

    onError = function(jqXHR, textStatus, errorThrown) {
        console.warn(errorThrown);
    }
    utils.sendPost(url, filterData, onSuccess, onError);
}

function getCameraCDPNeighbours() {
    var device = window.selectedDevice;
    var url = utils.getBaseUrl() + 'camera/getCdpNeighbors';
    var filterData = {
        "cameraRef": {
            "refName": device.name,
            "refObjectType": device.objectType,
            "refUid": device.uid,
            "refVsomUid": device.vsomUid
        }
    };

    onSuccess = function(data, textStatus, jqXHR) {
        data = JSON.parse(data);
        console.info(data);

        if (data.data.totalRows != 0) {
            if (window.selectedDevice.objectType === "device_vs_camera_ip") {
                window.selectedDevice.cameraCDPNeighbours = data.data[0];
                $('#cameraDetails').modal({
                    show: true,
                    backdrop: 'static'
                });
            }
        }
    }
    utils.sendPost(url, filterData, onSuccess, onError);
}

$('#tabList a').click(function(e) {
    e.preventDefault()
    $(this).tab('show')
});

$('#serverDetails').on('shown.bs.modal', function() {
    var server = window.selectedDevice;
    var serverDetailTemplateStr = $('#serverDetails')[0].innerHTML;
    var serverDetailsJSON = {
        serverName: server.name,
        serverType: server.umsService.umsRedundancyConfig.serverRoleType,
        serverModel: server.model,
        cpuNum: server.umsSystemSummary.numberOfCPUs,
        totalMemory: server.umsSystemSummary.totalPhysicalMemory,
        raidControllers: server.umsSystemSummary.raidControllerDetail !== '' ? server.umsSystemSummary.raidControllerDetail : 'N/A',
        os: server.umsSystemSummary.osType,
        storage: server.umsSystemSummary.totalSwapMemory,
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

$('#cameraDetails').on('shown.bs.modal', function() {
    var camera = window.selectedDevice;
    var cameraDetailTemplateStr = $('#cameraDetails')[0].innerHTML;
    var cameraDetailsJSON = {
        cameraName: camera.name,
        vendor: camera.vendor,
        modelName: camera.modelName,
        vendorNameFromDevice: camera.vendorNameFromDevice,
        modelNameFromDevice: camera.modelNameFromDevice,
        serialNo: camera.serialNo,
        firmwareVersion: camera.firmwareVersion,
        portId: camera.cameraCDPNeighbours.portID,
        deviceId: camera.cameraCDPNeighbours.deviceID,
        deviceAddress: camera.cameraCDPNeighbours.entryAddress,
        deviceModel: camera.cameraCDPNeighbours.platform,
        SDKVersion: camera.sdkVersion,
        hardwareid: camera.hardwareId,
        macaddress: camera.networkConfig.networkInterfaces[0].macAddress
    };
    cameraDetailTemplateStr = cameraDetailTemplateStr.formatUnicorn(cameraDetailsJSON);
    this.innerHTML = cameraDetailTemplateStr;
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