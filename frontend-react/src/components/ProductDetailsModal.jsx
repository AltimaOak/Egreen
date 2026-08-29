import React, { useState, useEffect } from 'react';

const ProductDetailsModal = ({ product, onClose }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [product]);

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

  // Format currency helper (INR)
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
    if (item) return item.value;

    // Fallback search in rawSpecs or name if available
    const raw = (product.rawSpecs || '') + ' ' + (product.description || '') + ' ' + (product.name || '');
    if (keyPattern.toLowerCase() === 'processor') {
      const match = raw.match(/(Intel Core i[3579][\w\s-]*|AMD Ryzen [\w\s-]+|Core 2 Duo|Xeon [\w\s-]+)/i);
      return match ? match[0] : null;
    }
    if (keyPattern.toLowerCase() === 'ram' || keyPattern.toLowerCase() === 'memory') {
      const match = raw.match(/(\d+\s*GB\s*(?:DDR\d+)?\s*RAM|\d+\s*GB\s*RAM|\d+\s*GB(?=\s*(?:DDR|Memory)))/i);
      return match ? match[0] : null;
    }
    if (keyPattern.toLowerCase() === 'storage' || keyPattern.toLowerCase() === 'hard drive') {
      const match = raw.match(/(\d+\s*(?:GB|TB)\s*(?:SSD|NVMe|HDD|Storage))/i);
      return match ? match[0] : null;
    }
    if (keyPattern.toLowerCase() === 'operating system' || keyPattern.toLowerCase() === 'os') {
      const match = raw.match(/(Windows\s*11(?:\s*Pro)?|Windows\s*10(?:\s*Pro)?|Ubuntu|Linux|FreeDOS)/i);
      return match ? match[0] : null;
    }
    if (keyPattern.toLowerCase() === 'warranty') {
      const match = raw.match(/(\d+\s*(?:Years?|Months?)\s*Warranty|\d+\s*Years?)/i);
      return match ? match[0] : null;
    }
    return null;
  };

  const processor = getHighlight('processor') || 'Intel Core i3';
  const ram = getHighlight('ram') || '8 GB';
  const storage = getHighlight('storage') || 'SSD high-speed drive';
  const os = getHighlight('operating system') || 'Windows 11';
  const warranty = getHighlight('warranty') || '3 Years';

  // Price calculations
  const priceFormatted = formatCurrency(product.price);
  const originalPrice = product.offerPrice && product.price && product.offerPrice > product.price
    ? product.offerPrice
    : (product.price ? Math.round(product.price * 1.18) : null);
  const originalPriceFormatted = formatCurrency(originalPrice);
  const discountPercent = product.price && originalPrice 
    ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
    : 15;

  // Only use uploaded images (admin main image + admin gallery images)
  const rawGallery = Array.isArray(product.gallery)
    ? product.gallery
    : (typeof product.gallery === 'string' && product.gallery.trim() ? [product.gallery.trim()] : []);
  const allUploadedImages = [product.image, ...rawGallery].filter(Boolean);
  const galleryList = Array.from(new Set(allUploadedImages));

  const activeMainImage = galleryList[activeImageIndex] || galleryList[0] || null;

  // Derive specs table key-value pairs (4 cells per row: Key | Val | Key | Val)
  const baseSpecs = [
    { key: 'Hard Drive Size', value: storage.includes('GB') || storage.includes('TB') ? storage.replace(/\s*(?:SSD|HDD|NVMe|Storage)/i, '') : '256 GB' },
    { key: 'Form Factor', value: product.categoryName || 'Desktop' },
    { key: 'Storage Type', value: storage.toLowerCase().includes('hdd') ? 'HDD' : 'SSD' },
    { key: 'Warranty', value: warranty.includes('Warranty') ? warranty : `${warranty} Years` },
    { key: 'Operating System', value: os },
    { key: 'Condition', value: product.condition || 'Refurbished' }
  ];

  // Append any extra unique specs from DB
  const extraSpecs = specs.filter(s => 
    !baseSpecs.some(b => b.key.toLowerCase() === s.key.toLowerCase())
  );
  const allTechnicalSpecs = [...baseSpecs, ...extraSpecs];

  // Group specs into pairs of 2 for 4-column rows
  const specRows = [];
  for (let i = 0; i < allTechnicalSpecs.length; i += 2) {
    specRows.push({
      first: allTechnicalSpecs[i],
      second: allTechnicalSpecs[i + 1] || null
    });
  }

  // Brand Logo Helper
  const renderBrandLogo = (brandName = '') => {
    const b = (brandName || '').toLowerCase();
    if (b.includes('hp')) {
      return (
        <div className="pdm-brand-logo-circle hp-logo" title="HP">
          <svg viewBox="0 0 100 100" width="40" height="40">
            <circle cx="50" cy="50" r="48" fill="#0096d6" />
            <path d="M42 22 L32 78 M56 22 L46 78 M24 45 L50 45 M38 55 L64 55" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" />
          </svg>
        </div>
      );
    }
    if (b.includes('dell')) {
      return (
        <div className="pdm-brand-logo-circle dell-logo" title="Dell">
          <svg viewBox="0 0 100 100" width="40" height="40">
            <circle cx="50" cy="50" r="48" fill="#007db8" />
            <text x="50%" y="58%" dominantBaseline="middle" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="22" fontFamily="sans-serif">DELL</text>
          </svg>
        </div>
      );
    }
    if (b.includes('lenovo')) {
      return (
        <div className="pdm-brand-logo-pill lenovo-logo" title="Lenovo">
          <span>Lenovo</span>
        </div>
      );
    }
    return (
      <div className="pdm-brand-logo-pill generic-logo" title={product.brand || 'Enterprise'}>
        <span>{product.brand || 'Enterprise'}</span>
      </div>
    );
  };

  const whatsappOrderMsg = `Hi, I would like to place an order for the product: ${product.name} (SKU: EG-${product.sku || product.id}). Please share order and payment details.`;
  const whatsappEnquiryMsg = `Hi, I have an enquiry regarding the product: ${product.name} (SKU: EG-${product.sku || product.id}). Please provide more details.`;

  return (
    <div className="pdm-backdrop" onClick={onClose}>
      <div 
        className="pdm-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar with Breadcrumb and Close Button */}
        <div className="pdm-header-bar">
          <div className="pdm-breadcrumb">
            <span className="pdm-crumb-muted">Hardware Catalog</span>
            <span className="pdm-sep">/</span>
            <span className="pdm-crumb-muted">{product.brand || 'HP'}</span>
            <span className="pdm-sep">/</span>
            <span className="pdm-active-crumb">{product.categoryName || 'Desktops'}</span>
          </div>
          <button 
            onClick={onClose} 
            className="pdm-close-btn"
            aria-label="Close Product Details"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Modal Main Grid */}
        <div className="pdm-grid-container">
          
          {/* Left Column: Image Showcase, Thumbnails, Trust Badges */}
          <div className="pdm-left-col">
            
            {/* Main Image Showcase Card */}
            <div className="pdm-image-box">
              {/* Brand Logo Top-Left */}
              <div className="pdm-brand-watermark">
                {renderBrandLogo(product.brand)}
              </div>

              {/* Condition Badge Top-Right */}
              <div className="pdm-top-badge-right">
                <span className="pdm-pill-badge-blue">
                  <span className="pdm-badge-dot"></span>
                  {product.condition?.toUpperCase() === 'NEW' ? 'NEW' : 'REFURBISHED'}
                </span>
              </div>

              {/* Main Product Image */}
              {activeMainImage ? (
                <img src={activeMainImage} alt={product.name} className="pdm-main-image" />
              ) : (
                <div className="pdm-no-image">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                  <span>Enterprise Hardware</span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnail Strip — only rendered when multiple uploaded images exist */}
            {galleryList.length > 1 && (
              <div className="pdm-thumbnails-row">
                {galleryList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`pdm-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`View image angle ${idx + 1}`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="pdm-thumb-img" />
                  </button>
                ))}
              </div>
            )}

            {/* 3-Column Trust Assurance Strip */}
            <div className="pdm-trust-strip">
              
              {/* Trust Item 1: Warranty */}
              <div className="pdm-trust-card">
                <div className="pdm-trust-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <path d="M9 12l2 2 4-4"></path>
                  </svg>
                </div>
                <div className="pdm-trust-text">
                  <strong className="pdm-trust-title">3 Years</strong>
                  <span className="pdm-trust-sub">Warranty</span>
                </div>
              </div>

              {/* Trust Item 2: Delivery */}
              <div className="pdm-trust-card">
                <div className="pdm-trust-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13"></rect>
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                    <circle cx="5.5" cy="18.5" r="2.5"></circle>
                    <circle cx="18.5" cy="18.5" r="2.5"></circle>
                  </svg>
                </div>
                <div className="pdm-trust-text">
                  <strong className="pdm-trust-title">Fast & Insured</strong>
                  <span className="pdm-trust-sub">Delivery</span>
                </div>
              </div>

              {/* Trust Item 3: Tested Quality */}
              <div className="pdm-trust-card">
                <div className="pdm-trust-icon-box">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                    <path d="M9 8l2 2 4-4"></path>
                  </svg>
                </div>
                <div className="pdm-trust-text">
                  <strong className="pdm-trust-title">100% Tested</strong>
                  <span className="pdm-trust-sub">Quality Assured</span>
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Title, Pricing, Highlights, Specs Table & Actions */}
          <div className="pdm-right-col">
            
            {/* Top Meta: Brand Tag, SKU & Stock Status */}
            <div className="pdm-meta-top-row">
              <div className="pdm-meta-left">
                <span className="pdm-brand-pill">{product.brand || 'HP'}</span>
                <span className="pdm-sku-text">SKU: EG-{product.sku || product.id || '71'}</span>
              </div>
              <div className="pdm-meta-right">
                <span className="pdm-stock-pill-green">
                  <span className="pdm-stock-dot"></span>
                  In Stock & Ready to Ship
                </span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="pdm-product-title">{product.name}</h2>
            
            {/* Amazon/Flipkart Ratings & Verified Wholesaler Stock */}
            <div className="pdm-rating-row">
              <div className="pdm-rating-badge">
                <span className="pdm-star-icon">★</span>
                <span>{product.rating || '4.5'}</span>
              </div>
              <span className="pdm-rating-count">128 Verified Enterprise Buyers</span>
              <span className="pdm-dot-sep">•</span>
              <div className="pdm-verified-stock">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Verified Wholesaler Stock</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="pdm-price-box">
              {priceFormatted ? (
                <div className="pdm-price-main-row">
                  <span className="pdm-curr-price">{priceFormatted}</span>
                  {originalPriceFormatted && (
                    <span className="pdm-mrp-price">{originalPriceFormatted}</span>
                  )}
                  {discountPercent && (
                    <span className="pdm-discount-pill">{discountPercent}% OFF</span>
                  )}
                </div>
              ) : (
                <div className="pdm-price-main-row">
                  <span className="pdm-curr-price pdm-quote-price">Price on Request</span>
                  <span className="pdm-discount-pill pdm-b2b-pill">Wholesale Bulk Rate</span>
                </div>
              )}
              <p className="pdm-tax-note">Inclusive of GST. Volume discounts available for orders of 5+ units.</p>
            </div>

            {/* Middle Row: Key Highlights + Built for Business Banner Card */}
            <div className="pdm-highlights-business-row">
              
              {/* Left Box: Key Highlights */}
              <div className="pdm-highlights-box">
                <h4 className="pdm-section-heading">KEY HIGHLIGHTS</h4>
                <div className="pdm-highlights-list">
                  <div className="pdm-hl-item">
                    <div className="pdm-check-circle">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="pdm-hl-label">Processor:</span>
                    <span className="pdm-hl-val">{processor}</span>
                  </div>

                  <div className="pdm-hl-item">
                    <div className="pdm-check-circle">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="pdm-hl-label">Memory:</span>
                    <span className="pdm-hl-val">{ram} RAM for smooth multitasking</span>
                  </div>

                  <div className="pdm-hl-item">
                    <div className="pdm-check-circle">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="pdm-hl-label">Storage:</span>
                    <span className="pdm-hl-val">{storage.toLowerCase().includes('ssd') || storage.toLowerCase().includes('hdd') ? storage : `${storage} high-speed drive`}</span>
                  </div>

                  <div className="pdm-hl-item">
                    <div className="pdm-check-circle">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="pdm-hl-label">Operating System:</span>
                    <span className="pdm-hl-val">{os.toLowerCase().includes('windows') ? `${os} Pre-installed` : os}</span>
                  </div>

                  <div className="pdm-hl-item">
                    <div className="pdm-check-circle">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="pdm-hl-label">Warranty:</span>
                    <span className="pdm-hl-val">{warranty.includes('Years') ? `${warranty} included` : `${warranty} Years included`}</span>
                  </div>
                </div>
              </div>

              {/* Right Box: Built for Business Card */}
              <div className="pdm-built-business-card">
                {/* Subtle luxury wave watermark backdrop */}
                <div className="pdm-card-wave-pattern"></div>
                
                <div className="pdm-business-shield">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>

                <h5 className="pdm-business-title">Built for<br />Business.</h5>
                
                <div className="pdm-business-bullets">
                  <span>Reliable.</span>
                  <span>Secure.</span>
                  <span>Ready to perform.</span>
                </div>
              </div>

            </div>

            {/* Technical Specifications Section */}
            <div className="pdm-specs-section">
              <h4 className="pdm-section-heading">TECHNICAL SPECIFICATIONS</h4>
              <div className="pdm-specs-table-container">
                <table className="pdm-specs-grid-table">
                  <tbody>
                    {specRows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        <td className="pdm-spec-key">{row.first.key}</td>
                        <td className="pdm-spec-val">{row.first.value}</td>
                        {row.second ? (
                          <>
                            <td className="pdm-spec-key">{row.second.key}</td>
                            <td className="pdm-spec-val">{row.second.value}</td>
                          </>
                        ) : (
                          <>
                            <td className="pdm-spec-key"></td>
                            <td className="pdm-spec-val"></td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action CTAs: Order on WhatsApp & WhatsApp Enquiry */}
            <div className="pdm-actions-row">
              <a 
                href={`https://wa.me/919867760106?text=${encodeURIComponent(whatsappOrderMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pdm-btn pdm-btn-order"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.925-7.062A9.923 9.923 0 0012.012 2zm5.82 14.364c-.244.686-1.42 1.309-1.956 1.391-.502.076-1.144.109-1.841-.115-.427-.137-.978-.315-1.693-.625-2.986-1.293-4.93-4.321-5.08-4.52-.148-.2-1.218-1.621-1.218-3.091 0-1.47.77-2.194 1.042-2.494.272-.3.593-.375.79-.375.198 0 .395.002.567.01.183.008.428-.069.669.51.244.58.837 2.046.91 2.194.074.148.123.324.025.52-.099.196-.148.318-.296.491-.148.173-.312.387-.446.52-.148.148-.303.309-.13.606.173.297.77 1.272 1.652 2.057 1.134 1.01 2.091 1.323 2.388 1.47.297.148.47.123.643-.074.173-.198.742-.865.94-1.162.198-.297.396-.247.668-.148.272.099 1.73.816 2.027.964.297.148.495.222.568.346.074.124.074.717-.17 1.403z"/>
                </svg>
                <span>Order on WhatsApp</span>
              </a>
              
              <a 
                href={`https://wa.me/919867760106?text=${encodeURIComponent(whatsappEnquiryMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pdm-btn pdm-btn-enquiry"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.925-7.062A9.923 9.923 0 0012.012 2zm5.82 14.364c-.244.686-1.42 1.309-1.956 1.391-.502.076-1.144.109-1.841-.115-.427-.137-.978-.315-1.693-.625-2.986-1.293-4.93-4.321-5.08-4.52-.148-.2-1.218-1.621-1.218-3.091 0-1.47.77-2.194 1.042-2.494.272-.3.593-.375.79-.375.198 0 .395.002.567.01.183.008.428-.069.669.51.244.58.837 2.046.91 2.194.074.148.123.324.025.52-.099.196-.148.318-.296.491-.148.173-.312.387-.446.52-.148.148-.303.309-.13.606.173.297.77 1.272 1.652 2.057 1.134 1.01 2.091 1.323 2.388 1.47.297.148.495.222.568.346.074.124.074.717-.17 1.403z"/>
                </svg>
                <span>WhatsApp Enquiry</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
