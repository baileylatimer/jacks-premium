const deferred = {};

Shopify.theme.asyncView = {
  /**
   * Load the template given by the provided URL into the provided
   * view
   *
   * @param {string} url - The url to load.
   * @param {string} view - The view to load into.
   * @param {object} options - Config options.
   * @param {string} options.hash - A hash of the current page content.
   */
  load: (url, view, options = {}) => {
    let data;
    if (url in deferred) {
      return deferred[url];
    }

    const $deferred = $.Deferred();

    deferred[url] = $deferred;

    if (options.hash) {
      data = sessionStorage.getItem(url);

      if (data) {
        const deserialized = JSON.parse(data);

        if (options.hash === deserialized.options.hash) {
          delete deferred[url];
          return $deferred.resolve(deserialized).promise();
        }
      }
    }

    // NOTE The $.ajax request has the cache option set to false.
    // This is to prevent certain browsers from returning cached
    // versions of the url we are requesting.
    // See this PR for more info: https://github.com/pixelunion/shopify-asyncview/pull/4
    $.ajax({
      url,
      cache: false,
      data: `view=${view}`,
      dataType: 'html',
      headers: {
        'cache-control': 'no-cache',
      },
      success: (response) => {

        const el = document.createElement('div');
        el.innerHTML = response;

        const responseOptions = JSON.parse(el.querySelector('[data-options]').innerHTML);
        const htmls = el.querySelectorAll('[data-html]');

        let html = {};

        if (htmls.length === 1 && htmls[0].getAttribute('data-html') === '') {
          html = htmls[0].innerHTML;
        } else {
          for (let i = 0; i < htmls.length; i++) {
            html[htmls[i].getAttribute('data-html')] = htmls[i].innerHTML;
          }
        }

        if (options.hash) {
          try {
            sessionStorage.setItem(
              url,
              JSON.stringify({ options: responseOptions, html }),
            );
          } catch (error) {
            console.error(error);
          }
        }

        delete deferred[url];
        return $deferred.resolve({ options: responseOptions, html });
      },
      error: () => {
        delete deferred[url];
        return $deferred.reject();
      }
      ,
    });

    return $deferred.promise();
  }
}
