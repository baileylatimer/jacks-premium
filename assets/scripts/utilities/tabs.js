Shopify.theme.tabs = {
  enableTabs: function() {

    let $tabs = $('.tabs li, .tabs li a');

    $tabs.on('click', function(el){

      el.preventDefault();

      // toggle active tab
      $tabs.removeClass('is-active active');
      $(this).addClass('is-active');

      let $tabIndex = $(this).index();
      let $tabContent = $(this).parents('.tabs').next('.tabs-content');

      // toggle corresponding tab content
      $tabContent.children('li, li a').removeClass('is-active active');
      $tabContent.children('li, li a').eq($tabIndex).addClass('is-active').show().css({'display': 'block'}).siblings().hide().removeClass('is-active');
    });
  },
  unload: function() {
    $('.tabs li, .tabs li a').off();
  }
}
