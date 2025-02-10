'use strict';

/* global response */

var Template = require('dw/util/Template');
var HashMap = require('dw/util/HashMap');
var Site = require('dw/system/Site');

/**
 * Render logic for storefront.pulpo component.
 * @param {dw.experience.ComponentScriptContext} context The component script context object.
 * @param {dw.util.Map} [modelIn] Additional model values created by another cartridge. This will not be passed in by Commerce Cloud Platform.
 * @returns {string} The markup to be displayed
 */
module.exports.render = function (context, modelIn) {
    var model = modelIn || new HashMap();
    var content = context.content;
    var pulpoARSlug = Site.current.getCustomPreferenceValue('pulpoARSlug');

    model.pulpoARSlug = content.pulpoProjectSlug || pulpoARSlug;

    // instruct 24 hours relative pagecache
    var expires = new Date();
    expires.setDate(expires.getDate() + 1); // this handles overflow automatically
    response.setExpires(expires);

    return new Template('experience/components/commerce_assets/pulpo').render(model).text;
};
