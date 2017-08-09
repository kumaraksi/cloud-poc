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
		
		var serverListStr = "<div class='row'>";
		servers.forEach(function(server){
			var serverName = server.name;
			var adminState = server.adminState;
			var deviceState = server.deviceState;
			var umsSystemSummary = server.umsSystemSummary;
			var totalPhysicalMemory = umsSystemSummary.totalPhysicalMemory;
			var numberOfLogicalCores = umsSystemSummary.numberOfLogicalCores;
			
			var serverTemplate = $('#serverTemplate');
			var serverTemplateStr = serverTemplate[0].innerHTML;
			serverListStr += serverTemplateStr.formatUnicorn(serverName);
			
			
			//serverListStr += window.erverTemplateStr.formatUnicorn(adminState, totalPhysicalMemory, numberOfLogicalCores, serverName);
		});
		serverListStr = serverListStr + '</div>';
		
		var serverListCmp = $('#serverList');
		serverListCmp[0].innerHTML = serverListStr;
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