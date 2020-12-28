var globalQuickShopProduct;

Shopify.theme.thumbnail = {
  enableSwatches: function() {
    if (isScreenSizeLarge()) {
      $('body').on('mouseenter', '.swatch span', function(){
        if (
          $(this)
            .data('image')
            .indexOf('no-image') == -1
        ) {
          $(this)
            .parents('.thumbnail')
            .find('.product__imageContainer img:not(.secondary)')
            .attr('src', $(this).data('image'));
          $(this)
            .parents('.thumbnail')
            .find('.product__imageContainer img:not(.secondary)')
            .attr('srcset', $(this).data('image'));
        }
      })
    }
  },
  showVariantImage: function(){
    if (isScreenSizeLarge()) {

      $('body').on('mouseenter', '.has-secondary-image-swap', function() {
        const $thumbnailImage = $(this).find('.product-image__wrapper img');
        const $thumbnailVideo = $(this).find('.product-image__wrapper .video-on-hover');

        if ($thumbnailImage) {
          $thumbnailImage.toggleClass('swap--visible');
        }

        if ($thumbnailVideo) {
          $thumbnailVideo.toggleClass('swap--visible');
          Shopify.theme.video.enableVideoOnHover($(this));
        }
      });

      $('body').on('mouseleave', '.has-secondary-image-swap', function() {
        const $thumbnailImage = $(this).find('.product-image__wrapper img');
        const $thumbnailVideo = $(this).find('.product-image__wrapper .video-on-hover');

        if ($thumbnailImage) {
          $thumbnailImage.toggleClass('swap--visible');
        }

        if ($thumbnailVideo) {
          $thumbnailVideo.toggleClass('swap--visible');
          Shopify.theme.video.disableVideoOnHover($(this));
        }
      });
    }
  },
  showQuickShop: function() {

    //EVENT - click on quick-shop
    $('body').on('click', '.js-quick-shop-link', function(e){
      e.preventDefault();

      //Set productData object based on data attributes
      const productData = {
        handle: $(this).data('handle'),
        product_id: $(this).data('id'),
        single_variant: $(this).attr('data-single-variant'),
        product_in_collection_url: $(this).data('url'),
        escaped_title: $(this).data('title'),
        details_text: $(this).data('details-text'),
        full_description: $(this).data('full-description'),
        regular_description: $(this).data('regular-description'),
        featured_image: $(this).data('featured-image'),
        image_array: Shopify.theme.thumbnail.createImageObjects($(this).data('images')),
        thumbnail_array: Shopify.theme.thumbnail.createImageObjects($(this).data('thumbnail-images')),
        collection_handles: $(this).data('collection-handles').trim(',').split(','),
        money_format: $('body').data('money-format')
      };

      //Find current product and notify forms
      const $notifyForm = $(this).next('.js-quickshop-forms__container').find('.notify_form');
      const $productForm = $(this).next('.js-quickshop-forms__container').find('.product_form');

      if(!$('.fancybox-active').length) {

        $.fancybox.open($('.js-quick-shop'), {
          baseClass: 'quick-shop__lightbox product-' + productData.product_id,
          hash: false,
          infobar : false,
          toolbar: false,
          loop: true,
          smallBtn : true,
          touch: false,
          video: {
            autoStart: false
          },
          mobile: {
            preventCaptionOverlap: false,
            toolbar: true
          },
          beforeLoad: function(instance, slide){
            // Use unique identifier for the product gallery
            var src = slide.src;
            var $quickshop = $(src).find('.quick-shop');

            if(!$quickshop.hasClass('content-loaded')) {
              Shopify.theme.thumbnail.beforeOpen(productData, $quickshop);
            }
          },
          afterLoad: function(instance, slide){

            Shopify.theme.thumbnail.afterContent($productForm, $notifyForm, productData, slide);
            Shopify.theme.jsProduct.enableProductSwatches();

            Shopify.theme.productMedia.setupMedia();

            if (Currency.show_multiple_currencies) {
              Shopify.theme.currencyConverter.convertCurrencies();
            }
          },
          afterShow: function(e, instance){

            if($('.tabs').length > 0) {
              Shopify.theme.tabs.enableTabs();
            }

            // Use unique identifier for the product gallery
            var src = instance.src;
            var $quickshop = $(src).find('.quick-shop');

            $quickshop.addClass('quick-shop--loaded');
          },
          beforeClose: function(e, instance){
            // Use unique identifier for the product gallery
            var src = instance.src;
            var $quickshop = $(src).find('.quick-shop');

            Shopify.theme.thumbnail.beforeClose(productData, $quickshop);
            $quickshop.removeClass('quick-shop--loaded');
            $('body').removeClass('model-loaded');
          }
        })
      }

    });
  },
  beforeClose(productData, $quickshop) {
    var $quickshopPopup = $quickshop.closest('.js-quick-shop');
    $quickshopPopup.removeClass('content-loaded');

    const $insertedNotifyForm = $('.quick-shop__lightbox .notify_form');
    const $insertedProductForm = $('.quick-shop__lightbox .product_form');

    // Copy form data back to product loop and add .viewed
    $(`.js-quickshop-forms--${productData.product_id}`).append($insertedProductForm);
    $(`.js-quickshop-forms--${productData.product_id}`).append($insertedNotifyForm);
    $(`.js-quickshop-forms--${productData.product_id} .product_form`).addClass('viewed');
    $(`.js-quickshop-forms--${productData.product_id} .notify_form`).addClass('viewed');

    // Clear stickers
    $('.quick-shop .thumbnail-sticker span').empty().parent().addClass('is-hidden');

    // Find gallery and carousel
    const $gallery = $quickshop.find('.js-gallery-modal');
    const $carousel = $quickshop.find('.js-gallery-carousel');

    $carousel.find('.gallery-cell').off('click');

    // Remove image slides from gallery
    $gallery.flickity('remove', $('.gallery-cell', $gallery));
    $carousel.empty(); // Can't use Flickity method on carousel because it can be both a slider/grid

    // Destroy sliders when modal closes
    $gallery.flickity('destroy');

    const variantPrice = $('.js-current-price .money').text();
    $(`.js-quick-shop-link[data-id=${productData.product_id}]`).attr('data-initial-modal-price', variantPrice);
    $('.js-current-price, .js-was-price, .js-savings').empty();

    if($gallery.data('enable-zoom') === true) {
      $gallery.trigger('zoom.destroy'); // remove zoom
    }

  },
  afterContent: function($productForm, $notifyForm, productData, slide) {
    // Locate unique identifier for the product gallery
    var src = slide.src;
    var $galleryModal = $(src).find('.js-gallery-modal');

    $galleryModal.closest('.js-quick-shop').addClass('content-loaded');

    Shopify.theme.thumbnail.retrieveProductInfo(productData);

    let settings = {
      thumbnailsEnabled: $galleryModal.data('thumbnails-enabled'),
      thumbnailsSliderEnabled: $galleryModal.data('thumbnails-slider-enabled'),
      thumbnailsPosition: $galleryModal.data('thumbnails-position'),
      arrowsEnabled: $galleryModal.data('gallery-arrows-enabled'),
      slideshowAnimation: $galleryModal.data('slideshow-animation'),
      slideshowSpeed: $galleryModal.data('slideshow-speed')
    }

    // Call slideshow method from Product object
    Shopify.theme.jsProduct.enableSlideshow($galleryModal, settings);

    // Call Plyr to setup videos inside gallery
    Shopify.theme.video.init();

    //Copy form data to modal
    $('.quick-shop__lightbox .js-notify-form').append($notifyForm);
    $('.quick-shop__lightbox .js-product-form').append($productForm);

    // Show the back in stock notification form
    $('.quick-shop__lightbox .modal_price, .quick-shop__lightbox .js-notify-form').show();

    //Initiate selectCallback
    if ($productForm.hasClass("product_form_options") && (!$productForm.hasClass("viewed"))) {

      if ($('.select-container').length) {
        //If form hasn't been viewed previously, run OptionSelectors function
        new Shopify.OptionSelectors($productForm.data("select-id"),
        {
          product: $productForm.data("product"),
          onVariantSelected: selectCallback,
          enableHistoryState: $productForm.data("enable-state")
        });
      }
    }

    //Link sold out options when there is more than one option available (eg. S is selected and Yellow option appears as sold out)
    if (Shopify.theme_settings.product_form_style == 'swatches') {
      const JSONData = $productForm.data('product');
      const productID = productData.section_id;
      const productSection = '.product-' + productID + ' .js-product_section';
      const swatchOptions = $productForm.find('.swatch_options .swatch');
      if (swatchOptions.length > 1){
        Shopify.linkOptionSelectors(JSONData, productSection);
      }
    }

    if ($('.single-option-selector').length > 0) {
      $('.selector-wrapper').wrap('<div class="select"></div>');
      $('#product-form-'+productData.product_id+' .select-container')
        .children()
        .first()
        .removeClass('select')
        .addClass('select-container');
    }

    $('.js-quick-shop select[name="id"]').trigger('change');

  },
  createImageObjects($images) {
    //split image info
    const image_paths_alts = $images.split('~');

    //Create new array with image objects
    const imageArray = image_paths_alts.map(image => {
      var imageInfo = image.split('^');
      return {
        path: imageInfo[0],
        alt: imageInfo[1],
        id: imageInfo[2],
        width: imageInfo[3],
        mediaType: imageInfo[4],
      }
    });

    return imageArray;
  },
  beforeOpen(productData, $quickshop) {
    //Add image elements before gallery is opened
    Shopify.theme.thumbnail.populateGallery(productData, $quickshop);

    $('.js-sale-sticker, .js-sold-out, .js-current-price, .js-was-price, .js-savings, .js-new-sticker, .js-pre-order-sticker').empty();
  },
  retrieveProductInfo(productData) {
    $.ajax({
      dataType: "json",
      async: false,
      cache: false,
      url: "/products/" + productData.handle + ".js",
      success: function(product) {
        //Create new object combining info
        product = $.extend({}, product, productData);

        globalQuickShopProduct = product;
        Shopify.theme.thumbnail.updateVariant(product.variants[0].id.toString(), product);

      }
    });
  },
  populateGallery(productData, $quickshop) {
    //Find gallery and carousel
    const $gallery = $quickshop.find('.js-gallery-modal');
    const $carousel = $quickshop.find('.js-gallery-carousel');

    //Add gallery images based on product info from API
    function addMainGalleryImages(){

      $.each( productData.image_array, function( i, image ){

        if (image.path == '' || image.id == undefined) {
          var imgPath = productData.featured_image;
          var alt = '';
        } else {
          var imgPath = image.path;
          var alt = image.alt;
        }

        var img2048x2048 = imgPath.replace(/(\.[^.]*)$/, "_2048x2048$1").replace('http:', '');
        var cellContent;

        if (image.mediaType.indexOf("image") >= 0) {
          cellContent = `
            <div class="image__container" style="max-width: ${image.width}px">
              <img src="${imgPath}" alt="${alt}" data-image-id="${image.id}" data-index="${i}" />
            </div>
          `;
        } else {
          cellContent = unescape(imgPath);
        }

        var $cellElems = $('<div class="gallery-cell">'+ cellContent +'</div>');
        $gallery.append($cellElems);
      });

    }

    //Add carousel images based on product info from API
    function addCarouselGalleryImages(){
      $.each( productData.thumbnail_array, function( i, image ){

        if (image.path != '') {
          var imgPath = image.path;
          var carouselSizedImg = imgPath.replace(/(\.[^.]*)$/, "_grande$1").replace('http:', '');

          var mediaBadge = '';

          if (image.alt.indexOf("model") >= 0) {
            mediaBadge = '<span class="icon media-badge"><svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 25H25V1H1V25Z" fill=""/><path class="media-badge__outline" d="M0.5 25V25.5H1H25H25.5V25V1V0.5H25H1H0.5V1V25Z" stroke="" stroke-opacity="0.05"/><g opacity="0.6"><path fill-rule="evenodd" clip-rule="evenodd" d="M13 6L19.0622 9.5V16.5L13 20L6.93782 16.5V9.5L13 6Z" stroke="" stroke-width="1.5"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13 20V12.6024C13.6225 12.2002 13.6225 12.2002 13.6225 12.2002L19 9V16.4082L13 20Z" fill=""/></g></svg></span>';
          } else if (image.alt.indexOf('external_video') >= 0 || image.alt.indexOf('video') >= 0 ) {
            mediaBadge = '<span class="icon media-badge"><svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 25H25V1H1V25Z" fill=""/><path class="media-badge__outline" d="M0.5 25V25.5H1H25H25.5V25V1V0.5H25H1H0.5V1V25Z" stroke="" stroke-opacity="0.05"/><path fill-rule="evenodd" clip-rule="evenodd" d="M8.19995 5.8V20.2L19.3999 12.5858L8.19995 5.8Z" fill="" fill-opacity="0.6"/></svg></span>';
          }

          var img = '<img src="'+ carouselSizedImg + '" alt="' + escape(image.alt) + '" />';
          var $carouselCellElems = $('<div class="gallery-cell" tabindex="0">'+ img + mediaBadge + '</div>');
          $carousel.append($carouselCellElems);
        }
      });
    }

    addMainGalleryImages();

    // Only adds thumbnail images if they don't already exist
    // Also checks to make sure there is more than one slide in main gallery
    if ($carousel.find('.gallery-cell').length == 0 && $gallery.find('.gallery-cell').length > 1) {
      addCarouselGalleryImages();
    }

    if ($gallery.data('enable-zoom') === true) {
      $gallery.find('img').each(function(index, image){
        $(image).wrap('<span class="zoom-container"></span>')
                .css('display', 'block')
                .parent()
                .zoom({
                  touch: false,
                  magnify: 1
                });
      })
    }
  },
  updateVariant(variant) {
    if (globalQuickShopProduct != 'undefined'){

      var product = globalQuickShopProduct;

      $('.js-current-price').html('');
      $('.js-was-price').html('');
      $('.js-savings').html('');

      //Title and Vendor
      $('.js-product-title').html('<a href="'+ product.product_in_collection_url +'" title="'+ product.escaped_title +'">'+ product.title +'</a>');
      $('.js-product-vendor')
      .html('<a href="/collections/vendors?q=' + product.vendor +'">' + product.vendor + '</a>');

      //Product Description
      $('.js-full-description').html(product.full_description);
      $('.js-regular-description').html(product.regular_description);
      var productDetails = '<a href="'+ product.product_in_collection_url +'" class="secondary_button" title="'+ product.escaped_title +' Details">'+ product.details_text +'</a>';
      $('.js-product-details').html(productDetails);

      //Collection stickers
      if (Shopify.theme_settings.stickers_enabled) {
        $.each( product.collection_handles, function( value, index ) {
          switch(this.toString()) {
            case 'best-seller':
              $('.best-seller-sticker span').html(Shopify.translation.best_seller).parent().removeClass('is-hidden');
              break;
            case 'coming-soon':
              $('.coming-soon-sticker span').html(Shopify.translation.coming_soon).parent().removeClass('is-hidden');
              break;
            case 'new':
              $('.new-sticker span').html(Shopify.translation.new_sticker).parent().removeClass('is-hidden');
              break;
            case 'pre-order':
              $('.pre-order-sticker span').html(Shopify.translation.pre_order).parent().removeClass('is-hidden');
              break;
            case 'staff-pick':
              $('.staff-pick-sticker span').html(Shopify.translation.staff_pick).parent().removeClass('is-hidden');
          }
        });
      }

      function getQuickShopInfo(variant) {
        if (variant.id == variant.id.toString()){
          //Sale sticker
          if (Shopify.theme_settings.stickers_enabled) {
            if (variant.compare_at_price > variant.price){
              $('.sale-sticker span').html(Shopify.translation.sale).parent().removeClass('is-hidden');
            }
          }

          //Sale
          if (variant.compare_at_price > variant.price) {
            $('.js-current-price').addClass('sale');
          } else {
            $('.js-current-price').removeClass('sale');
          }

          //Availability
          if (variant.available == false){
            if (product.collection_handles.indexOf('coming-soon') != -1) {
              // If product tags includes 'coming-soon', replace with Coming soon text
              if (!Shopify.theme_settings.stickers_enabled) {
                // Only show Coming soon text if stickers are disabled
                $('.js-sold-out').html(Shopify.translation.coming_soon);
              }
            } else {
              $('.js-sold-out').html(Shopify.translation.sold_out);
            }
          } else {
            $('.js-sold-out').html('');
          }

          //Price
          if (variant.available == true) {
            $('.js-notify-form').hide();

            if (variant.compare_at_price > variant.price) {
              $('.js-was-price').html('<span class="money">' + Shopify.formatMoney(variant.compare_at_price, product.money_format) + '</span>');
              $('.js-savings').html(Shopify.translation.savings + ' ' + parseInt(((variant.compare_at_price - variant.price) * 100) / variant.compare_at_price) + '% (' + '<span class="money">' + Shopify.formatMoney(variant.compare_at_price - variant.price, product.money_format) + '</span>)');
            }

            if (product.price == Shopify.translation.coming_soon){
              $('.js-current-price').html(Shopify.translation.coming_soon);
            } else if (variant.price) {
              $('.js-current-price').html('<span class="money">' + Shopify.formatMoney(variant.price, product.money_format) + '</span>');
            } else {
              $('.js-current-price').html(Shopify.translation.free_price_text);
            }

          } else {
            $('.js-notify-form').show();
          }
        }

      }

      if (product.single_variant == 'true') {
        getQuickShopInfo(product);
      } else {
        for (var i = 0; i < product.variants.length; i++) {
          getQuickShopInfo(product.variants[i]);
        }
      }
    }
  }
}
