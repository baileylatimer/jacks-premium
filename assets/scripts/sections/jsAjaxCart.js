Shopify.theme.jsAjaxCart = {
  init: function ($section) {

    // Add settings from schema to current object
    Shopify.theme.jsAjaxCart = $.extend(this, Shopify.theme.getSectionData($section));

    if (isScreenSizeLarge() || this.cart_action == 'drawer') {
      this.initializeAjaxCart();
    } else {
      this.initializeAjaxCartOnMobile();
    }

    if (this.cart_action == 'drawer') {

      this.ajaxCartDrawer = $('[data-ajax-cart-drawer]');

      $(document).on('click', '[data-ajax-cart-trigger]', function (e) {
        e.preventDefault();
        Shopify.theme.jsAjaxCart.showDrawer();

        return false;
      });

    } else if (this.cart_action == 'mini_cart') {
      this.showMiniCartOnHover();
    }

    $(document).on('click', '.ajax-submit', function (e) {
      e.preventDefault();
      const $addToCartForm = $(this).closest('form');
      Shopify.theme.jsAjaxCart.addToCart($addToCartForm);

      return false;
    });

    $(document).on('click', '[data-ajax-cart-delete]', function (e) {
      e.preventDefault();
      const lineID = $(this).parents('[data-line-item]').data('line-item');
      Shopify.theme.jsAjaxCart.removeFromCart(lineID);

      if (Shopify.theme.jsCart) {
        Shopify.theme.jsCart.removeFromCart(lineID);
      }

      return false;
    });

    $(document).on('click', '[data-ajax-cart-close]', function (e) {
      e.preventDefault();
      Shopify.theme.jsAjaxCart.hideDrawer();
      Shopify.theme.jsAjaxCart.hideMiniCart();

      return false;
    });

  },
  showMiniCartOnHover: function () {
    const $el = $('[data-ajax-cart-trigger]');

    $el.hover(function() {
      if(Shopify.theme_settings.header_layout == 'centered' && $('.header-sticky-wrapper').hasClass('is-sticky')) {
        $('.header-sticky-wrapper [data-ajax-cart-trigger]').addClass('show-mini-cart');
      } else {
        $el.addClass('show-mini-cart');
      }
    }, function() {
      $el.removeClass('show-mini-cart');
    });
  },
  hideMiniCart: function () {
    if (this.cart_action != 'mini_cart') return false;
    const $el = $('[data-ajax-cart-close]').parents('[data-ajax-cart-trigger]');
    $el.removeClass('show-mini-cart');
  },
  toggleMiniCart: function() {

    const $el = $('.mobile-header [data-ajax-cart-trigger]');

    // Removes url to the cart page so user is not redirected
    $el.attr('href', '#');

    $el.off('click').on('click', function (e) {
      // If user clicks inside the element, do nothing
      if (e.target.closest('[data-ajax-cart-mini_cart]')) {
        return;
      }

      // Loads content into ajaxCart container for mobile header
      Shopify.theme.jsAjaxCart.initializeAjaxCartOnMobile();

      // If user clicks outside the element, toggle the mini cart
      $el.toggleClass('show-mini-cart');

      // Calculate height of mini cart
      let announcementHeight = 0;
      let mobileHeaderHeight = parseInt($('.mobile-header').height());

      if (typeof Shopify.theme.jsAnnouncementBar !== 'undefined' && Shopify.theme.jsAnnouncementBar.enable_sticky) {
        announcementHeight = Shopify.theme.jsAnnouncementBar.getAnnouncementHeight();
      }

      $('.mobile-header .theme-ajax-cart').css({ height: `calc(100vh - ${mobileHeaderHeight + announcementHeight}px)` });

    });

  },
  showDrawer: function () {
    if (this.cart_action != 'drawer') return false;
    this.ajaxCartDrawer.addClass('is-visible');
    $('.ajax-cart__overlay').addClass('is-visible');
  },
  hideDrawer: function () {
    if (this.cart_action != 'drawer') return false;
    this.ajaxCartDrawer.removeClass('is-visible');
    $('.ajax-cart__overlay').removeClass('is-visible');
  },
  removeFromCart: function (lineID, callback) {
    $.ajax({
      type: 'POST',
      url: '/cart/change.js',
      data: 'quantity=0&line=' + lineID,
      dataType: 'json',
      success: function (cart) {
        Shopify.theme.jsAjaxCart.updateView();
      },
      error: function (XMLHttpRequest, textStatus) {
        var response = eval('(' + XMLHttpRequest.responseText + ')');
        response = response.description;

      }
    });
  },
  initializeAjaxCart: function () {

    Shopify.theme.asyncView.load(
      Shopify.routes.cart_url, // template name
      'ajax', // view name (suffix)
    )
      .done(({ html, options }) => {

        $('[data-ajax-cart-content]').html(html.content);

        // Converting the currencies
        if (Currency.show_multiple_currencies) {
          Shopify.theme.currencyConverter.convertCurrencies();
        }

      })
      .fail(() => {
        // some error handling
      });
  },
  initializeAjaxCartOnMobile: function () {

    this.toggleMiniCart();

    Shopify.theme.asyncView.load(
      Shopify.routes.cart_url, // template name
      'ajax', // view name (suffix)
    )
      .done(({ html, options }) => {

        $('.mobile-header [data-ajax-cart-content]').html(html.content);

      })
      .fail(() => {
        // some error handling
      });
  },
  addToCart: function ($addToCartForm) {

    const $addToCartBtn = $addToCartForm.find('.button--add-to-cart');

    $.ajax({
      url: '/cart/add.js',
      dataType: 'json',
      cache: false,
      type: 'post',
      data: $addToCartForm.serialize(),
      beforeSend: function () {
        $addToCartBtn
          .attr('disabled', 'disabled')
          .addClass('disabled');

        $addToCartBtn.find('span')
          .removeClass("fadeInDown")
          .addClass('animated zoomOut');
      },
      success: function (product) {

        let $el = $('[data-ajax-cart-trigger]');

        $addToCartBtn
          .find('.checkmark')
          .addClass('checkmark-active');

        function addedToCart() {

          if (!isScreenSizeLarge()) {
            $el = $('.mobile-header [data-ajax-cart-trigger]');
            Shopify.theme.scrollToTop($el);
          } else {
            $el = $('[data-ajax-cart-trigger]');
          }

          $el.addClass('show-mini-cart');

          $addToCartBtn.find('span')
            .removeClass('fadeInDown');
        }

        window.setTimeout(function () {
          $addToCartBtn
            .removeAttr('disabled')
            .removeClass('disabled');

          $addToCartBtn.find('.checkmark')
            .removeClass('checkmark-active');

          $addToCartBtn.find('.text, .icon')
            .removeClass('zoomOut')
            .addClass('fadeInDown');

          $addToCartBtn.on('webkitAnimationEnd oanimationend msAnimationEnd animationend', addedToCart);

        }, 1000);

        Shopify.theme.jsAjaxCart.showDrawer();
        Shopify.theme.jsAjaxCart.updateView();

        if (Shopify.theme.jsCart) {
          $.ajax({
            dataType: "json",
            async: false,
            cache: false,
            dataType: 'html',
            url: "/cart",
            success: function (html) {
              const cartForm = $(html).find('.cart__form');
              $('.cart__form').replaceWith(cartForm);

            }
          });
        }

      },
      error: function (XMLHttpRequest) {
        let response = eval('(' + XMLHttpRequest.responseText + ')');
        response = response.description;

        const cartWarning = `<p class="cart-warning__message animated bounceIn">${response.replace('All 1 ', 'All ')}</p>`;

        $('.warning').remove();

        $addToCartForm
          .find('.cart-warning')
          .html(cartWarning);

        $addToCartBtn
          .removeAttr('disabled')
          .removeClass('disabled');

        $addToCartBtn.find('.icon')
          .removeClass('zoomOut')
          .addClass('zoomIn');

        $addToCartBtn.find('.text')
          .text(Shopify.translation.addToCart)
          .removeClass('zoomOut')
          .addClass('zoomIn');
      }
    });
  },
  updateView: function () {

    Shopify.theme.asyncView.load(
      Shopify.routes.cart_url, // template name
      'ajax', // view name (suffix)
    )
    .done(({ html, options }) => {

      if (options.item_count > 0) {
        const itemList = $(html.content).find('.ajax-cart__list');
        const cartDetails = $(html.content).find('.ajax-cart__details-wrapper');

        $('.ajax-cart__list').replaceWith(itemList);
        $('.ajax-cart__details-wrapper').replaceWith(cartDetails);
        $('.ajax-cart__empty-cart-message').addClass('is-hidden');
        $('.ajax-cart__form').removeClass('is-hidden');
        $('[data-ajax-cart-trigger]').addClass('has-cart-count');
        $('[data-bind="itemCount"]').text(options.item_count);

      } else {
        $('.ajax-cart__empty-cart-message').removeClass('is-hidden');
        $('.ajax-cart__form').addClass('is-hidden');
        $('[data-ajax-cart-trigger]').removeClass('has-cart-count');
        $('[data-bind="itemCount"]').text('0');
      }

      if (Currency.show_multiple_currencies) {
        Shopify.theme.currencyConverter.convertCurrencies();
      }

    })
    .fail(() => {
      // some error handling
    });
  },
  unload: function ($section) {

    // Clear event listeners in theme editor
    $('.ajax-submit').off();
    $('[data-ajax-cart-delete]').off();
  }
}
