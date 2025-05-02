'use strict';

function events() {
    $(function () {
        if (!pulpoar) {
            return;
        }

        pulpoar.onGoToProduct((payload) => {
            if (payload[0].web_link) {
                window.location.replace(payload[0].web_link);
            }
        });

        pulpoar.onAddToCart((payload) => {
            var addToCartUrl = $('.pulpo-sdk').data('add-to-cart-url');
            if (payload.length > 0) {
                payload.forEach(function(item) {
                    if (addToCartUrl && item.slug) {
                        var form = {
                            pid: item.slug.toUpperCase(),
                            quantity: 1
                        };
                        $.ajax({
                            url: addToCartUrl,
                            method: 'POST',
                            data: form,
                            success: function (response) {
                                $('.minicart').trigger('count:update', response);
                                var messageType = response.error ? 'alert-danger' : 'alert-success';
                                if ($('.add-to-cart-messages').length === 0) {
                                    $('body').append('<div class="add-to-cart-messages"></div>');
                                }
                                $('.add-to-cart-messages').append(
                                    '<div class="alert ' + messageType + ' add-to-basket-alert text-center" role="alert">'
                                    + response.message + '</div>'
                                );
                                setTimeout(function () {
                                    $('.add-to-basket-alert').remove();
                                }, 5000);
                            }
                        });
                    }
                });
            }
        });

        $(document).on('click', '[data-attr="color"] button', function (e) {
            $('#pulpoModal').css('display','block').css('display','none');
            var variant = $(this).find('span.color-value').data('attr-value').toLowerCase();
            pulpoar.applyVariantsWithCatalog([variant]);
        });
    });
}

module.exports = {
    events: events
};
