Shopify.theme.productReviews = {
  init: function () {
    if ($('#shopify-product-reviews').length || $('.shopify-product-reviews-badge').length) {
      SPR.$(document).ready(function () {
        return SPR.registerCallbacks(),
          SPR.initRatingHandler(),
          SPR.initDomEls(),
          SPR.loadProducts(),
          SPR.loadBadges()
      })
    }
  },
  productReviewScroll: function() {
    if ($('#shopify-product-reviews').length && $('.shopify-product-reviews-badge').length) {
      $('.spr-badge-container').on('click', function() {
        Shopify.theme.scrollToTop('#shopify-product-reviews');
      });
    }
  },
  unload: function () {
    $('.spr-badge-container').off();
  }
}
