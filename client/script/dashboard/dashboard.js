utils.initializeMaterialDesign();

utils.initializeMenu('side-menu');

$('#connectedServerAddress').text(localStorage.getItem('serverHostName'));

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
            "includeSubLocations": false
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
        /*servers.push(servers[0]);
        servers.push(servers[0]);
        servers.push(servers[0]);
        servers.push(servers[0]);
        servers.push(servers[0]);
        servers.push(servers[0]);
        servers.push(servers[0]);
        servers.push(servers[0]);
        servers.push(servers[0]);
        servers.push(servers[0]);*/

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
            var cpu = 100 - parseInt(server.freeCpu);
            var usedMemory = parseInt(server.usedMemory);
            var totalMemory = parseInt(server.totalMemory);
            var memory = usedMemory / totalMemory * 100;
            var usedStorage = 0;
            var totalStorage = 0;
            var partitions = server.serverConfig.partitions;
            partitions.forEach(function(space, index) {
                var length = space.used.length;
                var unit = space.used.slice(length - 1);
                var amount = space.used.substr(0, length - 1) * 1;
                usedStorage += utils.convertToBytes(amount, unit) * 1;
                var length = space.size.length;
                var unit = space.size.slice(length - 1);
                var amount = space.size.substr(0, length - 1) * 1;
                totalStorage += utils.convertToBytes(amount, unit) * 1;
            });
            var storage = usedStorage / totalStorage * 100;
            //Fake Data
            /*switch (index) {
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
            }*/
			/*usedMemory = utils.convertToBytes(usedMemory,'M');
			usedMemory = utils.bytesToSize(usedMemory);
			totalMemory = utils.convertToBytes(totalMemory,'M');
			totalMemory = utils.bytesToSize(totalMemory);
			*/
			usedMemory += ' MB';
			totalMemory += ' MB';
            usedStorage = utils.bytesToSize(usedStorage);
            totalStorage = utils.bytesToSize(totalStorage);
            server.usedStorage = usedStorage;
            server.totalStorage = totalStorage;
            var serverData = {
                panelCss: panelCss,
                index: index,
                serverName: serverName,
                deviceState: deviceState,
                cpu: cpu,
                memory: memory,
                usedMemory: usedMemory,
                totalMemory: totalMemory,
                sotrage: storage,
                usedStorage: usedStorage,
                totalStorage: totalStorage
            }

            serverListStr += serverTemplateStr.formatUnicorn(serverData);


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
            "byAdminStates": ['pre_provisioned', 'enabled', 'disabled']
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
        /*cameras.push(cameras[0]);
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
        cameras.push(cameras[0]);*/

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


            cameraListStr += cameraTemplateStr.formatUnicorn(panelCss, index, cameraName, deviceState, ip, model, managedBy);

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
            if (event.target.tagName == 'A') {
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


    $('#fullScreenLoader').show();

    onSuccess = function(data, textStatus, jqXHR) {

        data = JSON.parse(data);
        console.info(data);

        if (data.data.totalRows != 0) {
            if (window.selectedDevice.objectType === "device_vs_server") {
                $('#fullScreenLoader').hide();
                $('#serverDetails').modal({
                    show: true
                });
                var serverStatusTemplate = $('#serverStatusTemplate');
                var serverStatusTemplateStr = serverStatusTemplate.html();
                serverStatusTemplateStr = serverStatusTemplateStr.formatUnicorn(data.data);
                $('#serverStatusTemplate')[0].innerHTML = serverStatusTemplateStr;
            } else if (window.selectedDevice.objectType === "device_vs_camera_ip") {
                if (!window.cameraDetailsOriginalTemplate) {
                    window.cameraDetailsOriginalTemplate = $('#cameraDetails')[0].innerHTML;
                }
                var cameraStatusTemplate = $('#cameraStatusTemplate');
                var cameraStatusTemplateStr = cameraStatusTemplate.html();
                cameraStatusTemplateStr = cameraStatusTemplateStr.formatUnicorn(data.data);
                $('#cameraStatusTemplate')[0].innerHTML = cameraStatusTemplateStr;
                getCameraCDPNeighbours();
            }
        }
    }

    onError = function(jqXHR, textStatus, errorThrown) {
        $('#fullScreenLoader').hide();
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
        $('#fullScreenLoader').hide();
        data = JSON.parse(data);
        console.info(data);

        if (data.data.totalRows != 0) {
            if (window.selectedDevice.objectType === "device_vs_camera_ip") {
                window.selectedDevice.cameraCDPNeighbours = data.data[0];
                $('#cameraDetails').modal({
                    show: true
                });
            }
        }
    }
    onError = function(jqXHR, textStatus, errorThrown) {
        $('#fullScreenLoader').hide();
        console.warn(errorThrown);
    }
    utils.sendPost(url, filterData, onSuccess, onError);
}

$('#tabList a').click(function(e) {
    e.preventDefault()
    $(this).tab('show')
});




