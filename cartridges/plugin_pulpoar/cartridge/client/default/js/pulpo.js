'use strict';

function events() {
    $(document).ready(function () {
        pulpoar.onGoToProduct((payload) => {
            if (payload.web_link) {
                window.location.replace(payload.web_link);
            }
        });
        pulpoar.onAddToCart((payload) => {
            console.log(JSON.stringify(payload))
        });
    });
}

module.exports = {
    events: events
};
