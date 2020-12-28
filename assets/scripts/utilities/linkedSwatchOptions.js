/*============================================================================
Swatch options - second and third swatch 'sold-out' will update based on availability of previous options selected
==============================================================================*/
Shopify.theme.updateOptionsInSelector = function (selectorIndex, parent) {

  switch (selectorIndex) {
    case 0:
      var key = 'root';
      var selector = $(parent + ' .single-option-selector:eq(0)');
      break;
    case 1:
      var key = $(parent + ' .single-option-selector:eq(0)').val();
      var selector = $(parent + ' .single-option-selector:eq(1)');
      break;
    case 2:
      var key = $(parent + ' .single-option-selector:eq(0)').val();
      key += ' / ' + $(parent + ' .single-option-selector:eq(1)').val();
      var selector = $(parent + ' .single-option-selector:eq(2)');
  }

  var availableOptions = Shopify.optionsMap[key];
  $(parent + ' .swatch[data-option-index="' + selectorIndex + '"] .swatch-element').each(function () {
    if ($.inArray($(this).attr('data-value'), availableOptions) !== -1) {
      $(this).removeClass('soldout').find(':radio').removeAttr('disabled', 'disabled').removeAttr('checked');
    }
    else {
      $(this).addClass('soldout').find(':radio').removeAttr('checked').attr('disabled', 'disabled');
    }
  });

};

Shopify.linkOptionSelectors = function (product, parent) {
  // Building our mapping object.
  Shopify.optionsMap = {};
  for (var i = 0; i < product.variants.length; i++) {
    var variant = product.variants[i];
    if (variant.available) {
      // Gathering values for the 1st drop-down.
      Shopify.optionsMap['root'] = Shopify.optionsMap['root'] || [];
      Shopify.optionsMap['root'].push(variant.option1);
      Shopify.optionsMap['root'] = Shopify.uniq(Shopify.optionsMap['root']);
      // Gathering values for the 2nd drop-down.
      if (product.options.length > 1) {
        var key = variant.option1;
        Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
        Shopify.optionsMap[key].push(variant.option2);
        Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
      }
      // Gathering values for the 3rd drop-down.
      if (product.options.length === 3) {
        var key = variant.option1 + ' / ' + variant.option2;
        Shopify.optionsMap[key] = Shopify.optionsMap[key] || [];
        Shopify.optionsMap[key].push(variant.option3);
        Shopify.optionsMap[key] = Shopify.uniq(Shopify.optionsMap[key]);
      }
    }
  }
  // Update options right away.
  Shopify.theme.updateOptionsInSelector(0, parent);
  if (product.options.length > 1) Shopify.theme.updateOptionsInSelector(1, parent);
  if (product.options.length === 3) Shopify.theme.updateOptionsInSelector(2, parent);
  // When there is an update in the first dropdown.
  $(parent + " .single-option-selector:eq(0)").change(function () {
    Shopify.theme.updateOptionsInSelector(1, parent);
    if (product.options.length === 3) Shopify.theme.updateOptionsInSelector(2, parent);
    return true;
  });
  // When there is an update in the second dropdown.
  $(parent + " .single-option-selector:eq(1)").change(function () {
    if (product.options.length === 3) Shopify.theme.updateOptionsInSelector(2, parent);
    return true;
  });
};