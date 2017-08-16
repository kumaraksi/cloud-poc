function updateEvents(){
	
	console.info('Events Updated');
	
	if(typeof window.eventsTable == 'undefined'){
	window.eventsTable = $('#dataTables-example').DataTable({
            responsive: true
        });
	}
}