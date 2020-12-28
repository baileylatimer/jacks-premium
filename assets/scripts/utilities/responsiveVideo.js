Shopify.theme.responsiveVideo = {
  init: function() {

    // Find youtube iframes
    var $videoIframes = $('iframe[src*="youtube.com"], iframe[src*="vimeo.com"]');

    // For each iframe, if parent is a responsive video wrapper do nothing
    // If no parent responsive video wrapper, then wrap iframe in responsive video wrapper

    $videoIframes.each(function(index, iframe) {

      // Update selector
      var $iframe = $(iframe);

      if (!$iframe.parents('.plyr__video-wrapper').length && !$iframe.parents('.lazyframe').length) {
        $iframe.wrap('<div class="lazyframe" data-ratio="16:9"></div>');
      }
    })
  },
}
