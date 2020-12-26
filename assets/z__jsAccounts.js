"use strict";

Shopify.theme.jsAccounts = {
  init: function init($section) {
    $('.js-recover-password').on('click', function () {
      $('#login').hide();
      $('#recover-password').show();
    });
    $('.cancel-recover-password').on('click', function () {
      $('#recover-password').hide();
      $('#login').show();
    });
  },
  unload: function unload($section) {
    $('.js-recover-password').off();
    $('.cancel-recover-password').off();
  }
};