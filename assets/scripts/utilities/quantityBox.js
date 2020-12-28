Shopify.theme.quantityBox = {
  init: function () {

    $('body').on('click', '[data-update-quantity]:not([disabled])', function () {
      Shopify.theme.quantityBox.updateQuantity($(this));
    });

    $('body').on('keyup keydown change', '.quantity-input', function () {
      Shopify.theme.quantityBox.updateQuantity($(this));
    });
  },
  updateQuantityControls: function($el) {
    const $quantityBox = $el.parents('.product-quantity-box');
    const $input = $('.quantity-input', $quantityBox);

    let val = parseInt($input.val());
    let valMax = 100000000000000000;

    if ($input.attr('max') != null) {
      valMax = $input.attr('max');
    }

    if (val === 1 || val === 0) {
      $('.quantity-minus', $quantityBox).attr('disabled', true);
      $('.quantity-plus', $quantityBox).attr('disabled', false);
    } else if (val >= valMax) {
      $('.quantity-plus', $quantityBox).attr('disabled', true);
      $('.quantity-minus', $quantityBox).attr('disabled', false);
      $input.val(valMax);
    } else {
      $('.quantity-minus', $quantityBox).attr('disabled', false);
      $('.quantity-plus', $quantityBox).attr('disabled', false);
    }
  },
  updateQuantity: function ($el) {
    const $quantityBox = $el.parents('.product-quantity-box');
    const $input = $('.quantity-input', $quantityBox);
    const lineID = $quantityBox.parents('[data-line-item]').data('line-item');

    let val = parseInt($input.val());
    let valMax = 100000000000000000;
    let valMin = $input.attr('min') || 0;

    if ($input.attr('max') != null) {
      valMax = $input.attr('max');
    }

    if (isNaN(val) || val < valMin) {
      $input.val(valMin);
      return false;
    } else if (val > valMax) {
      $input.val(valMax);
      return false;
    }

    if ($el.data('update-quantity') === 'plus') {

      // Increase quantity input by one
      if (val < valMax) {
        val++;
        $input.val(val);
      }
    } else if ($el.data('update-quantity') === 'minus') {
      // Decrease quantity by one
      if (val > valMin) {
        val--;
        $input.val(val);
      }
    }

    // Update quantity if within cart (vs on the product page)
    if ($el.parents('[data-line-item]').length) {
      const lineID = $quantityBox.data('line-item-key');

      Shopify.theme.quantityBox.updateCart(lineID, val);
    }

    // Call to update quantity controls
    Shopify.theme.quantityBox.updateQuantityControls($el);
  },
  updateCart: function (lineID, quantity) {

    $('.quantity-warning').removeClass('animated bounceIn');

    $.ajax({
      type: 'POST',
      url: '/cart/change.js',
      data: `quantity=${quantity}&line=${lineID}`,
      dataType: 'json',
      success: function (cart) {

        let newQuantity = 0;
        let itemsLeftText = '';
        let quantityWarning = $(`[data-line-item="${lineID}"]`).find('.quantity-warning');
        let $quantityBox = $(`[data-line-item="${lineID}"]`).find('.product-quantity-box');
        let $currentDiscount = $('.cart__form').data('currentDiscount');


        //check to see if there are correct amount of products in array
        const cartItemsLineID = lineID - 1;
        if (typeof cart.items[cartItemsLineID] !== "undefined") {
          newQuantity = cart.items[cartItemsLineID].quantity;
        }



        for(let i = 0; i < cart.items.length; i++) {
          if(i != cartItemsLineID) {
            if(cart.items[i].id == cart.items[cartItemsLineID].id) {
              newQuantity += cart.items[i].quantity;
            }
          }
        }

        if (quantity > 0 && quantity != newQuantity) {
          //Check if total discount has changed
          if(cart.total_discount <= $currentDiscount) {
            if (newQuantity == 1) {
              itemsLeftText = Shopify.translation.product_count_one;
              quantityWarning.text(`${newQuantity} ${itemsLeftText}`);
              $('.quantity-minus', $quantityBox).attr('disabled', true);
            } else {
              itemsLeftText = Shopify.translation.product_count_other;
              quantityWarning.text(`${newQuantity} ${itemsLeftText}`);
            }
          }
        }

        //Update total discount value
        $('.cart__form').data('currentDiscount', cart.total_discount);

        // Apply quantity warning
        quantityWarning.addClass('animated bounceIn');

        if (typeof Shopify.theme.jsAjaxCart !== 'undefined') {
          Shopify.theme.jsAjaxCart.updateView();
        }

        if (Shopify.theme.jsCart) {
          Shopify.theme.jsCart.updateView(cart, lineID);
        }

      },
      error: function (XMLHttpRequest, textStatus) {
        var response = eval('(' + XMLHttpRequest.responseText + ')');
        response = response.description;

      }
    });

  },
  unload: function ($target) {
    $('.quantity-input').off();
    $('[data-update-quantity]').off();
  }
}
