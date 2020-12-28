Shopify.theme.addImageDimension = function(imageUrl, size) {
  var insertPosition = imageUrl.lastIndexOf(".");
  return imageUrl.substring(0, insertPosition) + size + imageUrl.substring(insertPosition);
}
