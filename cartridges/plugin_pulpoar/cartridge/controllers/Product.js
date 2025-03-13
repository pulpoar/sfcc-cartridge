var server = require('server');

server.extend(module.superModule);

server.append('Show', function (req, res, next) {
    var Site = require('dw/system/Site');
    var data = res.getViewData();

    var pulpoARSlug = Site.current.getCustomPreferenceValue('pulpoARSlug');
    var enablePulpoSite = Site.current.getCustomPreferenceValue('enablePulpoAR').value;
    var enablePulpoProduct = data.product.raw.custom.enablePulpoAR;

    if ((enablePulpoSite === 'YES' || (enablePulpoSite === 'PRODUCT' && enablePulpoProduct)) && !empty(pulpoARSlug)) {
        data.enablePulpo = true;
        data.pulpoARSlug = pulpoARSlug;
    } else {
        data.enablePulpo = false;
    }

    res.setViewData(data);

    next();
});

module.exports = server.exports();
