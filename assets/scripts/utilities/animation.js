Shopify.theme.animation = {
  init: function () {
    $('[data-scroll-class]').waypoint(function () {
      const animationClass = $(this.element).data('scroll-class');
      $(this.element).addClass('animated').addClass(animationClass);
    }, { offset: '70%' });
  },
  slideTransition: function ($el, animationName, callback) {

    $el.parents('.flickity-enabled').find('.animated').removeClass('animated ' + animationName);
    $el.addClass('animated').addClass(animationName);

  },
  unload: function ($target) {
    $target.data('scroll-class', '');
  }
}
