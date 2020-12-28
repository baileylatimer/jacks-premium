Shopify.contentCreator.slideshow = {
  init: function () {
    //backwards compatibility with flexslider
    $('.slider, .flexslider').find('li').unwrap();
    $('.slider, .flexslider').flickity({
      pageDots: true,
      lazyLoad: 2
    });
  }
}
