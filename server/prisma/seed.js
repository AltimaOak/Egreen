const path = require('path');
const fs = require('fs');
const axios = require('axios');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { uploadImage } = require('../utils/cloudinary');

const prisma = new PrismaClient();

const categories = [
  { name: 'Mini PCs', slug: 'mini-pc' },
  { name: 'Thin Clients', slug: 'thin-client' },
  { name: 'Desktops', slug: 'desktop' },
  { name: 'Laptops', slug: 'laptop' },
  { name: 'Processors', slug: 'processors' },
  { name: 'Components & SSDs', slug: 'components' },
];

const brands = [
  { name: 'Dell', slug: 'dell' },
  { name: 'HP', slug: 'hp' },
  { name: 'Lenovo', slug: 'lenovo' },
  { name: 'Intel', slug: 'intel' },
  { name: 'Apacer', slug: 'apacer' },
  { name: 'Asus', slug: 'asus' },
];

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function detectBrand(name) {
  if (name.startsWith('Dell')) return 'dell';
  if (name.startsWith('HP') || name.startsWith('Hp')) return 'hp';
  if (name.startsWith('Lenovo')) return 'lenovo';
  if (name.startsWith('Intel')) return 'intel';
  if (name.startsWith('Apacer')) return 'apacer';
  if (name.startsWith('Asus')) return 'asus';
  return null;
}

// NOTE (data merge):
// - This script is now a sync script. It reads the scraped data files
//   (./products-scraped.json and ../products-scraped-remaining.json) and enriches
//   the matching products below with the real spec sheets, descriptions, INR prices
//   and product images scraped from egreentechnology.in.
// - Images are uploaded to Cloudinary (../utils/cloudinary.js) and the returned URL
//   is stored in Product.image. Re-runs skip re-uploading (idempotent).
// - products-scraped-remaining.json is mostly scraped nav/footer links (junk) — those
//   are skipped; it contains no products that aren't already in this list.
// - `price` is written now — the column already exists in schema.prisma + migration.
// - id: 3 ("Lenovo ThinkCentre M710q Tiny") specs conflict with the real site listing
//   (i5-7400T here vs i3 7th Gen on the live site). The scraped data wins via the
//   merge below, so the DB ends up with the live site's i3 7th Gen spec.

