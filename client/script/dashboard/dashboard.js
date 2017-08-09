utils.initializeMaterialDesign();

utils.initializeMenu('side-menu');

$('#serverTab a').click(function(e) {
    e.preventDefault()
    $(this).tab('show')
});

//utils.verifySession(false);



$("#logOutBtn").click(function() {
    utils.logOut();
});