Shopify.contentCreator.accordion = {
  init: function() {

    const $accordionHeading = $('.accordion > dt > a, [data-cc-accordion] > dt > a');

    $('.accordion > dd, [data-cc-accordion] > dd').attr('aria-hidden',true);

    $accordionHeading.attr('aria-expanded',false);

    $accordionHeading.on('click',function(){

      let state = $(this).attr('aria-expanded') === 'false' ? true : false;
      $(this).attr('aria-expanded',state);
      $(this).parent().next().attr('aria-hidden',!state);
      return false;
    });

    $accordionHeading.on('keydown',function(event){
      let keyCode = event.keyCode || e.which;
      if (keyCode === 13){
        $(this).trigger('activate');
      }
    });

  },
  unload: function() {
    $('.accordion > dt > a, [data-cc-accordion] > dt > a').off('click activate');
    $('.accordion > dt > a, [data-cc-accordion] > dt > a').off('keydown');
  }
}
