Shopify.theme.applyMasonry = function (selector, gutterSize) {
  let $galleryWrapper = $('.gallery-type--masonry');



  if ($galleryWrapper.length > 0) {
    $galleryWrapper.imagesLoaded().progress(function() {
      $galleryWrapper.isotope({
        layoutMode: 'masonry',
        itemSelector: selector,
        percentPosition: true,
        masonry: {
          columnWidth: selector,
          gutter: gutterSize
        }
      });
    });
  }
}

Shopify.theme.applyHorizontalMasonry = function () {
  let $galleryWrapper = $('.gallery-type--horizontal-masonry');

  $galleryWrapper.find('.gallery__item').each(function(e){
    var wrapper = $(this);
    var imgWidth,
        imgHeight;

      setTimeout(function(){
        imgWidth = wrapper.find('img').width();
        imgHeight = wrapper.find('img').height();

        wrapper.css("flex-basis", imgWidth * 200 / imgHeight);
        wrapper.css("flex-grow", imgWidth * 200 / imgHeight);
        wrapper.find("i").css("padding-bottom", imgHeight / imgWidth * 100 + '%');
      }, 100)

  });
}
