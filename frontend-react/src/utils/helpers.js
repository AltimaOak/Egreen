// General Helper Functions

/**
 * Generate URL slug from a string
 * @param {string} text 
 * @returns {string}
 */
export function generateSlug(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -
}

/**
 * Format numeric price to Indian Rupees INR currency
 * @param {number|string} amount 
 * @returns {string}
 */
export function formatPrice(amount) {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numeric)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numeric);
}

/**
 * Format ISO Date string to human readable format
 * @param {string} dateString 
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Truncate long text strings
 * @param {string} text 
 * @param {number} limit 
 * @returns {string}
 */
export function truncateText(text, limit = 50) {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '...';
}
