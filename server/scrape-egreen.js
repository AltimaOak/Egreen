// scrape-egreen.js
//
// Best-effort scraper for the remaining egreentechnology.in category pages.
// Outputs the same JSON shape as products-scraped.json so you can merge them.
//
// IMPORTANT: I built the extraction logic from the page's *rendered/converted*
// content (via a page-fetch tool), not the raw HTML source. IndiaMART-template
// sites are usually consistent, but before running this at scale:
//   1. Run it on ONE category first (see CATEGORIES array below — comment out
//      the rest) and check the console output makes sense.
//   2. If a field comes back empty/wrong, open the page in your browser,
//      right-click > "View Page Source" (not just DevTools' rendered DOM),
//      and adjust the selectors marked with "ADJUST IF NEEDED" below.
//
// Install deps first:
//   npm install axios cheerio
//
// Run:
//   node scrape-egreen.js

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const BASE = "https://www.egreentechnology.in";

// All remaining category slugs (from our-products.html) not yet in products-scraped.json.
// Add/remove slugs here as needed.
const CATEGORIES = [
  { slug: "hp-mini-pc", brand: "HP", category: "HP Mini PC" },
  { slug: "hp-thin-client", brand: "HP", category: "HP Thin Client" },
  { slug: "computer-processor", brand: "Mixed", category: "Computer Processor" },
  { slug: "dell-thin-client", brand: "Dell", category: "Dell Thin Client" },
  { slug: "thin-client", brand: "HP", category: "Thin Client" },
  { slug: "dell-precision-desktop-pc", brand: "Dell", category: "Dell Precision Desktop PC" },
  { slug: "refurbished-laptop", brand: "Dell", category: "Refurbished Laptop" },
  { slug: "used-refurbished-laptops", brand: "HP", category: "Used Refurbished Laptops" },
  { slug: "dell-desktop", brand: "Dell", category: "Dell Desktop" },
  { slug: "dell-refurbished-laptops", brand: "Dell", category: "Dell Refurbished Laptops" },
  { slug: "ssd", brand: "Mixed", category: "SSD" },
  { slug: "sata-disk-drive", brand: "Mixed", category: "SATA Disk Drive" },
  { slug: "hp-laptop", brand: "HP", category: "HP Laptop" },
];

function cleanText(t) {
  return t.replace(/\s+/g, " ").trim();
}

function upgradeImageUrl(url) {
  // IndiaMART thumbnails are typically served as 125x125; swap for 500x500 where possible
  return url ? url.replace("125x125", "500x500") : url;
}

async function scrapeCategory(cat) {
  const url = `${BASE}/${cat.slug}.html`;
  console.log(`Fetching ${url} ...`);

  const { data: html } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; EgreenCatalogSync/1.0)" },
  });
  const $ = cheerio.load(html);

  const products = [];

  // ADJUST IF NEEDED: product blocks are typically headed by an <h2> with the product name.
  // We iterate every h2 in the main content and treat everything until the next h2/h3
  // as belonging to that product.
  const headings = $("h2").toArray();

  headings.forEach((el, idx) => {
    const name = cleanText($(el).text());
    // Skip the category title heading itself (usually the very first h2 matches the category name)
    if (!name || name.toLowerCase() === cat.category.toLowerCase()) return;

    // Collect all following siblings until the next h2 (or end of section)
    const blockHtml = [];
    let next = $(el).next();
    while (next.length && !next.is("h2")) {
      blockHtml.push($.html(next));
      next = next.next();
    }
    const $block = cheerio.load(blockHtml.join("\n"));
    const blockText = cleanText($block.root().text());

    // Price: look for "Rs <number>"
    const priceMatch = blockText.match(/Rs\s?([\d,]+)\s*\/\s*(\w+)/i);
    const price = priceMatch ? parseInt(priceMatch[1].replace(/,/g, ""), 10) : null;
    const priceUnit = priceMatch ? priceMatch[2] : null;

    // Specs: first table on the block (ADJUST IF NEEDED if specs use divs instead of <table>)
    const specs = {};
    $block("table").first().find("tr").each((_, row) => {
      const cells = $block(row).find("td, th");
      if (cells.length >= 2) {
        const key = cleanText($block(cells[0]).text());
        const val = cleanText($block(cells[1]).text());
        if (key && val) specs[key] = val;
      }
    });

    // Images: first few <img> src attributes in the block
    const images = [];
    $block("img").each((_, img) => {
      const src = $block(img).attr("src");
      if (src && src.startsWith("http")) images.push(upgradeImageUrl(src));
    });

    // Description: first substantial <p> text in the block
    let description = "";
    $block("p").each((_, p) => {
      const text = cleanText($block(p).text());
      if (text.length > 60 && !description) description = text;
    });

    if (name) {
      products.push({
        brand: cat.brand,
        category: cat.category,
        categorySlug: cat.slug,
        name,
        price,
        priceUnit,
        priceNote: "Price on Request",
        specs,
        description, // NOTE: raw site text — paraphrase before using publicly if copyright is a concern
        imageUrl: images[0] || null,
        allImages: images,
      });
    }
  });

  return products;
}

async function main() {
  const all = [];
  for (const cat of CATEGORIES) {
    try {
      const products = await scrapeCategory(cat);
      console.log(`  -> found ${products.length} products in ${cat.slug}`);
      all.push(...products);
      // be polite — small delay between requests
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.error(`Failed to scrape ${cat.slug}:`, err.message);
    }
  }

  fs.writeFileSync(
    "products-scraped-remaining.json",
    JSON.stringify({ products: all }, null, 2)
  );
  console.log(`\nDone. ${all.length} products written to products-scraped-remaining.json`);
}

main();