const productsData = [
  { id: 1, name: 'Dell Wyse 5070 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'Intel Celeron J4105 (Quad Core 1.5GHz, up to 2.5GHz Burst), 4GB RAM, 128GB Storage, Windows 10 IoT, VGA/DisplayPort, 36 Months Warranty', price: 14500, image: '/assets/dell_wyse_1785088101397.png' },
  { id: 2, name: 'Dell OptiPlex 7050 Micro', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Intel i3 6th Gen, 8GB RAM, 256GB SSD, Mini Form Factor, Windows 10, 1 Year Warranty', price: 15500, image: '/assets/dell_optiplex_1785088113196.png' },
  // ⚠️ Spec conflict noted above — left as originally authored, not overwritten.
  { id: 3, name: 'Lenovo ThinkCentre M710q Tiny', category: 'mini-pc', condition: 'Refurbished', stock: 'Low Stock', specs: 'Intel Core i5-7400T, 8GB RAM, 256GB SSD', image: '/assets/lenovo_tiny_1785088129692.png' },
  { id: 4, name: 'HP ProDesk 600 G3 Mini', category: 'mini-pc', condition: 'New', stock: 'In Stock', specs: 'Intel Core i5-7500T, 16GB RAM, 512GB SSD', image: '/assets/hp_prodesk_1785088141452.png' },
  { id: 5, name: 'HP t630 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'AMD GX-420GI, 8GB RAM, 32GB Flash', image: '/assets/hp_t630_1785088178254.png' },
  { id: 6, name: 'Intel Core i7-10700 Processor', category: 'processors', condition: 'New', stock: 'In Stock', specs: '2.90 GHz Base, 16M Cache, LGA1200', image: '/assets/intel_processor_1785088189677.png' },
  { id: 7, name: 'Dell Wyse 3030 LT Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'Intel Celeron Dual Core, 2GB RAM, 8GB Storage, Thin OS, DisplayPort, 12 Months Warranty', price: 4200, image: '/assets/dell_wyse_1785088101397.png' },
  { id: 8, name: 'Dell Wyse 3040 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'Intel Atom Quad Core, 2GB RAM, 8GB Storage, ThinOS, DisplayPort, 36 Months Warranty', price: 5500, image: '/assets/dell_wyse_1785088101397.png' },
  { id: 9, name: 'Dell Wyse 5010 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'AMD Radeon HD 6250, 4GB RAM, 16GB Storage, Mini PC Form Factor, Windows 10 IoT, DVI, 36 Months Warranty', price: 10500, image: '/assets/dell_wyse_1785088101397.png' },
  { id: 10, name: 'Dell 3040 OptiPlex Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Intel i3 6th Gen, 8GB RAM, M.2 SSD, 256GB, No WiFi, Windows 10, 1 Year Warranty', price: 14500, image: '/assets/dell_optiplex_1785088113196.png' },
  { id: 11, name: 'Dell Optiplex 7040 Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Intel i3 6th Gen, 8GB RAM, SSD, 256GB, Mini Form Factor, No WiFi, Windows 10, 1 Year Warranty', price: 14500, image: '/assets/dell_optiplex_1785088113196.png' },
  { id: 12, name: 'Dell Optiplex 3060 Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Intel i3 8th Gen, 8GB RAM, 256GB HDD, Mini Form Factor, Windows 10, 3 Years Warranty', price: 22500, image: '/assets/dell_optiplex_1785088113196.png' },
  { id: 13, name: 'Lenovo M720Q Mini ThinkCentre', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'i3 8th Gen, 8GB RAM, 256GB SSD, Tiny Form Factor, Windows 11, Black, 3 Years Warranty', price: 18500, image: '/assets/lenovo_tiny_1785088129692.png' },
  { id: 14, name: 'Lenovo M920Q Mini ThinkCentre', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'i3 8th Gen, 8GB RAM, 256GB SSD, Tiny Form Factor, Windows 11, Black, 1 Year Warranty', price: 18500, image: '/assets/lenovo_tiny_1785088129692.png' },
  { id: 15, name: 'Lenovo M910Q Mini ThinkCentre', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'i3 7th Gen, 8GB RAM, 256GB SSD, Mini Form Factor, Windows 11, Black, 3 Years Warranty', price: 16500, image: '/assets/lenovo_tiny_1785088129692.png' },
  { id: 16, name: 'Lenovo M900 Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'i3 6th Gen, 8GB RAM, 256GB SSD (1TB total storage capacity), Windows 11, Black, 3 Years Warranty', price: 15500, image: '/assets/lenovo_tiny_1785088129692.png' },
  { id: 17, name: 'Lenovo M700 Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'i3 6th Gen, 8GB RAM, 256GB SSD, Windows 11, Black, 1 Year Warranty', price: 15500, image: '/assets/lenovo_tiny_1785088129692.png' },
  { id: 18, name: 'HP 400G7 SSF ProDesk', category: 'desktop', condition: 'Refurbished', stock: 'In Stock', specs: 'HP ProDesk Series, i3 10th Gen, 8GB RAM, 256GB SSD, Windows 11, Tower, Black, 3 Years Warranty', price: 28500, image: '/assets/hp_prodesk_1785088141452.png' },
  { id: 19, name: 'HP 600G4 SSF ProDesk', category: 'desktop', condition: 'Refurbished', stock: 'In Stock', specs: 'HP ProDesk Series, i3 9th Gen, 8GB RAM, 256GB SSD, Windows 11, Black, 3 Years Warranty', price: 34500, image: '/assets/hp_prodesk_1785088141452.png' },
  { id: 20, name: 'HP 600G6 SSF ProDesk', category: 'desktop', condition: 'Refurbished', stock: 'In Stock', specs: 'i3 9th Gen, 256GB HDD, Windows 11, Black, 3 Years Warranty', price: 24500, image: '/assets/hp_prodesk_1785088141452.png' },
  { id: 21, name: 'HP 800G3 Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/hp_prodesk_1785088141452.png' },
  { id: 22, name: 'HP 400G6 Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/hp_prodesk_1785088141452.png' },
  { id: 23, name: 'HP T640 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/hp_t630_1785088178254.png' },
  { id: 24, name: 'Hp T430 Thin client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: '4GB RAM, 128GB SSD', image: '/assets/hp_t630_1785088178254.png' },
  { id: 25, name: 'Intel NUC (Next Unit of Computing)', category: 'mini-pc', condition: 'New', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/hero_mini_pcs_1785088044717.png' },
  { id: 26, name: 'Asus NUC (Next Unit of Computing)', category: 'mini-pc', condition: 'New', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/hero_mini_pcs_1785088044717.png' },
  { id: 27, name: 'Dell Precision 3660 Desktop PC', category: 'desktop', condition: 'New', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/dell_optiplex_1785088113196.png' },
  { id: 28, name: 'Dell Latitude 5410 Laptop', category: 'laptop', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/office_modern_1785088069141.png' },
  { id: 29, name: 'Hp Elitebook 840 G5 Laptop', category: 'laptop', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/office_modern_1785088069141.png' },
  { id: 30, name: 'Dell Latitude 5490', category: 'laptop', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/office_modern_1785088069141.png' },
  { id: 31, name: 'Apacer 32GB MLC SATA SSD', category: 'components', condition: 'New', stock: 'In Stock', specs: 'SATA Disk Drive', image: '/assets/storage_server_1785088081329.png' },
  { id: 32, name: 'Apacer 16GB MLC SATA SSD HALF SLIM', category: 'components', condition: 'New', stock: 'In Stock', specs: 'SATA Disk Drive', image: '/assets/storage_server_1785088081329.png' },

  // --- New products found on the live site but not yet in this list ---
  // No local frontend asset exists for these yet — using null; swap in a real
  // path (or the imimg CDN URL / Cloudinary URL) once Teammate 1/2 add one.
  { id: 33, name: 'Dell Wyse 5020 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'Quad Core AMD GX-415GA 1.5GHz, 4GB RAM, 128GB Storage, Windows 10 IoT, DisplayPort/DVI, 12 Months Warranty', price: 12500, image: null },
  { id: 34, name: 'Dell Wyse Optiplex 3000 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'Intel Celeron N5105, 4GB RAM, 128GB Storage, Windows 10 IoT, DisplayPort, 4x USB, 19V DC, 12 Months Warranty', price: 21500, image: null },
  { id: 35, name: 'Dell Wyse Z90DE7 Thin Client Dual Lan & SFP Port', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'AMD G-Series (Dual-core AMD G-T56N 1.6-1.65GHz), 4GB RAM, 128GB Storage, Mini PC Form Factor, Windows 10 IoT, DVI, Ethernet+WiFi, dual LAN, optional SFP port', price: 16500, image: null },
  { id: 36, name: 'Dell Wyse 7010 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'Dual Core AMD G-T56N, 4GB RAM, 128GB Storage, Windows 10 IoT, DVI, 36 Months Warranty', price: 13500, image: null },
  { id: 37, name: 'Dell Optiplex 3090 Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'i3 10th Gen, 8GB RAM, M.2 Storage, 512GB HDD (256GB storage capacity), Mini Form Factor, Windows 10, 3 Years Warranty', price: 24500, image: null },
  { id: 38, name: 'Dell OptiPlex 3050 Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Intel i3 7th Gen, 8GB RAM, 256GB SSD, Tiny Form Factor, Windows 10, 1 Year Warranty', price: 16500, image: null },
  { id: 39, name: 'HP 400G6 SSF ProDesk', category: 'desktop', condition: 'Refurbished', stock: 'In Stock', specs: 'HP ProDesk Series, Core i3, 8GB RAM, 256GB SSD, Desktop Form Factor, Windows 11, Black, 3 Years Warranty', price: 23500, image: null },
];

// ---------------------------------------------------------------------------
// Scraped-data merge helpers
// ---------------------------------------------------------------------------

// Slugs in products-scraped.json that name the same product under a different
// slug than the canonical seed entry below. Keys are the scraped slug; values
// are the seed slug to merge into (keeps the DB row stable, no duplicates).
const SCRAPED_ALIASES = {
  'dell-optiplex-7050-mini-pc': 'dell-optiplex-7050-micro',
  'lenovo-m710q-mini-thinkcentre': 'lenovo-thinkcentre-m710q-tiny',
};

const SPEC_LABELS = {
  processor: 'Processor',
  ramSize: 'RAM',
  ram: 'RAM',
  storageSize: 'Storage',
  storageType: 'Storage Type',
  storageCapacity: 'Storage Capacity',
  hardDriveSize: 'Hard Drive Size',
  operatingSystem: 'Operating System',
  displayOutput: 'Display Output',
  warranty: 'Warranty',
  usbPorts: 'USB Ports',
  powerInput: 'Power Input',
  network: 'Network',
  formFactor: 'Form Factor',
  brand: 'Brand',
  series: 'Series',
  wifi: 'WiFi',
  processorGeneration: 'Processor Generation',
  color: 'Color',
};

function specLabel(key) {
  if (SPEC_LABELS[key]) return SPEC_LABELS[key];
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase());
}

// Convert the scraped specs object (e.g. { processor, ramSize, ... }) into a
// single readable string for the Product.specs column.
function formatSpecs(specObj) {
  const parts = [];
  for (const [key, value] of Object.entries(specObj || {})) {
    if (value == null || value === '') continue;
    parts.push(`${specLabel(key)}: ${value}`);
  }
  return parts.join(', ');
}

// Load the scraped product list. The "remaining" file is raw scrape output
// (nav/footer links plus duplicate or empty listings) — every genuine product in
// it already exists in products-scraped.json or the seed list, so it contributes
// nothing. It is only counted as skipped.
function loadScrapedProducts() {
  const scraped = require('./products-scraped.json');
  const remaining = require('../products-scraped-remaining.json');

  const skipped = (remaining.products || []).length;
  return { products: [...(scraped.products || [])], skipped };
}

// Map each scraped product onto its canonical seed slug, carrying only the
// enrichment fields that should override the seed base.
function buildEnrichmentMap(scrapedProducts) {
  const map = {};
  for (const p of scrapedProducts) {
    // Skip listings that carry no real data (e.g. placeholder rows) so they
    // never overwrite existing seed fields with empty values.
    const hasData =
      (p.specs && Object.keys(p.specs).length > 0) ||
      p.imageUrl ||
      p.description ||
      p.price != null;
    if (!hasData) continue;

    const slug = slugify(p.name);
    const seedSlug = SCRAPED_ALIASES[slug] || slug;
    map[seedSlug] = {
      specs: formatSpecs(p.specs),
      description: p.description || null,
      price: p.price != null ? p.price : null,
      imageUrl: p.imageUrl || null,
    };
  }
  return map;
}

// ---------------------------------------------------------------------------
// Cloudinary image upload
// ---------------------------------------------------------------------------

const CLOUDINARY_URL_RE = /res\.cloudinary\.com/i;

async function fetchImageBuffer(url) {
  const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 20000 });
  return Buffer.from(res.data);
}

function readLocalImage(sourcePath) {
  // sourcePath is like "/assets/dell_wyse_....png" under frontend-react/public
  return fs.readFileSync(
    path.join(__dirname, '..', '..', 'frontend-react', 'public', sourcePath)
  );
}

// Upload a product image to Cloudinary and return the secure URL.
// Skips (and keeps the existing value) when the product already has a
// Cloudinary image — this is what makes re-runs idempotent.
async function uploadProductImage(source, existingImage) {
  if (existingImage && CLOUDINARY_URL_RE.test(existingImage)) {
    return { url: existingImage, uploaded: false };
  }
  if (!source) {
    return { url: existingImage || '', uploaded: false };
  }
  try {
    const buffer = /^https?:\/\//.test(source)
      ? await fetchImageBuffer(source)
      : readLocalImage(source);
    const { url } = await uploadImage(buffer, { folder: 'egreen/products' });
    return { url, uploaded: true };
  } catch (err) {
    console.warn(`  ! image upload failed (${source}): ${err.message}`);
    return { url: existingImage || '', uploaded: false };
  }
}

async function main() {
  console.log('Seeding database...');

  // Create categories
  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`Created ${categories.length} categories`);

  // Create brands
  const brandMap = {};
  for (const brand of brands) {
    const created = await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: { name: brand.name },
      create: brand,
    });
    brandMap[brand.slug] = created.id;
  }
  console.log(`Created ${brands.length} brands`);

  // Load scraped data and merge it onto the seed products
  const { products: scrapedProducts, skipped } = loadScrapedProducts();
  const enrichmentMap = buildEnrichmentMap(scrapedProducts);

  // Existing images (by slug) let us skip re-uploading to Cloudinary on re-runs
  const existing = await prisma.product.findMany({
    select: { slug: true, image: true },
  });
  const existingImageBySlug = new Map(existing.map((e) => [e.slug, e.image || '']));

  let enrichedCount = 0;
  let uploadedCount = 0;

  for (const p of productsData) {
    const slug = slugify(p.name);
    const brandSlug = detectBrand(p.name);
    const enrichment = enrichmentMap[slug];

    // Image: the scraped CDN image wins when available, else the local asset.
    // Either way the source image is uploaded to Cloudinary.
    const imageSource = (enrichment && enrichment.imageUrl) || p.image || null;
    const { url: image, uploaded } = await uploadProductImage(
      imageSource,
      existingImageBySlug.get(slug) || ''
    );
    if (uploaded) uploadedCount++;
    if (enrichment) enrichedCount++;

    let price = null;
    if (enrichment && enrichment.price != null) price = enrichment.price;
    else if (p.price != null) price = p.price;

    const data = {
      name: p.name,
      categoryId: categoryMap[p.category],
      brandId: brandSlug ? brandMap[brandSlug] : null,
      condition: p.condition,
      stock: p.stock,
      specs: enrichment ? enrichment.specs : p.specs,
      description: enrichment ? enrichment.description : null,
      price,
      image,
    };

    await prisma.product.upsert({
      where: { slug },
      update: data,
      create: { ...data, slug },
    });
  }

  console.log(
    `Upserted ${productsData.length} products (${enrichedCount} enriched from scraped data)`
  );
  console.log(`Uploaded ${uploadedCount} product images to Cloudinary`);
  console.log(`Skipped ${skipped} junk entries in products-scraped-remaining.json`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });