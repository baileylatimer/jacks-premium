/*============================================================================
Product media controls
==============================================================================*/

Shopify.theme.productMedia = {
  models: [],
  setupMedia: function() {

    const config = {
      // Default control list
      controls: [
        'zoom-in',
        'zoom-out',
        'fullscreen'
      ],
      focusOnPlay: false
    }

    $('model-viewer').each(function(index, model) {
      model = new Shopify.ModelViewerUI(model, config);
      Shopify.theme.productMedia.models.push(model);
    })

    $('.product-gallery__model model-viewer').on('mousedown',function(){
      Shopify.theme.productMedia.hideModelIcon(this);
    })
  },
  showModelIcon: function(slide) {
    $(slide).find('.button--poster, .model-icon-button-control').show();
  },
  hideModelIcon: function(slide) {
    $(slide).find('.button--poster, .model-icon-button-control').hide();
  }
}


