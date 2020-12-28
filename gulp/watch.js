// grab our gulp packages
const gulp = require('gulp');
const gutil = require('gulp-util');
const combine = require('gulp-scss-combine');
const concat = require('gulp-concat');
const watch = require('gulp-watch');
const babel = require('gulp-babel');
const changed = require('gulp-changed');
const rename = require('gulp-rename');

const handleError = (error) => {
  console.log(error.toString());
  this.emit('end');
}

const SRC = 'assets/scripts/sections/*.js';
const DEST = 'assets/';

gulp.task('babel', done => {
  gulp.src(SRC)
  .pipe(changed(DEST))
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .on('error', handleError)
  .pipe(rename({
    prefix: "z__"
  }))
  .pipe(gulp.dest(DEST))
  done();
});

gulp.task('combine_css', done => {
  gulp.src([
    //Vendors
    'assets/styles/vendors/animate.scss',
    'assets/styles/vendors/flickity.scss',
    'assets/styles/vendors/lazyframe.scss',
    'assets/styles/vendors/plyr.scss',
    'assets/styles/vendors/model-viewer.scss',

    

    //Custom


    // 'assets/styles/custom/reset.scss',
    // 'assets/styles/custom/breakpoints.scss',
    // 'assets/styles/custom/mixins.scss',
    'assets/styles/custom/colors.scss',
    // 'assets/styles/custom/spacing.scss',
    // 'assets/styles/custom/grid-layout.scss',
    // 'assets/styles/custom/shared-styles.scss',
    // 'assets/styles/custom/typography.scss',
    // 'assets/styles/custom/icons.scss',
    // 'assets/styles/custom/buttons.scss',
    // 'assets/styles/custom/forms.scss',
    // 'assets/styles/custom/z-index.scss',
    // 'assets/styles/custom/visibility.scss',
    // 'assets/styles/custom/accessibility.scss',
    // 'assets/styles/custom/util.scss',


    //Default
    'assets/styles/functions.scss',
    'assets/styles/variables.scss',
    'assets/styles/mixins.scss',
    'assets/styles/normalize.scss',
    'assets/styles/generic.scss',
    'assets/styles/fonts.scss',
    'assets/styles/typography.scss',
    'assets/styles/animations.scss',
    'assets/styles/helpers.scss',
    'assets/styles/vendors/vendor_specific.scss',

    //Layout
    'assets/styles/layout/grid.scss',
    'assets/styles/layout/control.scss',
    'assets/styles/layout/media.scss',
    'assets/styles/layout/tile.scss',
    //Elements
    'assets/styles/elements/badge.scss',
    'assets/styles/elements/button.scss',
    'assets/styles/elements/content.scss',
    'assets/styles/elements/disclosure.scss',
    'assets/styles/elements/icon.scss',
    'assets/styles/elements/image.scss',
    'assets/styles/elements/notification.scss',
    'assets/styles/elements/other.scss',
    'assets/styles/elements/placeholder.scss',
    'assets/styles/elements/social-share.scss',
    'assets/styles/elements/tag.scss',
    //Components
    'assets/styles/components/ajax-cart.scss',
    'assets/styles/components/breadcrumb.scss',
    'assets/styles/components/card.scss',
    'assets/styles/components/card-v9.scss',
    'assets/styles/components/commerce.scss',
    'assets/styles/components/form.scss',
    'assets/styles/components/message.scss',
    'assets/styles/components/navbar.scss',
    'assets/styles/components/pagination.scss',
    'assets/styles/components/tabs.scss',
    //Product
    'assets/styles/product/product.scss',
    'assets/styles/product/product-form.scss',
    'assets/styles/product/product-media.scss',
    'assets/styles/product/product-thumbnail.scss',
    'assets/styles/product/quick-shop.scss',
    'assets/styles/product/size-chart.scss',
    'assets/styles/product/swatches.scss',
    //Sections
    'assets/styles/sections/announcement.scss',
    'assets/styles/sections/article.scss',
    'assets/styles/sections/banner.scss',
    'assets/styles/sections/contact-form.scss',
    'assets/styles/sections/featured-collection.scss',
    'assets/styles/sections/featured-promotions.scss',
    'assets/styles/sections/featured-product.scss',
    'assets/styles/sections/footer.scss',
    'assets/styles/sections/gallery.scss',
    'assets/styles/sections/header-centered.scss',
    'assets/styles/sections/header-classic.scss',
    'assets/styles/sections/header-search-focus.scss',
    'assets/styles/sections/header-vertical.scss',
    'assets/styles/sections/header.scss',
    'assets/styles/sections/heading.scss',
    'assets/styles/sections/icon-bar.scss',
    'assets/styles/sections/icon-with-text-column.scss',
    'assets/styles/sections/image-with-text.scss',
    'assets/styles/sections/image-with-text-overlay.scss',
    'assets/styles/sections/list-collections.scss',
    'assets/styles/sections/logo-list.scss',
    'assets/styles/sections/map.scss',
    'assets/styles/sections/mobile-header.scss',
    'assets/styles/sections/mega-menu.scss',
    'assets/styles/sections/popup.scss',
    'assets/styles/sections/rich-text.scss',
    'assets/styles/sections/search.scss',
    'assets/styles/sections/sidebar.scss',
    'assets/styles/sections/slideshow.scss',
    'assets/styles/sections/testimonial.scss',
    'assets/styles/sections/top-bar.scss',
    'assets/styles/sections/video.scss',
    //Templates
    'assets/styles/templates/accounts.scss',
    'assets/styles/templates/blog.scss',
    'assets/styles/templates/cart.scss',
    'assets/styles/templates/collection.scss',
    'assets/styles/templates/faq.scss',
    'assets/styles/templates/password.scss',
    //Custom
    'assets/styles/custom.scss'
  ]
  )
  .pipe(combine())
  .pipe(concat('styles.scss.liquid'))
  .on('error', handleError)
  .pipe(gulp.dest(DEST))
  done();
});