function getStatusAlertFilters(device) {
    var ts = Math.round(new Date().getTime());
    var tsYesterday = ts - (24 * 3600 * 1000);
    var deviceRef = {
        "refName": device.name,
        "refObjectType": device.objectType,
        "refUid": device.uid,
        "refVsomUid": device.vsomUid
    };

    var filterData = {
        "filter": {
            "pageInfo": {
                "start": 0,
                "limit": 10,
                "skipTotalRowCount": true
            },
            "sortCriteria": {
                "name": "alertTime",
                "sortOrder": "DESC"
            },
            //"bySeverity" : ["CRITICAL", "WARNING", "INFO"],
            "byDeviceRefs": [deviceRef],
            "currentHealth": true,
            "byAfterAlertTimeUTC": tsYesterday
        }
    };

    return filterData;
}


function updateCameraStatusHistoryTable() {
    var url = utils.getBaseUrl() + 'alert/getAlerts';
    var filterData = getStatusAlertFilters(window.selectedDevice);
    var onSuccess = function(data, textStatus, jqXHR) {
        data = JSON.parse(data);
        console.info(data);
        var alertList = data.data.items;

        var alertDTData = [];


        var totalAlerts = alertList.length;

        var alert, alertTime, alertDT, tempTime;
        for (var i = 0; i < totalAlerts; i++) {
            alert = alertList[i];
            alertTime = new Date(alert.alertTime);
            tempTime = (new Date(alert.firstEventGenTime)).toLocaleString()
            alertDT = [alert.severity, tempTime, alert.description];
            alertDTData.push(alertDT);
        }
        if (!$('#cameraStatsHistory').hasClass('dataTable')) {
            window.cameraStatsHistoryTable = $('#cameraStatsHistory').DataTable({
                data: alertDTData,
                autoWidth: false,
                "dom": '<"top"i>rt<"bottom"lp><"clear">',
                "bInfo": false,
                "processing": true,
                columns: [{
                        title: "Severity",
                        width: "8%",
                        className: 'dt-center',
                    },
                    {
                        title: "Time",
                        width: "15%"
                    },
                    {
                        title: "Description",
                        width: "77%"
                    },
                ],
                columnDefs: [{
                        targets: 1,
                        render: $.fn.dataTable.render.ellipsis(15),
                        className: 'datetime'
                    },
                    {
                        targets: 2,
                        render: $.fn.dataTable.render.ellipsis(20),
                        className: 'description'
                    },
                    {
                        targets: 0,
                        render: function(data, type, row) {
                            switch (data) {
                                case "CRITICAL":
                                    return '<span class="label label--danger label--tiny">CRITICAL</span>';
                                    break;
                                case "INFO":
                                    return '<span class="label label--info label--tiny">INFO</span>';
                                    break;
                                case "WARNING":
                                    return '<span class="label label--warning label--tiny">WARNING</span>';
                                    break;
                                default:
                                    return '<span class="label label--primary label--tiny">' + data + '</span>';
                            }
                        }
                    }
                ],
                scrollY: '155px',
                scrollCollapse: true,
                paging: false,
                "language": {
                    "emptyTable": "No records available"
                }
            });




            $('#cameraStatsHistory tbody td').each(function(index) {
                $this = $(this);
                var titleVal = $this.text();
                if (typeof titleVal === "string" && titleVal !== '') {
                    $this.attr('title', titleVal);
                }
            });
        } else {

            window.cameraStatsHistoryTable.clear().rows.add(alertDTData).draw();
        }
    };

    onError = function(jqXHR, textStatus, errorThrown) {
        console.warn(errorThrown);
    };

    utils.sendPost(url, filterData, onSuccess, onError);
}

