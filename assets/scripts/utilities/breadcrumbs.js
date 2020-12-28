Shopify.theme.breadcrumbs = {
  init: function (pages) {

    // Show pagination if number of pages is greater than 1
    if (pages > 1){
      const breadcrumbSpan = document.querySelector('[data-breadcrumb-text]');
      const currentPage = document.querySelector('.paginate').dataset.currentPage ? document.querySelector('.paginate').dataset.currentPage : 1;
      const totalPages = document.querySelector('.paginate').dataset.paginatePages;

      document.querySelector('.js-breadcrumb-text').classList.remove('is-hidden');

      breadcrumbSpan.innerHTML = `${Shopify.translation.page_text} ${currentPage} ${Shopify.translation.of_text} ${totalPages}`;
    }
  },
  unload: function ($target) {
    document.querySelector('.js-breadcrumb-text').classList.add('is-hidden');
  }
}
