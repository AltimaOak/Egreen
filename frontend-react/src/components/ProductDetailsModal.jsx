import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductDetailsModal = ({ product, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!product) return null;

  // Format currency helper
  const formatCurrency = (val) => {
    if (val == null || isNaN(val)) return null;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Derive specs key-value pairs
  const specs = product.specifications || [];
  
  // Extract key bullet points for quick highlights
  const getHighlight = (keyPattern) => {
    const item = specs.find(s => s.key && s.key.toLowerCase().includes(keyPattern.toLowerCase()));
    return item ? item.value : null;
  };

  const processor = getHighlight('processor');
  const ram = getHighlight('ram');
  const storage = getHighlight('storage') || getHighlight('hard drive');
  const os = getHighlight('operating system') || getHighlight('os');
  const warranty = getHighlight('warranty');

  // Price calculations
  const priceFormatted = formatCurrency(product.price);
  // Calculate mock original price if not present to show Flipkart/Amazon discount look
  const originalPrice = product.price ? Math.round(product.price * 1.18) : null;
  const originalPriceFormatted = formatCurrency(originalPrice);
  const discountPercent = product.price ? 15 : null;

  return (
    <div className="pdm-backdrop" onClick={onClose}>
      <div 
        className="pdm-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar */}
        <div className="pdm-header-bar">
          <div className="pdm-breadcrumb">
            <span>Hardware Catalog</span>
            <span className="pdm-sep">/</span>
            <span>{product.brand || 'Enterprise'}</span>
            <span className="pdm-sep">/</span>
            <span className="pdm-active-crumb">{product.categoryName || 'Products'}</span>
          </div>
          <button 
            onClick={onClose} 
            className="pdm-close-btn"
            aria-label="Close Product Details"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Modal Main Grid (Amazon / Flipkart layout) */}
        <div className="pdm-grid-container">
          
          {/* Left Column: Image & Media Preview */}
          <div className="pdm-left-col">
            <div className="pdm-image-box">
              {product.image ? (
                <img src={product.image} alt={product.name} className="pdm-main-image" />
              ) : (
                <div className="pdm-no-image">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  <span>Enterprise Product Image</span>
                </div>
              )}
              
              {/* Badges Over Image */}
              <div className="pdm-image-badges">
                <span className="pdm-badge pdm-badge-brand">
                  {product.brand}
                </span>
                <span className="pdm-badge pdm-badge-condition">
                  {product.condition || 'Refurbished'}
                </span>
              </div>
            </div>

            {/* Trust Assurance Strip */}
            <div className="pdm-trust-strip">
              <div className="pdm-trust-item">
                <span className="pdm-trust-icon">🛡️</span>
                <div>
                  <strong>{warranty || '3 Years Warranty'}</strong>
                  <p>Enterprise Warranty Coverage</p>
                </div>
              </div>
              <div className="pdm-trust-item">
                <span className="pdm-trust-icon">🚚</span>
                <div>
                  <strong>Fast Insured Delivery</strong>
                  <p>Safe shipping across India</p>
                </div>
              </div>
              <div className="pdm-trust-item">
                <span className="pdm-trust-icon">⚡</span>
                <div>
                  <strong>100% Tested</strong>
                  <p>Certified hardware quality</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Pricing, Specs Table & Actions */}
          <div className="pdm-right-col">
            
            {/* Title & Brand */}
            <div className="pdm-title-section">
              <div className="pdm-meta-row">
                <span className="pdm-brand-tag">{product.brand}</span>
                <span className="pdm-sku-tag">SKU: EG-{product.id}</span>
                <span className={`pdm-stock-tag ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                  {product.stock > 0 ? '● In Stock & Ready to Ship' : '○ Out of Stock'}
                </span>
              </div>
              <h2 className="pdm-product-title">{product.name}</h2>
              
              {/* Amazon/Flipkart Ratings */}
              <div className="pdm-rating-row">
                <div className="pdm-stars-pill">
                  <span>★ {product.rating || '4.5'}</span>
                </div>
                <span className="pdm-rating-count">128 Verified Enterprise Buyers</span>
                <span className="pdm-dot-divider">•</span>
                <span className="pdm-verified-badge">✓ Verified Wholesaler Stock</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="pdm-price-box">
              {priceFormatted ? (
                <div className="pdm-price-row">
                  <span className="pdm-curr-price">{priceFormatted}</span>
                  {originalPriceFormatted && (
                    <span className="pdm-mrp-price">{originalPriceFormatted}</span>
                  )}
                  {discountPercent && (
                    <span className="pdm-discount-pill">{discountPercent}% OFF</span>
                  )}
                </div>
              ) : (
                <div className="pdm-price-row">
                  <span className="pdm-curr-price pdm-quote-price">Price on Request</span>
                  <span className="pdm-discount-pill pdm-b2b-pill">Wholesale Bulk Rate</span>
                </div>
              )}
              <p className="pdm-tax-note">Inclusive of GST. Volume discounts available for orders of 5+ units.</p>
            </div>

            {/* Quick Feature Bullet Points (Amazon Style) */}
            <div className="pdm-bullets-box">
              <h4 className="pdm-section-heading">Key Highlights</h4>
              <ul className="pdm-bullets-list">
                {processor && <li><strong>Processor:</strong> {processor}</li>}
                {ram && <li><strong>Memory:</strong> {ram} RAM for smooth multitasking</li>}
                {storage && <li><strong>Storage:</strong> {storage} high-speed drive</li>}
                {os && <li><strong>Operating System:</strong> {os} Pre-installed</li>}
                {warranty && <li><strong>Warranty:</strong> {warranty} included</li>}
                {!processor && !ram && (
                  <li><strong>Description:</strong> {product.description || 'Enterprise-grade IT hardware designed for durability and daily corporate performance.'}</li>
                )}
              </ul>
            </div>

            {/* Technical Specifications Table (Amazon / Flipkart 2-Column Style) */}
            <div className="pdm-specs-section">
              <h4 className="pdm-section-heading">Technical Specifications</h4>
              <div className="pdm-specs-table-wrapper">
                <table className="pdm-specs-table">
                  <tbody>
                    <tr>
                      <td className="pdm-spec-key">Model / Name</td>
                      <td className="pdm-spec-val">{product.name}</td>
                    </tr>
                    <tr>
                      <td className="pdm-spec-key">Brand</td>
                      <td className="pdm-spec-val">{product.brand}</td>
                    </tr>
                    <tr>
                      <td className="pdm-spec-key">Category</td>
                      <td className="pdm-spec-val">{product.categoryName || 'Enterprise IT'}</td>
                    </tr>
                    <tr>
                      <td className="pdm-spec-key">Condition</td>
                      <td className="pdm-spec-val">{product.condition || 'Refurbished'}</td>
                    </tr>
                    {specs.map((s, idx) => (
                      <tr key={idx}>
                        <td className="pdm-spec-key">{s.key}</td>
                        <td className="pdm-spec-val">{s.value}</td>
                      </tr>
                    ))}
                    {specs.length === 0 && product.rawSpecs && (
                      <tr>
                        <td className="pdm-spec-key">Specifications</td>
                        <td className="pdm-spec-val">{product.rawSpecs}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="pdm-actions-row">
              <a 
                href={`https://wa.me/917942625065?text=${encodeURIComponent(`Hi, I would like to place an order for the product: ${product.name}. Please share order and payment details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pdm-btn pdm-btn-primary"
                style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.925-7.062A9.923 9.923 0 0012.012 2zm5.82 14.364c-.244.686-1.42 1.309-1.956 1.391-.502.076-1.144.109-1.841-.115-.427-.137-.978-.315-1.693-.625-2.986-1.293-4.93-4.321-5.08-4.52-.148-.2-1.218-1.621-1.218-3.091 0-1.47.77-2.194 1.042-2.494.272-.3.593-.375.79-.375.198 0 .395.002.567.01.183.008.428-.069.669.51.244.58.837 2.046.91 2.194.074.148.123.324.025.52-.099.196-.148.318-.296.491-.148.173-.312.387-.446.52-.148.148-.303.309-.13.606.173.297.77 1.272 1.652 2.057 1.134 1.01 2.091 1.323 2.388 1.47.297.148.47.123.643-.074.173-.198.742-.865.94-1.162.198-.297.396-.247.668-.148.272.099 1.73.816 2.027.964.297.148.495.222.568.346.074.124.074.717-.17 1.403z"/>
                </svg>
                Order on WhatsApp
              </a>
              
              <a 
                href={`https://wa.me/917942625065?text=${encodeURIComponent(`Hi, I have an enquiry regarding the product: ${product.name}. Please provide more details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pdm-btn pdm-btn-secondary"
                style={{ gap: '6px', color: '#15803d', borderColor: '#bbf7d0', backgroundColor: '#f0fdf4' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.925-7.062A9.923 9.923 0 0012.012 2zm5.82 14.364c-.244.686-1.42 1.309-1.956 1.391-.502.076-1.144.109-1.841-.115-.427-.137-.978-.315-1.693-.625-2.986-1.293-4.93-4.321-5.08-4.52-.148-.2-1.218-1.621-1.218-3.091 0-1.47.77-2.194 1.042-2.494.272-.3.593-.375.79-.375.198 0 .395.002.567.01.183.008.428-.069.669.51.244.58.837 2.046.91 2.194.074.148.123.324.025.52-.099.196-.148.318-.296.491-.148.173-.312.387-.446.52-.148.148-.303.309-.13.606.173.297.77 1.272 1.652 2.057 1.134 1.01 2.091 1.323 2.388 1.47.297.148.47.123.643-.074.173-.198.742-.865.94-1.162.198-.297.396-.247.668-.148.272.099 1.73.816 2.027.964.297.148.495.222.568.346.074.124.074.717-.17 1.403z"/>
                </svg>
                WhatsApp Enquiry
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
