function updateAlerts(){
	
	console.info('Alerts Updated');
	
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
			//"byLocationUids": [window.currentSelectedLocationUID],
			"bySeverity":["CRITICAL", "INFO"]
			
		}
	};
	
	var onSuccess = function(data, textStatus, jqXHR) {
        data = JSON.parse(data);
        console.info(data);
		var alertList = data.data.items;
        
		var alertDTData = [];
		
		var totalAlerts = alertList.length;
		$('#alertCountBadge').text(totalAlerts);
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
									return '<span class="label label-primary">CAMERA</span>';
									break;
								case "device_vs_server":
									return '<span class="label label-success">SERVER</span>';
									break;
								case "device_vs_encoder":
									return '<span class="label label-primary">ENCODER</span>';
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