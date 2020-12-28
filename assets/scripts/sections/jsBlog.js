Shopify.theme.jsBlog = {
  init: function($section){

    // Add settings from schema to current object
    Shopify.theme.jsBlog = $.extend(this, Shopify.theme.getSectionData($section));

    if(this.enable_filter == true) {
      $('#blog_filter').on('change', function() {
        Shopify.theme.jsBlog.blogFilter();
      });
    }

  },
  blogFilter: function() {
    let url = $('#blog_filter').val();
    window.location = url;
  },
  unload: function($section) {
    $('#blog_filter').off();
  }
}