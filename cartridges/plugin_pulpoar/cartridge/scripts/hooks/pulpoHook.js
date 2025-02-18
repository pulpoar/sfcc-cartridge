'use strict';

/**
 * Renders Pulpo AR SDK
 * @returns {void}
 */
exports.afterFooter = function () {
    var Site = require('dw/system/Site');

    var pulpoSDKurl = Site.current.getCustomPreferenceValue('pulpoSDKurl');
    var enablePulpoSite = Site.current.getCustomPreferenceValue('enablePulpoAR').value;

    if (!enablePulpoSite || empty(pulpoSDKurl)) {
        return;
    }

    var ISML = require('dw/template/ISML');

    ISML.renderTemplate('pulpoSDK', {pulpoSDKurl: pulpoSDKurl});
};