function updateServerStatusHistoryTable() {
    var url = utils.getBaseUrl() + 'alert/getAlerts';
    var filterData = getStatusAlertFilters(window.selectedDevice);
    var onSuccess = function(data, textStatus, jqXHR) {
        data = JSON.parse(data);
        console.info(data);
        var alertList = data.data.items;

        var alertDTData = [];


        var totalAlerts = alertList.length;

        var alert, alertTime, alertDT;
        for (var i = 0; i < totalAlerts; i++) {
            alert = alertList[i];
            alertTime = new Date(alert.alertTime);
            alertDT = [alert.severity, alert.firstEventGenTime, alert.description];
            alertDTData.push(alertDT);
        }
        if (!$('#serverStatsHistory').hasClass('dataTable')) {
            window.serverStatsHistoryTable = $('#serverStatsHistory').DataTable({
                height: '450px',
                data: alertDTData,
                autoWidth: false,
                "dom": '<"top"i>rt<"bottom"lp><"clear">',
                "bInfo": false,
                "processing": true,
                columns: [{
                        title: "Severity",
                        width: "8%",
                        className: 'dt-center',
                    },
                    {
                        title: "Time",
                        width: "30%"
                    },
                    {
                        title: "Description",
                        width: "62%"
                    },
                ],
                columnDefs: [{
                        targets: 1,
                        render: function(data, type, row) {
                            return (new Date(data)).toLocaleString();
                        },
                    },
                    {
                        targets: 2,
                        render: $.fn.dataTable.render.ellipsis(50)
                    },
                    {
                        targets: 0,
                        render: function(data, type, row) {
                            switch (data) {
                                case "CRITICAL":
                                    return '<span class="label label--danger label--tiny">CRITICAL</span>';
                                    break;
                                case "INFO":
                                    return '<span class="label label--info label--tiny">INFO</span>';
                                    break;
                                case "WARNING":
                                    return '<span class="label label--warning label--tiny">WARNING</span>';
                                    break;
                                default:
                                    return '<span class="label label--primary label--tiny">' + data + '</span>';
                            }
                        }
                    }
                ],
                scrollY: '140px',
                scrollCollapse: true,
                paging: false,
                "language": {
                    "emptyTable": "No records available"
                }
            });




            $('#serverStatsHistory tbody td').each(function(index) {
                $this = $(this);
                var titleVal = $this.text();
                if (typeof titleVal === "string" && titleVal !== '') {
                    $this.attr('title', titleVal);
                }
            });
        } else {

            window.serverStatsHistoryTable.clear().rows.add(alertDTData).draw();
        }
    };

    onError = function(jqXHR, textStatus, errorThrown) {
        console.warn(errorThrown);
    };

    utils.sendPost(url, filterData, onSuccess, onError);
}


$('#serverDetails').on('shown.bs.modal', function() {
    var server = window.selectedDevice;
    if (!window.serverDetailsOriginalTemplate) {
        window.serverDetailsOriginalTemplate = $('#serverDetails')[0].innerHTML;
    }
    var serverDetailTemplateStr = $('#serverDetails')[0].innerHTML;
	
	/*var usedMemory = utils.convertToBytes(server.usedMemory,'M');
	usedMemory = utils.bytesToSize(usedMemory);
	var totalMemory = utils.convertToBytes(server.totalMemory,'M');
	totalMemory = utils.bytesToSize(totalMemory);
	*/
	var usedMemory = server.usedMemory + ' MB';
	var totalMemory = server.totalMemory + ' MB';
	
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
        vsomActive: server.vsomService.serviceActivationState,
        usedMemory: usedMemory,
        totalMemory: totalMemory,
        usedStorage: server.usedStorage,
        totalStorage: server.totalStorage
    };
    serverDetailTemplateStr = serverDetailTemplateStr.formatUnicorn(serverDetailsJSON);
    this.innerHTML = serverDetailTemplateStr;

    updateServerStatusHistoryTable();
});

$('#serverDetails').on('hidden.bs.modal', function() {
    // do something…
    $('#serverDetails')[0].innerHTML = window.serverDetailsOriginalTemplate;
})

$('#cameraDetails').on('hidden.bs.modal', function() {
    // do something…
    $('#cameraDetails')[0].innerHTML = window.cameraDetailsOriginalTemplate;
})

$('#cameraDetails').on('shown.bs.modal', function() {
    var camera = window.selectedDevice;
    // if (!window.cameraDetailsOriginalTemplate) {
    //     window.cameraDetailsOriginalTemplate = $('#cameraDetails')[0].innerHTML;
    // }
    var cameraDetailTemplateStr = $('#cameraDetails')[0].innerHTML;
    var cameraDetailsJSON = {
        cameraName: camera.name,
        vendor: camera.vendor,
        modelName: camera.modelName,
        vendorNameFromDevice: typeof camera.vendorNameFromDevice !== 'undefined' ? camera.vendorNameFromDevice : 'Not Reported',
        modelNameFromDevice: typeof camera.modelNameFromDevice !== 'undefined' ? camera.modelNameFromDevice : 'Not Reported',
        serialNo: camera.serialNo,
        firmwareVersion: typeof camera.firmwareVersion !== 'undefined' ? camera.firmwareVersion : 'Not Reported',
        portId: typeof camera.cameraCDPNeighbours !== 'undefined' ? camera.cameraCDPNeighbours.portID : 'Not Reported',
        deviceId: typeof camera.cameraCDPNeighbours !== 'undefined' ? camera.cameraCDPNeighbours.deviceID : 'Not Reported',
        deviceAddress: typeof camera.cameraCDPNeighbours !== 'undefined' ? camera.cameraCDPNeighbours.entryAddress : 'Not Reported',
        deviceModel: typeof camera.cameraCDPNeighbours !== 'undefined' ? camera.cameraCDPNeighbours.platform : 'Not Reported',
        SDKVersion: camera.sdkVersion,
        hardwareid: camera.hardwareId,
        macaddress: camera.networkConfig.networkInterfaces[0].macAddress
    };
    cameraDetailTemplateStr = cameraDetailTemplateStr.formatUnicorn(cameraDetailsJSON);
    this.innerHTML = cameraDetailTemplateStr;
    updateCameraStatusHistoryTable();
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