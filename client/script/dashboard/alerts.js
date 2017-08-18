
window.alertTimeFilterDD = $("#alertTimeFilter").dropdown({ "autoinit" : ".select" , "optionClass": "withripple"});
window.alertSeverityFilterDD = $("#alertSeverityFilter").dropdown({ "autoinit" : ".select" , "optionClass": "withripple"});



window.alertFilter = {};
window.alertFilter.history = 'allHealth';
window.alertFilter.severity = null;
var ts = Math.round(new Date().getTime());
var tsYesterday = ts - (24 * 3600 * 1000);
window.alertFilter.time = tsYesterday;



$('#alertTimeFilter').on('change', function(event, value){
	
	var val = $(event.target).val();
	if(val == '24'){
		var ts = Math.round(new Date().getTime() );
		var tsYesterday = ts - (24 * 3600 * 1000);
		window.alertFilter.time = tsYesterday;
	}else{
		window.alertFilter.time = null;
	}
	
	updateAlerts();
	
});	

$('#alertSeverityFilter').on('change', function(event, value){
	var val = $(event.target).val();
	console.info(val);
	if(val == 0){
		window.alertFilter.severity = null;
	}else{
		window.alertFilter.severity  = [val];
	}
	
	updateAlerts();
});
/*
$('#alertCurrentStatusFilter').on('change', function(event, value){
	var val = $(event.target).val();
	window.alertFilter.history = val;
	
	updateAlerts();
});*/

$('#alertSearchFilter').on('keyup', function(event){
	var val = $(event.target).val();
	window.alertsTable1.search(val).draw();
});



function getRecentCriticalAlerts(){
	var url = utils.getBaseUrl() + 'alert/getAlerts';
	var ts = Math.round(new Date().getTime());
	var tsYesterday = ts - (24 * 3600 * 1000);
	

	var filterData = {
		"filter": {
			"pageInfo": {
				"start": 0,
				"limit": 100,
				"skipTotalRowCount": true
			},
			"sortCriteria": {
				"name": "alertTime",
				"sortOrder": "DESC"
			},
			"byAfterAlertTimeUTC" : tsYesterday,
			"bySeverity": ["CRITICAL"]
			
		}
	};
	var onSuccess = function(data, textStatus, jqXHR) {
        data = JSON.parse(data);
        console.info(data);
		var alertList = data.data.items;
		var totalAlerts = alertList.length;
		$('#alertCountBadgeCount').text(totalAlerts);
		if(totalAlerts > 0){
			$('#alertCountBadge').addClass('critical');
		}else{
			$('#alertCountBadge').removeClass('critical');
		}
	}
	
	onError = function(jqXHR, textStatus, errorThrown) {
		 console.warn(errorThrown);
	};
	
	 utils.sendPost(url, filterData, onSuccess, onError);
}
getRecentCriticalAlerts();
var updateAlertBadge = setInterval(getRecentCriticalAlerts, 10000);
$('#alertCountBadge').on('click', function(){
	$('.nav-tabs a[href="#alerts"]').tab('show');
});


function getAlertFilters(){
	var filterData = {
		"filter": {
			"pageInfo": {
				"start": 0,
				"limit": 100,
				"skipTotalRowCount": true
			},
			"sortCriteria": {
				"name": "alertTime",
				"sortOrder": "DESC"
			}
		}
	};
	if(window.alertFilter.severity){
		filterData.filter.bySeverity = window.alertFilter.severity;
	}
	filterData.filter[window.alertFilter.history] = true;
	if(window.alertFilter.time){
		filterData.filter.byAfterAlertTimeUTC = window.alertFilter.time;
	}
	return filterData;
}

function updateAlerts(){
	
	console.info('Alerts Updated');
	
	/*if(typeof window.eventsTable == 'undefined'){
		window.eventsTable = $('#dataTables-example').DataTable({
            responsive: true
        });
	}*/
	var url = utils.getBaseUrl() + 'alert/getAlerts';
    var filterData = getAlertFilters();
	
	var onSuccess = function(data, textStatus, jqXHR) {
        data = JSON.parse(data);
        console.info(data);
		var alertList = data.data.items;
        
		var alertDTData = [];
		
		
		var totalAlerts = alertList.length;
		
		$('#alertTableCountBadge').text(totalAlerts);
		var alert, alertTime,alertDT;
		for(var i=0; i < totalAlerts; i++){
			alert = alertList[i];
			alertTime = new Date(alert.alertTime);
			alertDT = [alert.severity, alert.firstEventGenTime, alert.alertType, alert.deviceRef.refObjectType, alert.description];
			alertDTData.push(alertDT);
		}
		if(typeof window.alertsTable1 == 'undefined'){
			window.alertsTable1 = $('#alertsTable').DataTable( {
				data: alertDTData,
				autoWidth : false,
				"dom": '<"top"i>rt<"bottom"lp><"clear">',
				"processing": true,
				columns: [
					{ 
						title: "Severity", 
						width: "10%",
						className : 'dt-center',
					},
					{ 
						title: "Time",
						width: "15%"
					},
					{	
						title: "Type",
						width: "15%"
					},
					{
						title: "Object Type",
						width: "15%",
						className : 'dt-center',
					},
					{	
						title: "Description",
						width: "55%"
					},
				],
				columnDefs: [
					{
						targets: 1,
						render : function( data, type, row ) {
							return (new Date(data)).toLocaleString();
						},
					},
					{
						targets: 4,
						render : $.fn.dataTable.render.ellipsis(90)
					},
					{
						targets: 0,
						render : function(data, type, row){
							switch(data){
								case "CRITICAL":
									return '<span class="label label-danger">CRITICAL</span>';
									break;
								case "INFO":
									return '<span class="label label-info">INFO</span>';
									break;
								case "WARNING":
									return '<span class="label label-warning">WARNING</span>';
									break;
								default :
									return '<span class="label label-primary">'+data+'</span>';
							}
							
							
						}
					},
					{
						targets: 3,
						render : function(data, type, row){
							switch(data){
								case "device_vs_camera":
								case "device_vs_camera_ip":
								case "device_vs_camera_analog":
									return '<span class="label label-camera">CAMERA</span>';
									break;
								case "device_vs_server":
									return '<span class="label label-server">SERVER</span>';
									break;
								case "device_vs_encoder":
									return '<span class="label label-encoder">ENCODER</span>';
									break;
								default :
									return '<span class="label label-primary">'+data+'</span>';
							}
							
							
						}
					}
				  ],
				//scrollY:        '68vh',
				//scrollCollapse: true,
				paging:         false
			} );
			
			
			
		}else{
			window.alertsTable1.clear().rows.add(alertDTData).draw();
		}
		
		$('#alertsTable tbody td').each(function(index){
			$this = $(this);
			var titleVal = $this.text();
			if (typeof titleVal === "string" && titleVal !== '') {
			  $this.attr('title', titleVal);
			}
		});
	};
	
	onError = function(jqXHR, textStatus, errorThrown) {
		 console.warn(errorThrown);
	};
	
	 utils.sendPost(url, filterData, onSuccess, onError);
	
}