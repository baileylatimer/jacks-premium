Shopify.theme.infiniteScroll = {
  init: function () {

    this.defaults = {
      grid: '[data-load-more--grid]',
      gridItems: '[data-load-more--grid-item]'
    }

    $('body').on('click', '[data-load-more]', function (e) {

      e.preventDefault();

      const $button = $(this);
      const url = $button.attr('href');

      Shopify.theme.infiniteScroll.loadNextPage(url, $button);
    });

    $('body').on('click', '[data-load-more-infinite]', function (e) {

      Shopify.theme.infiniteScroll.enableInfinite();

      $(this).remove();

      // Prevent link from going to next page
      e.stopPropagation();
      return false;
    });

    if ($('[data-load-infinite-scroll]').length) {
      Shopify.theme.infiniteScroll.enableInfinite();
    }
  },
  loadNextPage: function (url, $button) {

    $.ajax({
      type: 'GET',
      dataType: 'html',
      url: url,
      beforeSend: function () {
        $button.addClass('is-loading');
      },
      success: (data) => {
        $button.removeClass('is-loading');

        const thumbnails = $(data).find(this.defaults.gridItems);
        const loadMoreButtonUrl = $(data).find('[data-load-more]').attr('href');

        $('[data-load-more]').attr('href', loadMoreButtonUrl);
        $(this.defaults.grid).first().append(thumbnails);

        // When there are no additional pages, hide load more button
        if (typeof loadMoreButtonUrl == 'undefined') {
          $('[data-load-more]').addClass('is-hidden');
        }

      },
      error: function (x, t, m) {
        console.log(x);
        console.log(t);
        console.log(m);
        location.replace(location.protocol + '//' + location.host + filterURL);

      }
    });
  },
  enableInfinite: function () {

    var infiniteScroll = new Waypoint.Infinite({
      element: $(this.defaults.grid)[0],
      items: '[data-load-more--grid-item]',
      more: '[data-load-infinite]',
      loadingClass: 'loading-in-progress',
      onBeforePageLoad: function () {
        $('[data-load-infinite]').removeClass('is-hidden');
      },
      onAfterPageLoad: function (data) {

      }
    })
  },
  unload: function () {
    $('[data-load-more]').off();
    $('[data-load-infinite]').off();
  }
}
