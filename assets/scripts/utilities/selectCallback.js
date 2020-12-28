const selectCallback = function (variant, selector) {

  var $product = $('.product-' + selector.product.id);
  var $notify_form = $('.notify-form-' + selector.product.id);
  var $productForm = $('.product_form, .shopify-product-form', $product);
  var variantInventory = $productForm.data('variant-inventory');
  var $productFormInput = $productForm.find('.quantity-input');

  var $notifyFormInputs = $('.notify_form__inputs');
  var notifyEmail = Shopify.translation.notify_form_email;
  var notifyEmailValue = Shopify.translation.contact_email;
  var notifySend = Shopify.translation.notify_form_send;

  var notifyUrl = $notifyFormInputs.data('url');

  if (variant) {
    if (variant.title != null) {
    // Escape variant titles
      var variantTitle = variant.title.replace(/"/g,'\&quot;');
      var notifyMessage = Shopify.translation.email_content + variantTitle + ' | ' + notifyUrl + '?variant=' + variant.id;
    }
  } else {
    var notifyMessage = Shopify.translation.email_content +  ' | ' + notifyUrl;
  }



  if ($notifyFormInputs.hasClass('customer--true')) {
    var notifyCustomerEmail = Shopify.translation.customer_email;
    var notifyEmailInput = `
      <input type="hidden" class="notify_email input" name="contact[email]" id="contact[email]" value="${notifyCustomerEmail}" />`;
  } else {
    var notifyEmailInput = `
      <input required type="email" class="notify_email input" name="contact[email]" id="contact[email]" placeholder="${notifyEmail}" value="${notifyEmailValue}" />`;
  }

  var notifyFormHTML = `
    <input type="hidden" name="challenge" value="false" />
    <input type="hidden" name="contact[body]" class="notify_form_message" data-body="${notifyMessage}" value="${notifyMessage}" />
    <div class="field has-addons">
      <div class="control">
        ${notifyEmailInput}
      </div>
      <div class="control">
        <input class="action_button button" type="submit" value="${notifySend}" />
      </div>
    </div>`;

  //Image Variant feature
  if (variant && variant.featured_image && $product.is(":visible")) {

    var $sliders = $('.product-gallery__main, .js-gallery-modal', $product);
    $sliders.each(function() {
      var $slider = $(this);
      var $sliderInstance = Flickity.data(this);
      var index = $(`img[data-image-id=${variant.featured_media.id}]`).data('index');
      if ($slider.is(":visible") && $sliderInstance != undefined) {
        $sliderInstance.select(index, false, true);
      };
    });
  }

  // Emits custom event
  const $selectDropdown = $productForm.find('[data-variant-selector]');
  $selectDropdown.trigger('selectedVariantChanged');

  if (variant) {

    if (variantInventory) {
      variantInventory.forEach(function (v) {
        if (v.id === variant.id) {
          variant.inventory_quantity = v.inventory_quantity;
          variant.inventory_management = v.inventory_management;
          variant.inventory_policy = v.inventory_policy;
        }
      });
    }

    $('.sku', $product).text(variant.sku);

    if (Shopify.theme_settings.product_form_style) {
      for (var i = 0, length = variant.options.length; i < length; i++) {
        var radioButton = $productForm.find('.swatch[data-option-index="' + escape(i) + '"] :radio[value="' + variant.options[i].replace(/\"/g, '\\"') + '"]');
        if (radioButton.length) {
          radioButton.get(0).checked = true;
        }
      }
    } else {
      $(".notify_form_message", $product).attr("value", $(".notify_form_message", $product).data('body') + " - " + variant.title);
    }
  }

  if (variant && variant.available == true) {
    if (variant.price < variant.compare_at_price) {
      $('.was-price', $product).html('<span class="money">' + Shopify.formatMoney(variant.compare_at_price, $('body').data('money-format')) + '</span>');
      $('.savings', $product).html(Shopify.translation.product_savings + ' ' + parseInt(((variant.compare_at_price - variant.price) * 100) / variant.compare_at_price) + '% (' + '<span class="money">' + Shopify.formatMoney(variant.compare_at_price - variant.price, $('body').data('money-format')) + '</span>)');
      $('.current_price', $product).parent().addClass('sale');
    } else {
      $('.was-price', $product).html('');
      $('.savings', $product).html('');
      $('.current_price', $product).parent().removeClass('sale');
    }

    if (variant.inventory_management && variant.inventory_quantity > 0) {
      if (Shopify.theme_settings.display_inventory_left) {
        let items_left_text = Shopify.translation.product_count_other;
        if (variant.inventory_quantity == 1) {
          items_left_text = Shopify.translation.product_count_one;
        }

        var inventoryThreshold = Shopify.theme_settings.inventory_threshold;
        if (variant.inventory_quantity <= inventoryThreshold) {
          $('.items_left', $product).html(variant.inventory_quantity + " " + items_left_text);
        } else {
          $('.items_left', $product).html("");
        }
      }
      if (variant.inventory_policy == "deny") {
        $('[data-max-inventory-management]', $product).attr('max', variant.inventory_quantity);

        // Check to see if quantity selector should be disabled based on inventory remaining
        Shopify.theme.quantityBox.updateQuantityControls($productFormInput);
      }
    } else {
      $('.items_left', $product).text('');
      $('[data-max-inventory-management]', $product).removeAttr('max');
    }

    $('.sold_out', $product).text('');
    $('.cart-warning', $product).text('');

    if (variant.price > 0) {
      $('.current_price', $product).html('<span class="money">' + Shopify.formatMoney(variant.price, $('body').data('money-format')) + '</span>');
    } else {
      $('.current_price', $product).html(Shopify.translation.free_price_text);
    }

    $('[data-add-to-cart-trigger]', $product).removeClass('disabled').removeAttr('disabled').find('span:not(.icon)').text($('[data-add-to-cart-trigger]', $product).data('label'));

    $('.shopify-payment-button', $product).show();
    $('.purchase-details__quantity', $product).show();

    $notify_form.hide();
    $notifyFormInputs.empty();
    $notifyFormInputs.append(notifyFormHTML);
    if (Currency.show_multiple_currencies) {
      Shopify.theme.currencyConverter.convertCurrencies();
    }
  } else {
    var message = variant ? Shopify.translation.soldOut : Shopify.translation.unavailable;
    $('.was-price', $product).text('');
    $('.savings', $product).text('');
    $('.current_price', $product).text('');
    $('.items_left', $product).text('');
    $('[data-max-inventory-management]', $product).removeAttr('max');
    $('.sold_out', $product).text(message);
    $('[data-add-to-cart-trigger]', $product).addClass('disabled').attr('disabled', 'disabled').find('span:not(.icon)').text(message);
    $('.shopify-payment-button', $product).hide();
    $('.purchase-details__quantity', $product).hide();

    $notify_form.hide();
    $notifyFormInputs.empty();
    if (variant && !variant.available) {
      $notify_form.fadeIn();
      $notifyFormInputs.empty();
      $notifyFormInputs.append(notifyFormHTML);
    }
  }

};
