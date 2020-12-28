Shopify.theme.loadScript = function (name, url, callback) {
  if (Shopify.theme[name]) {
    callback;
  } else {
    $.ajax({
      url: url,
      dataType: 'script',
      success: callback,
      async: false
    });
  }
}