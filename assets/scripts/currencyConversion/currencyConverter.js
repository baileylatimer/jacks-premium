Shopify.theme.currencyConverter = {
  init: function init(settings) {
    this.defaults = {
      switcherSelector: '[data-currency-converter]',
      priceSelector: 'span.money',
      shopCurrency: Currency.shop_currency,
      defaultCurrency: Currency.default_currency,
      displayFormat: Currency.display_format,
      moneyFormat: Currency.money_format,
      moneyFormatNoCurrency: Currency.money_format_no_currency,
      moneyFormatCurrency: Currency.money_format_currency
    };
    this.options = this.defaults;
    this.moneyFormats = moneyFormats;
    this.storage = 'currency';
    this.currentCurrency = null;
    this.isInitialised = false;
    if (!window.Currency || this.isInitialised) return;
    $(this.options.switcherSelector).on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var $currencySelector = $(this);
      Shopify.theme.currencyConverter.setCurrency($currencySelector.val());
    });
    this.currentCurrency = this._getStoredCurrency() || this.options.defaultCurrency;

    //gets negated with shopify multiple currency
    this.moneyFormats[this.options.shopCurrency].money_with_currency_format = this.options.moneyFormatCurrency;
    this.moneyFormats[this.options.shopCurrency].money_format = this.options.moneyFormatNoCurrency;
    this.isInitialised = true;

    this._current();

  },
  setCurrency: function setCurrency(newCurrency) {
    /**
    * Change the currency to a new currency using an ISO currency code
    *
    * @param {String} newCurrency - New currency to convert prices to
    */
    if (!this.isInitialised) return;

    this._convertAll(newCurrency);
  },
  update: function update(priceEl) {
    /**
    * Update a price on the page from shop currency to the active currency, and formatting
    *
    * @param priceEl {HTMLElement} - element containing price text, in the shop currency
    */
    if (!this.isInitialised) return; // unset any stored previous conversions and the data-currency attribute itself

    var attributes = priceEl.attributes;

    for (var attr = 0; attr < attributes.length; attr++) {
      var attribute = attributes[attr];

      if (attribute.name.indexOf('data-currency') === 0) {
        priceEl.setAttribute(attribute.name, '');
      }
    }

    this._convertEl(priceEl, this.currentCurrency);
  },
  _getStoredCurrency: function _getStoredCurrency() {
    /**
    * Return the stored currency from the client's browser
    * @returns {String}
    * @private
    */
    try {
      return localStorage.getItem(this.storage);
    } catch (error) {
      console.warn(error);
      return this.options.defaultCurrency;
    }
  },
  _setStoredCurrency: function _setStoredCurrency(currency) {
    /**
    * Save the client's currency in localstorage for persistence across pages
    * and sessions
    * @param {String} currency
    * @private
    */
    try {
      localStorage.setItem(this.storage, currency);
    } catch (error) {
      console.warn(error);
    }
  },
  _current: function _current() {
    /**
    * Update the currency switcher to the current currency
    * @private
    */
    var switchers = document.querySelectorAll(this.options.switcherSelector);

    for (var i = 0; i < switchers.length; i += 1) {
      var switcher = switchers[i];
      var childrenEls = switcher.querySelectorAll('option');

      for (var j = 0; j < childrenEls.length; j += 1) {
        var optionEl = childrenEls[j];

        if (optionEl.selected && optionEl.value !== this.currentCurrency) {
          optionEl.selected = false;
        }

        if (optionEl.value === this.currentCurrency) {
          optionEl.selected = true;
        }
      }
    }

    this._convertAll(this.currentCurrency);
  },
  _convertEl: function _convertEl(priceEl, newCurrency) {
    /**
    * Converts an individual price to the new format
    *
    * @param {Element} priceEl - Node element containing price
    * @param {String} oldCurrency - Currency of element converting from
    * @param {String} newCurrency - Currency to convert to
    * @private
    */
    var oldCurrency = this.options.shopCurrency; // If the amount has already been converted, we leave it alone.

    if (priceEl.getAttribute('data-currency') === newCurrency) {
      return;
    } // If we are converting to a currency that we have saved, we will use the saved amount.


    if (priceEl.getAttribute("data-currency-".concat(newCurrency))) {
      priceEl.innerHTML = priceEl.getAttribute("data-currency-".concat(newCurrency));
    } else {
      var oldFormat = this.moneyFormats[oldCurrency][this.options.displayFormat];
      var newFormat = this.moneyFormats[newCurrency][this.options.displayFormat];


      var moneyValue = getMoneyValue(priceEl);
      var centsValue = getCentsValue(moneyValue, oldFormat, oldCurrency); // Cents value is empty, but not 0. 0$ is a valid price, while empty is not

      if (centsValue === '') return;
      var cents = window.Currency.convert(centsValue, oldCurrency, newCurrency);
      var oldPriceFormatted = formatMoney(centsValue, oldFormat);
      var priceFormatted = formatMoney(cents, newFormat);

      if (!priceEl.getAttribute('data-currency-original')) {
        priceEl.setAttribute('data-currency-original', oldPriceFormatted);
      }

      priceEl.setAttribute("data-currency-".concat(oldCurrency), oldPriceFormatted);
      priceEl.setAttribute("data-currency-".concat(newCurrency), priceFormatted);
      priceEl.innerHTML = priceFormatted;
    }

    priceEl.setAttribute('data-currency', newCurrency);
  },
  _convertAll: function _convertAll(newCurrency) {
    /**
    * Convert all prices on the page to the new currency
    *
    * @param {String} oldCurrency - Currency of element converting from
    * @param {String} newCurrency - Currency to convert to
    * @private
    */

    // if custom theme currency converter is enabled, we'll convert all the prices, else we just need to convert the shipping calculator prices
    if (Currency.show_multiple_currencies) {
      var priceEls = document.querySelectorAll(this.options.priceSelector);
    } else {
      var priceEls = document.querySelectorAll('#wrapper-response span.money, #estimated-shipping span.money');
    }

    if (!priceEls) return;
    this.currentCurrency = newCurrency;
    $('.currency-code').text(this.currentCurrency)

    this._setStoredCurrency(newCurrency);

    // only if Shopify multi currency is disabled, run convertEl function
    for (var i = 0; i < priceEls.length; i += 1) {
      this._convertEl(priceEls[i], newCurrency);
    }
  },
  convertCurrencies: function() {
    if (Currency.show_multiple_currencies) {
      var $currencySelector = $('.currency-code').first().text();
    } else {
      var $currencySelector = $('#CurrencySelector').first().val();
    }

    Shopify.theme.currencyConverter.setCurrency($currencySelector);
  }
};
