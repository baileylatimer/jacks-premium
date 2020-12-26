"use strict";

Shopify.theme.jsRecommendedProducts = {
  init: function init($section) {
    // Add settings from schema to current object
    Shopify.theme.jsRecommendedProducts = $.extend(this, Shopify.theme.getSectionData($section)); // Selectors

    var $productRecommendations = $section.find('.product-recommendations');
    var $productRecommendationsContainer = $('[data-product-recommendations-container]');
    var $productRecommendationsBlock = $productRecommendationsContainer.closest('.block__recommended-products'); // Hides product recommendations based on settings

    if (this.show_product_recommendations === false) {
      $productRecommendationsBlock.hide();
      return;
    }

    $('.recommended-products-section').show();
    $productRecommendationsBlock.show(); // If showing custom collection we do not want to build request url

    if (this.show_custom_collection) {
      this.showCustomCollection($section);
      return;
    }

    var productID = $productRecommendations.data('product-id');
    var limit = $productRecommendations.data('limit');
    var sectionEnabled = $productRecommendations.data('enabled'); // Build request URL

    var recommendationsURL = $productRecommendations.data('recommendations-url');
    var requestUrl = recommendationsURL + "?section_id=product__recommendations&limit=" + limit + "&product_id=" + productID;
    $.ajax({
      type: 'GET',
      url: requestUrl,
      success: function success(data) {
        if (!sectionEnabled) {
          $productRecommendationsContainer.empty();
          return;
        }

        var $recommendedProductsElement = $(data).find('.product-recommendations').html(); // Insert product list into the product recommendations container

        $productRecommendationsContainer.html($recommendedProductsElement); // Initialize shopify payment buttons

        if (Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }

        $('.recommended-products-section').hide();
        Shopify.theme.jsProduct.relatedProducts();
        var $product = $productRecommendationsContainer.find('.thumbnail');

        if ($product.length === 0) {
          $productRecommendationsBlock.hide();
        } // Converting the currencies


        if (Currency.show_multiple_currencies) {
          Shopify.theme.currencyConverter.convertCurrencies();
        }
      }
    });
  },
  setupRecommendedVideoPlayer: function setupRecommendedVideoPlayer($section) {
    var videosInRecommendedProducts = $section.find('[data-product-recommendations-container] [data-html5-video] video, [data-product-recommendations-container] [data-youtube-video]').get(); // Only run Plyr.setup if videosInRecommendedProducts exists

    if (videosInRecommendedProducts.length > 0) {
      videosInRecommendedProductsPlayer = Plyr.setup(videosInRecommendedProducts, {
        controls: videoControls,
        fullscreen: {
          enabled: true,
          fallback: true,
          iosNative: true
        },
        storage: {
          enabled: false
        }
      });

      if (videoPlayers !== null) {
        var combinedArray = videoPlayers.concat(videosInRecommendedProductsPlayer);
        videoPlayers = combinedArray;
      } else {
        videoPlayers = videosInRecommendedProductsPlayer;
      }
    }

    Shopify.theme.jsVideo.setupListeners();
  },
  showCustomCollection: function showCustomCollection($section) {
    var $recommendedProductsElement = $section.find('.product-recommendations').html();
    var $productRecommendationsContainer = $('[data-product-recommendations-container]');
    $productRecommendationsContainer.html($recommendedProductsElement);
    $('.recommended-products-section').hide();
    Shopify.theme.jsProduct.relatedProducts();
  },
  unload: function unload($section) {}
};