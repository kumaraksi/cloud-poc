utils.initializeMaterialDesign();

utils.initializeMenu('side-menu');

$('#serverTab a').click(function(e) {
    e.preventDefault()
    $(this).tab('show')
});