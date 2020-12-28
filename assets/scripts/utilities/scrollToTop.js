Shopify.theme.scrollToTop = function (element, height) {

  // Check if height argument is present
  if(height != undefined) {
    $('html, body').animate({
      scrollTop: $(element).offset().top - height
    }, 1000);
  } else {
    $('html, body').animate({
      scrollTop: $(element).offset().top
    }, 1000);
  }
}
