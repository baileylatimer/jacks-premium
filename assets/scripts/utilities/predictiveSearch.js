Shopify.theme.predictiveSearch = {
  vars: {
    term: '',
    searchPath: '',
    displayTimer: ''
  },
  init: function() {

    this.unload();

    if (Shopify.theme_settings.search_option == 'product') {
      this.vars.searchPath = Shopify.routes.search_url + '?type=product&q=';
    } else {
      this.vars.searchPath = Shopify.routes.search_url + '?q=';
    }

    $('[data-show-search-trigger], [data-autocomplete-true] input').on('click touchstart', function(e) {
      if(!isScreenSizeLarge()) {
        e.stopPropagation();
        const formType = $(this).closest('form').find('[name="type"]').val();
        Shopify.theme.predictiveSearch.showMobileSearch(formType);
      }
    });

    // Focus state to display search results
    $('[data-autocomplete-true]').on('focus', function() {
      $(this).parents('[data-autocomplete-true]').find('.search__results-wrapper').show();
    });

    // Clicking outside makes the results disappear.
    $(document).on('click focusout', function(e) {
      if (Shopify.media_queries.large.matches) {
        var searchForm = $(e.target).parents('.search-form');

        if(searchForm.length === 0) {
          $('[data-autocomplete-true] .search__results-wrapper').hide().removeClass('results-found');
        }
      }
    });

    // Submit wildcard searches
    $("[data-autocomplete-true] form").on("submit", function(e) {
      e.preventDefault();
      const formValue = $(this).find('input[name="q"]').val();
      const cleanFormValue = encodeURI(formValue);

      if (cleanFormValue == null) {
        window.location.href = Shopify.routes.search_url;
      } else {
        window.location.href = Shopify.theme.predictiveSearch.vars.searchPath + cleanFormValue + '*';
      }
    });

    $('[data-autocomplete-true] form').each(function() {
      const $this = $(this);
      const input = $this.find('input[name="q"]');

      // Adding a list for showing search results.
      const resultWrapper = `
        <div class="search__results-wrapper">
          <h2 class="vertical-search__title">
            ${Shopify.translation.top_suggestions}
          </h2>
          <ul class="search__results"></ul>
        </div>
      `;

      $(resultWrapper).appendTo($this);

      input.attr('autocomplete', 'off').on('input', function() {
        clearTimeout(Shopify.theme.predictiveSearch.vars.displayTimer);
        if ($(this).val().length > 3) {
          Shopify.theme.predictiveSearch.vars.term = $(this).val();
          Shopify.theme.predictiveSearch.getResults(Shopify.theme.predictiveSearch.vars.term, $this);
        } else {
          $('[data-autocomplete-true] .search__results-wrapper').hide().removeClass('results-found');
        }
      });
    });
  },
  getResults: function(term, $this) {

    let searchType = Shopify.theme_settings.search_option;

    if($this.find('[name="type"]').length > 0) {
      searchType = $this.find('[name="type"]').val();
    }

    jQuery.getJSON("/search/suggest.json", {
      "q": term,
      "resources": {
        "type": searchType,
        "limit": Shopify.theme_settings.search_to_display,
        "options": {
          "unavailable_products": "last",
          "fields": "title,body,variants.title,vendor,product_type,tag"
        }
      }
    }).done(function(response) {

      const suggestions = [
        response.resources.results.products,
        response.resources.results.pages,
        response.resources.results.articles
      ];

      let filteredResults = [];

      // Store results in array
      $.each(suggestions, function(index, suggestion) {
        if (suggestion !== undefined && suggestion.length > 0) { // Ensure suggestion exists
          filteredResults.push(suggestion)
        }
      })

      // Display results
      Shopify.theme.predictiveSearch.vars.displayTimer = setTimeout(function(){
        Shopify.theme.predictiveSearch.displayResults(filteredResults[0], $this);
      }, 500)

    });
  },
  displayResults: function(results, $this) {
    const $resultsWrapper = $this.find('.search__results-wrapper');
    const $resultsList = $this.find('.search__results');
    $resultsWrapper.show();
    $resultsList.empty();

    if (results && results.length > 0) {

      $.each(results, function(index, result) {

        let link = $('<a tabindex="0"></a>').attr('href', result.url);
        if (Shopify.routes.root_url !== '/') {
          link = $('<a tabindex="0"></a>').attr('href', Shopify.routes.root_url + result.url);
        }

        // if result is a product
        if (result['price']) {


          function formatPrice(price) {
            if (Currency.display_format === 'money_with_currency_format') {
              return `<span class="money"> ${Currency.symbol + price} ${Currency.iso_code} </span>`;
            } else {
              return `<span class="money"> ${Currency.symbol + price} </span>`;
            }
          }

          let itemPrice;

          if (result.available === true) {
            if(result.compare_at_price_max > result.price_max || result.compare_at_price_min > result.price_min ) {
              itemPrice = `${formatPrice(result.price)} <span class="was-price">${formatPrice(result.compare_at_price_max)}</span>`;
            } else {
              if (result.price > 0) {
                if (result.price_min != result.price_max) {
                  itemPrice = `${Shopify.translation.from} ${formatPrice(result.price)}` ;
                } else {
                  itemPrice = `${formatPrice(result.price)}`;
                }
              } else {
                itemPrice = Shopify.theme_settings.free;
              }
            }
          } else {
            itemPrice = Shopify.translation.soldOut;
          }

          // If result has image
          if (result['image']) {
            link.append(`<div class="thumbnail"><img class="lazyload transition--${Shopify.theme_settings.image_loading_style}" src="${Shopify.theme.addImageDimension(result['image'], '_300x')}" /></div>`);
          }

          link.append(`<div class="description"><strong>${result.title}</strong><br><span class="item-pricing price">${itemPrice}</span></div>`);

          // if result is an article
        } else if(result['summary_html']) {

          if(result.image != 'NULL') {
            link.append(`<div class="thumbnail"><img class="lazyload transition--${Shopify.theme_settings.image_loading_style}" src="${Shopify.theme.addImageDimension(result['image'], '_300x')}" /></div>`);
          }
          link.append(`<div class="description"><strong>${result.title}</strong><br><span class="item-description">'${result.summary_html.replace(/(<([^>]+)>)/ig,"").slice(0, 25)}</span></div>`);

          // if result is a page
        } else if(result['published_at']) {

          link.append(`<div class="description"><strong>${result.title}</strong><br><span class="item-description">${result.body.replace(/(<([^>]+)>)/ig,"").slice(0, 25)}</span></div>`);

        }

        // Wrap link and append to list
        link.wrap('<li class="item-result"></li>');
        $resultsList.append(link.parent());

        if (Currency.show_multiple_currencies || Currency.native_multi_currency) {
          Shopify.theme.currencyConverter.init();
        }
      });

      $resultsList.prepend(`<li class="all-results"><span class="see-all"><a href="${this.vars.searchPath + this.vars.term}*"> ${Shopify.translation.all_results} ${Shopify.icons.right_caret}</a></span></li>`);
      $resultsList.parents('.search__results-wrapper').addClass('results-found');

    } else {
      // if no results
      const noResults = `<li class="item-result"><span class="no-results">${Shopify.translation.no_results}</span></li>`;
      $resultsList.append(noResults);
      $resultsList.parents('.search__results-wrapper').removeClass('results-found');
    }

    if ($this.parents('.vertical-header__content').length && Shopify.theme.jsHeader.header_layout === 'vertical') {
      Shopify.theme.predictiveSearch.alignVerticalSearch();
    }

    $resultsList.show();
  },
  showMobileSearch: function(formType) {
    $('body').addClass('mobile-menu--opened').css('max-height', window.innerHeight);
    $('.mobile-search').fadeIn(200);
    $('.mobile-search input#q').focus();

    const searchHeight = window.innerHeight - 46; //Full screen height - form height
    $('.mobile-search .search__results-wrapper').css('max-height', searchHeight)

    if (formType) {
      $('.mobile-search [name="type"]').val(formType);
    } else {
      $('.mobile-search [name="type"]').val(Shopify.theme_settings.search_option);
    }

    $('.search-form .close-search').on('click touchstart', function(e) {
      Shopify.theme.predictiveSearch.hideMobileSearch();
      $('[data-autocomplete-true] .search__results-wrapper').hide().removeClass('results-found');
    });

    $('.search-form .submit-search').on('click touchstart', function(e) {
      $(this).parents('form').submit();
    });
  },
  hideMobileSearch: function() {
    $('body').removeClass('mobile-menu--opened').css('max-height', 'none');
    $('.mobile-search').fadeOut(200);
    $('.mobile-search [name="q"]').val('');

    $('body').off('focus', '.search-form .close-search');
    $('body').off('focus', '.search-form .submit-search');
  },
  alignVerticalSearch: function() {
    const $resultsList = $('.header--vertical .search__results');
    const headerWidth = $('.header--vertical').innerWidth();
    $resultsList.parents('.search__results-wrapper').css({
      'position': 'fixed',
      'left': headerWidth,
      'top': '0'
    });
  },
  unload: function() {
    $('body').off('focus', '[data-autocomplete-true] input');
    $('input[name="q"]').off();
    $('[data-dropdown-rel="search"], [data-autocomplete-true] input').off();
    $('.search__results-wrapper').remove();
  }
}
