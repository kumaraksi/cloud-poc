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
		window.allServers = servers;
		var serverListStr = "<div class='row'>";
		var i=0;
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
			
			serverListStr += serverTemplateStr.formatUnicorn(panelCss, i, serverName, deviceState);
			serverListStr += serverTemplateStr.formatUnicorn(panelCss, i, serverName+'_warning', 'warning');
			serverListStr += serverTemplateStr.formatUnicorn(panelCss, i, serverName+'_critical', 'critical');
			serverListStr += serverTemplateStr.formatUnicorn(panelCss, i, serverName+'_disabled', 'disabled');
			serverListStr += serverTemplateStr.formatUnicorn(panelCss, i, serverName+'_softdeleted', 'soft_deleted');
			
			
			//serverListStr += window.erverTemplateStr.formatUnicorn(adminState, totalPhysicalMemory, numberOfLogicalCores, serverName);
		});
		serverListStr = serverListStr + '</div>';
		
		var serverListCmp = $('#serverList');
		serverListCmp[0].innerHTML = serverListStr;
		
		
		$('.serverDetailsBtn').click(function(event){
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

$('#serverTab a').click(function(e) {
    e.preventDefault()
    $(this).tab('show')
});

utils.verifySession(false);

updateServerList();

$("#logOutBtn").click(function() {
	utils.logOut();
});