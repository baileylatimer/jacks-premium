Shopify.theme.dropdownMenu = function () {

  // Grab menu items
  const menuItems = $('.navbar-link');

  // Grab dropdowns
  const dropdowns = $('.navbar-dropdown');

  // Grab megamenus

  const megamenus = $('.has-mega-menu');

  // Listen for enter key
  menuItems.each(function(index, item) {
    let itemVisited = false;
    $(item).on('keydown', function(e) {

      // Check if enter key
      if (e.which === 13) {

        // Prevent it from going to the link
        if (itemVisited === false) {
          e.preventDefault();
        }

        // Show dropdown
        $(this).closest('.navbar-item').addClass('show-dropdown');

        // Reset itemVisited so that they can visit the link
        itemVisited = true;
      }
    })

    $(item).closest('.navbar-item').on('focusout', function(e) {
      if($(this).find(e.relatedTarget).length === 0) {
        $(item).closest('.navbar-item').removeClass('show-dropdown');
      }
    })
  })

  // Listen for enter key
  dropdowns.each(function(index, item) {
    let itemVisited = false;
    $(item).on('keydown', function(e) {

      // Check if enter key
      if (e.which === 13) {

        // Prevent it from going to the link
        if (itemVisited === false) {
          e.preventDefault();
        }

        if ($(this).find('.has-submenu').length > 0) {
          $(this).addClass('show-nested-dropdown');
        }

        // Reset itemVisited so that they can visit the link
        itemVisited = true;

      }
    })
  })

  // Listen for enter key
  megamenus.each(function(index, item) {
    let itemVisited = false;
    $(item).on('keydown', function(e) {

      // Check if enter key
      if (e.which === 13) {

        // Prevent it from going to the link
        if (itemVisited === false) {
          e.preventDefault();
        }

        // Show megamenu
        $(this).find('.mega-menu').addClass('mega-menu--show');

        // Reset itemVisited so that they can visit the link
        itemVisited = true;

      }
    })

    // Hide mega menu on focusout
    $(item).on('focusout', function(e) {
      if($(item).find(e.relatedTarget).length === 0) {
        $(item).find('.mega-menu').removeClass('mega-menu--show');
      }
    })
  })
}
