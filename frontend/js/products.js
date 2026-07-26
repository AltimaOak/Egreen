const products = [
  { id: 1, name: 'Dell Wyse 5070 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'Intel Pentium Silver J5005, 4GB RAM, 16GB eMMC', image: 'file:///C:/Users/adi14/.gemini/antigravity-ide/brain/10636e87-fa84-4d38-87dc-923c7193b059/dell_wyse_1785088101397.png' },
  { id: 2, name: 'Dell OptiPlex 7050 Micro', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Intel Core i5-7500T, 8GB RAM, 256GB SSD', image: 'file:///C:/Users/adi14/.gemini/antigravity-ide/brain/10636e87-fa84-4d38-87dc-923c7193b059/dell_optiplex_1785088113196.png' },
  { id: 3, name: 'Lenovo ThinkCentre M710q Tiny', category: 'mini-pc', condition: 'Refurbished', stock: 'Low Stock', specs: 'Intel Core i5-7400T, 8GB RAM, 256GB SSD', image: 'file:///C:/Users/adi14/.gemini/antigravity-ide/brain/10636e87-fa84-4d38-87dc-923c7193b059/lenovo_tiny_1785088129692.png' },
  { id: 4, name: 'HP ProDesk 600 G3 Mini', category: 'mini-pc', condition: 'New', stock: 'In Stock', specs: 'Intel Core i5-7500T, 16GB RAM, 512GB SSD', image: 'file:///C:/Users/adi14/.gemini/antigravity-ide/brain/10636e87-fa84-4d38-87dc-923c7193b059/hp_prodesk_1785088141452.png' },
  { id: 5, name: 'HP t630 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'AMD GX-420GI, 8GB RAM, 32GB Flash', image: 'file:///C:/Users/adi14/.gemini/antigravity-ide/brain/10636e87-fa84-4d38-87dc-923c7193b059/hp_t630_1785088178254.png' },
  { id: 6, name: 'Intel Core i7-10700 Processor', category: 'processors', condition: 'New', stock: 'In Stock', specs: '2.90 GHz Base, 16M Cache, LGA1200', image: 'file:///C:/Users/adi14/.gemini/antigravity-ide/brain/10636e87-fa84-4d38-87dc-923c7193b059/intel_processor_1785088189677.png' },
];

document.addEventListener('DOMContentLoaded', () => {
  const productGrid = document.getElementById('product-grid');
  const searchInput = document.getElementById('search-input');
  const categoryBtns = document.querySelectorAll('.category-btn');
  
  if (!productGrid) return; // Only run on products page

  let currentCategory = 'all';
  let searchTerm = '';

  function renderProducts() {
    const filtered = products.filter(p => {
      const matchCategory = currentCategory === 'all' || p.category === currentCategory;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.specs.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });

    productGrid.innerHTML = '';

    if (filtered.length === 0) {
      productGrid.innerHTML = '<p>No products found matching your criteria.</p>';
      return;
    }

    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card product-card fade-up visible';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" class="product-card-img" />
        <div class="product-card-body">
          <div class="product-badges">
            <span class="badge badge-condition">${p.condition}</span>
            <span class="badge badge-stock">${p.stock}</span>
          </div>
          <h3>${p.name}</h3>
          <p>${p.specs}</p>
          <a href="contact.html?product=${encodeURIComponent(p.name)}" class="btn btn-outline">Request Quote</a>
        </div>
      `;
      productGrid.appendChild(card);
    });
  }

  // Event Listeners
  searchInput.addEventListener('input', (e) => {
    searchTerm = e.target.value;
    renderProducts();
  });

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentCategory = e.target.dataset.category;
      renderProducts();
    });
  });

  // Initial render
  renderProducts();
});
