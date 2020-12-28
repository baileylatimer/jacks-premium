Shopify.theme.getSectionData = function ($section) {

  const sectionId = $section.attr('id').replace('shopify-section-', '');

  var $dataEl = $section.find('[data-section-data][data-section-id=' + sectionId +']').first();

  if (!$dataEl) return {};

  // Load data from attribute, or innerHTML
  var data = $dataEl.data('section-data') || $dataEl.html();

  try {
    return JSON.parse(data);
  } catch (error) {
    console.warn(`Sections: invalid section data found. ${error.message}`);
    return {};
  }
}