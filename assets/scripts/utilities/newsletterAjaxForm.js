Shopify.theme.newsletterAjaxForm = {
  init: function () {

    // Selectors
    const $ajaxForm = $('.newsletter-form__wrapper .contact-form');

    $ajaxForm.each(function() {
      const $form = $(this);

      $form.on('submit', function (e) {
        if($('input[name="challenge"]', $form).val() !== "true") {
          $.ajax({
            type: $form.attr('method'),
            url: $form.attr('action'),
            data: $form.serialize(),
            success: function (data) {
              $form.fadeOut("slow", () => {
                $form.prev('.form__success-message').html(Shopify.translation.newsletter_form_success);
              });
            },
            error: function(data) {
              $('input[name="challenge"]', $form).val('true');
              $form.submit();
            }
          });
          e.preventDefault();
        }
      });
    })
  },
  unload: function () {
    const $ajaxForm = $('.newsletter-form__wrapper .contact-form');
    const $submitButton = $ajaxForm.find(':submit');

    $submitButton.off();

  }
}
