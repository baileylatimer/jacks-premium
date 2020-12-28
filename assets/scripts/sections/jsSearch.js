Shopify.theme.jsSearch = {
  init: function($section) {

    // Add settings from schema to current object
    Shopify.theme.jsSearch = $.extend(this, Shopify.theme.getSectionData($section));

    // If breadcrumbs enabled and basic pagination is set, call breadcrumbs object
    if (this.enable_breadcrumb && this.pagination_type == 'basic_pagination') {
      Shopify.theme.breadcrumbs.init(this.number_of_pages);
    }
  },
  unload: function($target) {
    Shopify.theme.breadcrumbs.unload();
  }
}

