"use strict";

Shopify.theme.jsTestimonials = {
  init: function init($section) {
    this.createSlider();
  },
  createSlider: function createSlider() {
    var $testimonialSlider = $('[data-testimonial-slider]').flickity({
      wrapAround: true,
      initialIndex: 1,
      prevNextButtons: false,
      pageDots: false,
      watchCSS: true
    }); // Resize flickity when the slider is settled

    $testimonialSlider.on('settle.flickity', function () {
      $testimonialSlider.flickity('resize');
    });
    $('body').on('click', '.testimonial__nav--prev', function () {
      $testimonialSlider.flickity('previous');
    });
    $('body').on('click', '.testimonial__nav--next', function () {
      $testimonialSlider.flickity('next');
    });
  },
  blockSelect: function blockSelect($section, blockId) {
    var $testimonialSlider = $section.find('[data-testimonial-slider]');
    var slideIndex = $('#shopify-section-' + blockId).data('testimonial-index');
    $testimonialSlider.flickity('select', slideIndex, true, true);
  },
  unload: function unload($section) {
    var $slider = $section.find('.flickity-enabled');
    $slider.flickity('destroy');
    $('.testimonial__nav--prev').off();
    $('.testimonial__nav--next').off();
  }
};