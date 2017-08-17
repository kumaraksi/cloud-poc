function updateAlerts(){
	
	console.info('Events Updated');
	
	/*if(typeof window.eventsTable == 'undefined'){
		window.eventsTable = $('#dataTables-example').DataTable({
            responsive: true
        });
	}*/
	var url = utils.getBaseUrl() + 'alert/getAlerts';
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
			"bySeverity":["CRITICAL", "INFO",]
			
		}
	};
	
	var onSuccess = function(data, textStatus, jqXHR) {
        data = JSON.parse(data);
        console.info(data);
		var alertList = data.data.items;
        
		var alertDTData = [];
		
		var totalAlerts = alertList.length;
		var alert, alertDT;
		for(var i=0; i < totalAlerts; i++){
			alert = alertList[i];
			alertDT = [alert.severity, alert.alertTime, alert.alertType, alert.description, alert.deviceRef.refObjectType];
			alertDTData.push(alertDT);
		}
		if(typeof window.alertsTable == 'undefined'){
			window.alertsTable = $('#alertsTable').DataTable( {
				data: alertDTData,
				columns: [
					{ title: "Severity" },
					{ title: "Time" },
					{ title: "Type" },
					{ title: "Description" },
					{ title: "Object Type" }
				]
			} );
		}else{
			window.alertsTable.fnClearTable();
			window.alertsTable.fnAddData(alertDTData);
		}
	};
	
	onError = function(jqXHR, textStatus, errorThrown) {
		 console.warn(errorThrown);
	};
	
	 utils.sendPost(url, filterData, onSuccess, onError);
	
}