gulp.task('combine_vendors_js', done => {
  gulp.src([
    //Vendors
    'assets/scripts/vendors/instant-page.js',
    'assets/scripts/vendors/object-fit.js',
    'assets/scripts/vendors/lazysizes.min.js',
    'assets/scripts/vendors/flickity.js',
    'assets/scripts/vendors/fancybox.js',
    'assets/scripts/vendors/jsurl.js',
    'assets/scripts/vendors/stickykit.js',
    'assets/scripts/vendors/zoom.js',
    'assets/scripts/vendors/waypoints.js',
    'assets/scripts/vendors/jquery.sticky.js',
    'assets/scripts/vendors/js.cookie.js',
    'assets/scripts/vendors/isotope.min.js',
    'assets/scripts/vendors/modernizr.js',
    'assets/scripts/vendors/jquery.offscreen.js',
    'assets/scripts/vendors/lazyframe.js',
    'assets/scripts/vendors/theme-addresses.min.js',
    'assets/scripts/vendors/plyr.js'
  ]
  )
  .pipe(concat('vendors.js'))
  .on('error', handleError)
  .pipe(gulp.dest(DEST))
  done();

});

gulp.task('combine_utilities_js', done => {
  gulp.src([
    //Utilities
    'assets/scripts/utilities/contentCreatorAccordion.js',
    'assets/scripts/utilities/contentCreatorSlideshow.js',
    'assets/scripts/utilities/animation.js',
    'assets/scripts/utilities/asyncView.js',
    'assets/scripts/utilities/addImageSize.js',
    'assets/scripts/utilities/breadcrumbs.js',
    'assets/scripts/utilities/disclosure.js',
    'assets/scripts/utilities/dropdownMenu.js',
    'assets/scripts/utilities/newsletterAjaxForm.js',
    'assets/scripts/utilities/getSectionData.js',
    'assets/scripts/utilities/infiniteScroll.js',
    'assets/scripts/utilities/ios-scroll-fix.js',
    'assets/scripts/utilities/loadScript.js',
    'assets/scripts/utilities/linkedSwatchOptions.js',
    'assets/scripts/utilities/masonry.js',
    'assets/scripts/utilities/mobileMenu.js',
    'assets/scripts/utilities/objectFitImages.js',
    'assets/scripts/utilities/option_selection.js',
    'assets/scripts/utilities/productMedia.js',
    'assets/scripts/utilities/productReviews.js',
    'assets/scripts/utilities/quantityBox.js',
    'assets/scripts/utilities/queryParameters.js',
    'assets/scripts/utilities/responsiveVideo.js',
    'assets/scripts/utilities/selectCallback.js',
    'assets/scripts/utilities/predictiveSearch.js',
    'assets/scripts/utilities/screenSize.js',
    'assets/scripts/utilities/scrollToTop.js',
    'assets/scripts/utilities/tabs.js',
    'assets/scripts/utilities/thumbnail.js',
    'assets/scripts/utilities/video.js'
  ]
  )
  .pipe(concat('utilities.js'))
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .on('error', handleError)
  .pipe(gulp.dest(DEST))
  done();
});

gulp.task('currency_conversion_js', done => {
  gulp.src([
    //Currency conversion
    'assets/scripts/currencyConversion/moneyFormats.js',
    'assets/scripts/currencyConversion/currencyConverter.js'
  ]
  )
    .pipe(concat('currencyConversion.js'))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .on('error', handleError)
    .pipe(gulp.dest(DEST))
  done();
});

gulp.task('watch',
  gulp.series(gulp.parallel('combine_css', 'combine_vendors_js', 'combine_utilities_js', 'currency_conversion_js', 'babel'),
done => {
  gulp.watch('assets/styles/**/*.scss', gulp.parallel('combine_css'));
  gulp.watch('assets/scripts/vendors/*.js', gulp.parallel('combine_vendors_js'));
  gulp.watch('assets/scripts/utilities/*.js', gulp.parallel('combine_utilities_js'));
  gulp.watch('assets/scripts/currencyConversion/*.js', gulp.parallel('currency_conversion_js'));
  gulp.watch('assets/scripts/sections/*.js', gulp.parallel('babel'));
  done();
}))
