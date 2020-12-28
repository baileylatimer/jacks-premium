Shopify.theme.jsAccounts = {
  init: function($section){

    $('.js-recover-password').on('click', function(){
      $('#login').hide();
      $('#recover-password').show();
    });

    $('.cancel-recover-password').on('click', function(){
      $('#recover-password').hide();
      $('#login').show();
    })

  },

  unload: function($section) {
    $('.js-recover-password').off();
    $('.cancel-recover-password').off();
  }
}
