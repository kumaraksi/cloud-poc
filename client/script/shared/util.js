var utils = (function() {

    /**
     * load mustache templates using AJAX
     * @param {any} templatePath 
     * @param {any} successCb 
     * @param {any} failureCb 
     */
    function templateLoader(templatePath, successCb, failureCb) {
        var path = './templates/' + templatePath;
        // jQuery async request
        $.ajax({
            url: path,
            success: successCb,
            error: function(e) {
                console.error(e);
                failureCb(e);
            }
        });
    }

    /**
     *initialize material design. 
     */
    function initializeMaterialDesign() {
        $.material.init();
    }

    function initializeMenu(selectorId, options) {
        options = $.isEmptyObject(options) || typeof options == 'undefined' ? {} : options;
        $('#' + selectorId).metisMenu(options);
    }

    return {
        templateLoader: templateLoader,
        initializeMaterialDesign: initializeMaterialDesign,
        initializeMenu: initializeMenu
    }
})();