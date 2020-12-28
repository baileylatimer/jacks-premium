Shopify.theme.disclosure = {
  enable: function() {

    const $disclosure = $('[data-disclosure]');
    const $toggle = $('[data-disclosure-toggle]');
    const $disclosureWrap = $('.disclosure__list-wrap');
    const $mobileMenuDisclosureList = $('[data-disclosure-list]');

    // Check if current opened menu is offscreen
    function checkOffScreen($openedToggle) {
      if ($openedToggle.siblings('.disclosure__list-wrap').is(':off-right')) {
        $openedToggle.siblings('.disclosure__list-wrap').addClass('disclosure--left');
      }
    }

    function closeDisclosures(ignoreTarget, currentTarget) {
      if (ignoreTarget === true) {
        $toggle.not(currentTarget).removeClass('is-clicked');
        $toggle.not(currentTarget).attr('aria-expanded', 'false');
      } else {
        $toggle.removeClass('is-clicked');
        $toggle.attr('aria-expanded', 'false');
      }

      $disclosureWrap.removeClass('disclosure--left');
    }

    // Close menus on ESC
    $('body').on('keyup', function(e) {
      if (e.which == '27') {
        closeDisclosures();
      }
    });

    // Close menus on hoverout
    $disclosure.on('mouseleave', function(e) {
      closeDisclosures();
    });

    // Close menus on hoverout
    $disclosure.find('.disclosure-list__item:last-child').on('focusout', function(e) {
      closeDisclosures();
    });

    // On click/focus event for toggling options
    $toggle.on('mouseenter focus', function(e) {

      // Close all other menus
      closeDisclosures(true, this);

      const $target = $(e.currentTarget);
      $target.attr('aria-expanded', 'true').addClass('is-clicked');
      checkOffScreen($target);
    });

    // Mobile toggle logic
    $mobileMenuDisclosureList.on('touchstart', function(e) {
      const $target = $(e.currentTarget);
      $target.parents('.disclosure').addClass('is-clicked');

      closeDisclosures(true, this);

      if ($target.hasClass('is-clicked') == false) {
        $target.attr('aria-expanded', 'true').addClass('is-clicked');
        checkOffScreen($target);
      } else {
        $target.attr('aria-expanded', 'false').removeClass('is-clicked');
        $disclosureWrap.removeClass('disclosure--left');
      }
    })

    $mobileMenuDisclosureList.on('focusout', function(e) {
      closeDisclosures(true, this);
    })

    // Mobile form submitting
    $mobileMenuDisclosureList.on('change', function(e) {
      if (Shopify.media_queries.medium.matches || !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        const $target = $(e.currentTarget);
        const selectedValue = e.currentTarget.value;
        const disclosureInput = $target.parents('.selectors-form__item').find('[data-disclosure-input]');
        const selectorForm = $target.parents('.selectors-form');

        if (!$target.hasClass('custom-currency')) {
          disclosureInput.val(selectedValue);
          selectorForm.submit();
        } else {
          $target.trigger('click');
        }

      }
    });
  },
  unload: function() {
    $('[data-disclosure]').off();
    $('[data-disclosure-toggle]').off();
    $('.disclosure__list-wrap').off();
  }
}
