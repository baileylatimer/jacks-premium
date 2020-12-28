Shopify.theme.objectFitImages = {
  init: function () {
    objectFitImages();

    if (Shopify.theme_settings.image_loading_style == 'color') {
      this.calculateAspectRatio();
    }
  },
  calculateAspectRatio: function() {

    // Get list of image-element__wrap's to calculate
    const imageWrap = document.querySelectorAll('[data-calculate-aspect-ratio]');

    // Iterate through list
    for(let i = 0; i < imageWrap.length ; i++) {

      const image = imageWrap[i].firstElementChild;

      // Calculate aspect ratio based off of original width & height
      const aspectRatio = image.getAttribute('width') / image.getAttribute('height')
      // Calculate proper width based off of aspect ratio
      const aspectWidth = image.height * aspectRatio;

      // Apply width to image wrap
      imageWrap[i].style.maxWidth = `${Math.floor(aspectWidth)}px`;
    }

    // Remove background color once loaded
    document.addEventListener('lazyloaded', function(e){
      e.srcElement.parentNode.style.background = 'none';
    });
  },
  unload: function () {
  }
};
