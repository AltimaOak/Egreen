import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ProductDetailsModal = ({ product, onClose }) => {
  const gridRef = useRef(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  const variants = product?.variants || [];
  const hasVariants = variants.length > 0;

  // Extract distinct RAM and Storage options across variants
  const distinctRams = Array.from(
    new Set(variants.map((v) => v.ram).filter(Boolean))
  );
  const distinctStorages = Array.from(
    new Set(variants.map((v) => v.storage).filter(Boolean))
  );

  const ramVaries = distinctRams.length > 1;
  const storageVaries = distinctStorages.length > 1;

  // Only show a picker when there is an actual choice to make
  const hasSelectableVariants = variants.length > 1 && (ramVaries || storageVaries);

  // Initialize selected RAM & Storage based on isDefault or first variant
  const defaultVariant = variants.find((v) => v.isDefault) || variants[0] || null;
  const [selectedRam, setSelectedRam] = useState(defaultVariant?.ram || '');
  const [selectedStorage, setSelectedStorage] = useState(defaultVariant?.storage || '');

  // Keep state in sync when product prop changes
  useEffect(() => {
    if (hasVariants) {
      const def = variants.find((v) => v.isDefault) || variants[0];
      setSelectedRam(def?.ram || '');
      setSelectedStorage(def?.storage || '');
    } else {
      setSelectedRam('');
      setSelectedStorage('');
    }
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

  // Scroll listener for bottom affordance gradient
  const checkScroll = () => {
    const el = gridRef.current;
    if (!el) return;
    const isScrollable = el.scrollHeight > el.clientHeight + 10;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 24;
    setShowScrollHint(isScrollable && !isNearBottom);
  };

  useEffect(() => {
    checkScroll();
    const el = gridRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [product, selectedRam, selectedStorage]);

  if (!product) return null;

  // Find matching variant based on current RAM and Storage selection
  const matchingVariant = hasVariants
    ? variants.find(
        (v) =>
          (v.ram || '') === (selectedRam || '') &&
          (v.storage || '') === (selectedStorage || '')
      ) ||
      variants.find((v) => (v.ram || '') === (selectedRam || '')) ||
      variants[0]
    : null;

  const handleRamChange = (ramVal) => {
    const exactMatch = variants.find((v) => v.ram === ramVal && v.storage === selectedStorage);
    if (exactMatch) {
      setSelectedRam(ramVal);
    } else {
      const validCombo = variants.find((v) => v.ram === ramVal);
      setSelectedRam(ramVal);
      if (validCombo) {
        setSelectedStorage(validCombo.storage || '');
      }
    }
  };

  const handleStorageChange = (storageVal) => {
    const exactMatch = variants.find((v) => v.storage === storageVal && v.ram === selectedRam);
    if (exactMatch) {
      setSelectedStorage(storageVal);
    } else {
      const validCombo = variants.find((v) => v.storage === storageVal);
      setSelectedStorage(storageVal);
      if (validCombo) {
        setSelectedRam(validCombo.ram || '');
      }
    }
  };

  // Resolve active price, offerPrice, and stock
  const currentPrice =
    matchingVariant && matchingVariant.price != null
      ? Number(matchingVariant.price)
      : product.price != null
      ? Number(product.price)
      : null;

  const currentStock =
    matchingVariant && matchingVariant.stock != null
      ? matchingVariant.stock
      : typeof product.stock === 'number'
      ? product.stock
      : parseInt(product.stock, 10) || 0;

  const currentSku =
    matchingVariant?.sku || product.sku || `EG-${product.id}`;

  // Format currency helper
  const formatCurrency = (val) => {
    if (val == null || isNaN(val)) return null;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Derive specs key-value pairs and filter out duplicate Condition row
  const specs = product.specifications || [];
  const filteredSpecs = specs.filter(
    (s) => s.key && s.key.toLowerCase().trim() !== 'condition'
  );

  // Extract key bullet points for quick highlights
  const getHighlight = (keyPattern) => {
    const item = specs.find(
      (s) => s.key && s.key.toLowerCase().includes(keyPattern.toLowerCase())
    );
    return item ? item.value : null;
  };

  const processor = getHighlight('processor');
  const os = getHighlight('operating system') || getHighlight('os');
  const warranty = getHighlight('warranty');

  const ramHighlight = hasVariants
    ? (matchingVariant?.ram || selectedRam || getHighlight('ram'))
    : getHighlight('ram');
  const storageHighlight = hasVariants
    ? (matchingVariant?.storage || selectedStorage || getHighlight('storage') || getHighlight('hard drive'))
    : (getHighlight('storage') || getHighlight('hard drive'));

  // Technical Specifications table: override RAM/Storage rows with the
  // currently selected variant so the table never disagrees with the
  // highlights or the price/stock shown above it.
  const specsForTable = hasVariants
    ? filteredSpecs.map((s) => {
        const keyLower = (s.key || '').toLowerCase();
        if (keyLower.includes('ram') && ramHighlight) {
          return { ...s, value: ramHighlight };
        }
        if ((keyLower.includes('storage') || keyLower.includes('hard drive')) && storageHighlight) {
          return { ...s, value: storageHighlight };
        }
        return s;
      })
    : filteredSpecs;

  // If the base spec never had a RAM/Storage row at all but variants do,
  // add them so the table still reflects the current selection.
  const tableHasRam = specsForTable.some((s) => (s.key || '').toLowerCase().includes('ram'));
  const tableHasStorage = specsForTable.some((s) => {
    const k = (s.key || '').toLowerCase();
    return k.includes('storage') || k.includes('hard drive');
  });
  const extraSpecRows = [];
  if (hasVariants && ramHighlight && !tableHasRam) {
    extraSpecRows.push({ key: 'RAM', value: ramHighlight });
  }
  if (hasVariants && storageHighlight && !tableHasStorage) {
    extraSpecRows.push({ key: 'Storage', value: storageHighlight });
  }
  const finalSpecsForTable = [...specsForTable, ...extraSpecRows];

  const highlightsList = [
    processor && { type: 'processor', label: 'CPU', val: processor, color: 'blue', icon: '⚡' },
    ramHighlight && { type: 'ram', label: 'RAM', val: ramHighlight, color: 'green', icon: '💾' },
    storageHighlight && { type: 'storage', label: 'Storage', val: storageHighlight, color: 'purple', icon: '💽' },
    os && { type: 'os', label: 'OS', val: os, color: 'amber', icon: '🖥️' },
    warranty && { type: 'warranty', label: 'Warranty', val: warranty, color: 'cyan', icon: '🛡️' },
  ].filter(Boolean);

  const priceFormatted = formatCurrency(currentPrice);
  const originalPrice = currentPrice ? Math.round(currentPrice * 1.18) : null;
  const originalPriceFormatted = formatCurrency(originalPrice);
  const discountPercent = currentPrice ? 15 : null;

  const variantDetails = [];
  if (selectedRam) variantDetails.push(`RAM: ${selectedRam}`);
  if (selectedStorage) variantDetails.push(`Storage: ${selectedStorage}`);
  const variantSuffix = variantDetails.length > 0 ? ` (${variantDetails.join(', ')})` : '';

  const orderWaUrl = `https://wa.me/919867760106?text=${encodeURIComponent(
    `Hi, I would like to place an order for the product: ${product.name}${variantSuffix}. Please share order and payment details.`
  )}`;

  const enquiryWaUrl = `https://wa.me/919867760106?text=${encodeURIComponent(
    `Hi, I have an enquiry regarding the product: ${product.name}${variantSuffix}. Please provide more details.`
  )}`;

  return (
    <div className="pdm-backdrop" onClick={onClose}>
      <div
        className="pdm-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
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

        <div className="pdm-grid-container" ref={gridRef}>
          <div className="pdm-top-row">
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
                <div className="pdm-image-badges">
                  <span className="pdm-badge pdm-badge-brand">{product.brand}</span>
                  <span className="pdm-badge pdm-badge-condition">{product.condition || 'Refurbished'}</span>
                </div>
              </div>

              <div className="pdm-trust-strip">
                <div className="pdm-trust-item">
                  <span className="pdm-trust-icon">🛡️</span>
                  <div><strong>{warranty || '3 Years Warranty'}</strong></div>
                </div>
                <div className="pdm-trust-item">
                  <span className="pdm-trust-icon">🚚</span>
                  <div><strong>Fast Insured Delivery</strong></div>
                </div>
                <div className="pdm-trust-item">
                  <span className="pdm-trust-icon">⚡</span>
                  <div><strong>100% Tested</strong></div>
                </div>
              </div>

              {/* Only render if there is more than one real option */}
              {hasSelectableVariants && (
                <div className="pdm-left-variants-section">
                  <div className="pdm-left-variants-header">
                    <span className="pdm-left-variants-title">Available Configurations</span>
                    <span className="pdm-left-variants-count">{variants.length} Options</span>
                  </div>
                  <div className="pdm-variant-cards-row">
                    {variants.map((v, idx) => {
                      const isSelected = matchingVariant?.id
                        ? matchingVariant.id === v.id
                        : (v.ram === selectedRam && v.storage === selectedStorage);

                      let diffLabel = '';
                      if (ramVaries && storageVaries) {
                        diffLabel = `${v.ram || ''} • ${v.storage || ''}`;
                      } else if (ramVaries) {
                        diffLabel = v.ram || `Option ${idx + 1}`;
                      } else if (storageVaries) {
                        diffLabel = v.storage || `Option ${idx + 1}`;
                      } else {
                        diffLabel = `${v.ram || ''} ${v.storage || ''}`.trim() || `Option ${idx + 1}`;
                      }

                      const vPrice = v.price != null ? formatCurrency(Number(v.price)) : null;

                      return (
                        <button
                          key={v.id || idx}
                          type="button"
                          className={`pdm-variant-card ${isSelected ? 'pdm-variant-card-active' : ''}`}
                          onClick={() => {
                            setSelectedRam(v.ram || '');
                            setSelectedStorage(v.storage || '');
                          }}
                        >
                          <span className="pdm-variant-card-label">{diffLabel}</span>
                          {vPrice && <span className="pdm-variant-card-price">{vPrice}</span>}
                          {v.stock === 0 && <span className="pdm-variant-card-stock-out">Out of stock</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="pdm-right-col">
              <div className="pdm-title-section">
                <div className="pdm-meta-row">
                  <span className="pdm-brand-tag">{product.brand}</span>
                  <span className="pdm-sku-tag">SKU: {currentSku}</span>
                  <span className={`pdm-stock-tag ${currentStock > 0 ? 'in-stock' : 'out-stock'}`}>
                    {currentStock > 0 ? '● In Stock & Ready to Ship' : '○ Out of Stock'}
                  </span>
                </div>
                <h2 className="pdm-product-title">{product.name}</h2>
                <div className="pdm-rating-row">
                  <div className="pdm-stars-pill"><span>★ {product.rating || '4.5'}</span></div>
                  <span className="pdm-rating-count">128 Verified Enterprise Buyers</span>
                  <span className="pdm-dot-divider">•</span>
                  <span className="pdm-verified-badge">✓ Verified Wholesaler Stock</span>
                </div>
              </div>

              {/* Amazon/Flipkart style swatches — only when there's an actual choice */}
              {hasSelectableVariants && (
                <div className="pdm-variant-box">
                  {ramVaries && (
                    <div className="pdm-variant-group">
                      <span className="pdm-variant-label">RAM</span>
                      <div className="pdm-variant-pills">
                        {distinctRams.map((r) => {
                          const isDisabled = selectedStorage
                            ? !variants.some((v) => v.ram === r && v.storage === selectedStorage)
                            : false;
                          const isActive = selectedRam === r;
                          return (
                            <button
                              key={r}
                              type="button"
                              className={`pdm-variant-pill ${isActive ? 'pdm-variant-pill-active' : ''} ${isDisabled ? 'pdm-variant-pill-disabled' : ''}`}
                              onClick={() => !isDisabled && handleRamChange(r)}
                              disabled={isDisabled}
                            >
                              {r}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {storageVaries && (
                    <div className="pdm-variant-group">
                      <span className="pdm-variant-label">Storage</span>
                      <div className="pdm-variant-pills">
                        {distinctStorages.map((s) => {
                          const isDisabled = selectedRam
                            ? !variants.some((v) => v.storage === s && v.ram === selectedRam)
                            : false;
                          const isActive = selectedStorage === s;
                          return (
                            <button
                              key={s}
                              type="button"
                              className={`pdm-variant-pill ${isActive ? 'pdm-variant-pill-active' : ''} ${isDisabled ? 'pdm-variant-pill-disabled' : ''}`}
                              onClick={() => !isDisabled && handleStorageChange(s)}
                              disabled={isDisabled}
                            >
                              {s}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="pdm-price-box">
                {priceFormatted ? (
                  <div className="pdm-price-row">
                    <span className="pdm-curr-price">{priceFormatted}</span>
                    {originalPriceFormatted && <span className="pdm-mrp-price">{originalPriceFormatted}</span>}
                    {discountPercent && <span className="pdm-discount-pill">{discountPercent}% OFF</span>}
                  </div>
                ) : (
                  <div className="pdm-price-row">
                    <span className="pdm-curr-price pdm-quote-price">Price on Request</span>
                    <span className="pdm-discount-pill pdm-b2b-pill">Wholesale Bulk Rate</span>
                  </div>
                )}
                <p className="pdm-tax-note">Inclusive of GST. Volume discounts available for orders of 5+ units.</p>
              </div>

              {highlightsList.length > 0 && (
                <div className="pdm-chips-section">
                  <span className="pdm-chips-title">Key Highlights</span>
                  <div className="pdm-chips-row">
                    {highlightsList.map((chip, idx) => (
                      <div key={idx} className={`pdm-highlight-chip pdm-chip-${chip.color}`}>
                        <span className="pdm-chip-icon">{chip.icon}</span>
                        <div className="pdm-chip-text">
                          <span className="pdm-chip-label">{chip.label}</span>
                          <span className="pdm-chip-val" title={chip.val}>{chip.val}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pdm-actions-row">
                <a href={orderWaUrl} target="_blank" rel="noopener noreferrer" className="pdm-btn pdm-btn-primary">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.925-7.062A9.923 9.923 0 0012.012 2zm5.82 14.364c-.244.686-1.42 1.309-1.956 1.391-.502.076-1.144.109-1.841-.115-.427-.137-.978-.315-1.693-.625-2.986-1.293-4.93-4.321-5.08-4.52-.148-.2-1.218-1.621-1.218-3.091 0-1.47.77-2.194 1.042-2.494.272-.3.593-.375.79-.375.198 0 .395.002.567.01.183.008.428-.069.669.51.244.58.837 2.046.91 2.194.074.148.123.324.025.52-.099.196-.148.318-.296.491-.148.173-.312.387-.446.52-.148.148-.303.309-.13.606.173.297.77 1.272 1.652 2.057 1.134 1.01 2.091 1.323 2.388 1.47.297.148.47.123.643-.074.173-.198.742-.865.94-1.162.198-.297.396-.247.668-.148.272.099 1.73.816 2.027.964.297.148.495.222.568.346.074.124.074.717-.17 1.403z"/></svg>
                  Order on WhatsApp
                </a>
                <a href={enquiryWaUrl} target="_blank" rel="noopener noreferrer" className="pdm-btn pdm-btn-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.237a9.96 9.96 0 004.779 1.217h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.669-1.038-5.176-2.925-7.062A9.923 9.923 0 0012.012 2zm5.82 14.364c-.244.686-1.42 1.309-1.956 1.391-.502.076-1.144.109-1.841-.115-.427-.137-.978-.315-1.693-.625-2.986-1.293-4.93-4.321-5.08-4.52-.148-.2-1.218-1.621-1.218-3.091 0-1.47.77-2.194 1.042-2.494.272-.3.593-.375.79-.375.198 0 .395.002.567.01.183.008.428-.069.669.51.244.58.837 2.046.91 2.194.074.148.123.324.025.52-.099.196-.148.318-.296.491-.148.173-.312.387-.446.52-.148.148-.303.309-.13.606.173.297.77 1.272 1.652 2.057 1.134 1.01 2.091 1.323 2.388 1.47.297.148.47.123.643-.074.173-.198.742-.865.94-1.162.198-.297.396-.247.668-.148.272.099 1.73.816 2.027.964.297.148.495.222.568.346.074.124.074.717-.17 1.403z"/></svg>
                  WhatsApp Enquiry
                </a>
              </div>
            </div>
          </div>

          <div className="pdm-bottom-section">
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
                  {finalSpecsForTable.map((s, idx) => (
                    <tr key={idx}>
                      <td className="pdm-spec-key">{s.key}</td>
                      <td className="pdm-spec-val">{s.value}</td>
                    </tr>
                  ))}
                  {finalSpecsForTable.length === 0 && product.rawSpecs && (
                    <tr>
                      <td className="pdm-spec-key">Specifications</td>
                      <td className="pdm-spec-val">{product.rawSpecs}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className={`pdm-scroll-hint ${showScrollHint ? 'pdm-scroll-hint-visible' : ''}`} aria-hidden="true" />
      </div>
    </div>
  );
};

export default ProductDetailsModal;