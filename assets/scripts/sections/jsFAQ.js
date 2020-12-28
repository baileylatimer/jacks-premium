Shopify.theme.jsFAQ = {
  init: function() {

    const $faqHeading = $('.faq-accordion > dt > button');

    $('.faq-accordion > dd').attr('aria-hidden',true);

    $faqHeading.attr('aria-expanded',false);

    $faqHeading.on('click activate',function(){

      const faqTitle = $(this);
      const faqIcons = $(this).find('.icon');

      let state = $(this).attr('aria-expanded') === 'false' ? true : false;
      $(this).attr('aria-expanded',state);
      $(this).parent().next().slideToggle(function(){

        if(faqIcons.hasClass('icon--active')) {
          faqIcons.toggleClass('icon--active');
        }

      });
        $(this).parent().next().attr('aria-hidden',!state);
      return false;
    });

    $faqHeading.on('keydown',function(event){
      let keyCode = event.keyCode || e.which;
      if (keyCode === 13){
        $(this).trigger('activate');
      }
    });

  },
  unload: function() {
    $('.faq-accordion > dt > button').off('click activate');
    $('.faq-accordion > dt > button').off('keydown');
  }
}