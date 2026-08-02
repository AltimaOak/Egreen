// Form Validation Helpers

/**
 * Validate email address syntax
 * @param {string} email 
 * @returns {boolean}
 */
export function isValidEmail(email) {
  if (!email) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

/**
 * Validate web URL structure
 * @param {string} url 
 * @returns {boolean}
 */
export function isValidUrl(url) {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Validate product form inputs
 * @param {any} product 
 * @returns {Array<string>} list of errors, empty if valid
 */
export function validateProduct(product) {
  const errors = [];
  if (!product.name || product.name.trim() === '') {
    errors.push('Product Name is required.');
  }
  if (!product.SKU || product.SKU.trim() === '') {
    errors.push('SKU is required.');
  }
  if (!product.category || product.category === '') {
    errors.push('Category is required.');
  }
  if (product.price === undefined || product.price === '' || parseFloat(product.price) < 0) {
    errors.push('Price must be a valid positive number.');
  }
  if (product.offerPrice !== undefined && product.offerPrice !== '' && parseFloat(product.offerPrice) > parseFloat(product.price)) {
    errors.push('Offer Price cannot be higher than regular Price.');
  }
  if (product.stock === undefined || product.stock === '' || parseInt(product.stock) < 0) {
    errors.push('Stock count must be 0 or greater.');
  }
  return errors;
}
