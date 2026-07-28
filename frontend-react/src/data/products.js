export const products = [
  // Original Products
  { id: 1, name: 'Dell Wyse 5070 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'Intel Pentium Silver J5005, 4GB RAM, 16GB eMMC', image: '/assets/dell_wyse_1785088101397.png' },
  { id: 2, name: 'Dell OptiPlex 7050 Micro', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Intel Core i5-7500T, 8GB RAM, 256GB SSD', image: '/assets/dell_optiplex_1785088113196.png' },
  { id: 3, name: 'Lenovo ThinkCentre M710q Tiny', category: 'mini-pc', condition: 'Refurbished', stock: 'Low Stock', specs: 'Intel Core i5-7400T, 8GB RAM, 256GB SSD', image: '/assets/lenovo_tiny_1785088129692.png' },
  { id: 4, name: 'HP ProDesk 600 G3 Mini', category: 'mini-pc', condition: 'New', stock: 'In Stock', specs: 'Intel Core i5-7500T, 16GB RAM, 512GB SSD', image: '/assets/hp_prodesk_1785088141452.png' },
  { id: 5, name: 'HP t630 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'AMD GX-420GI, 8GB RAM, 32GB Flash', image: '/assets/hp_t630_1785088178254.png' },
  { id: 6, name: 'Intel Core i7-10700 Processor', category: 'processors', condition: 'New', stock: 'In Stock', specs: '2.90 GHz Base, 16M Cache, LGA1200', image: '/assets/intel_processor_1785088189677.png' },

  // New Dell Thin Clients
  { id: 7, name: 'Dell Wyse 3030 LT Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/dell_wyse_1785088101397.png' },
  { id: 8, name: 'Dell Wyse 3040 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/dell_wyse_1785088101397.png' },
  { id: 9, name: 'Dell Wyse 5010 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/dell_wyse_1785088101397.png' },
  
  // New Dell Mini PCs
  { id: 10, name: 'Dell 3040 OptiPlex Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/dell_optiplex_1785088113196.png' },
  { id: 11, name: 'Dell Optiplex 7040 Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/dell_optiplex_1785088113196.png' },
  { id: 12, name: 'Dell Optiplex 3060 Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/dell_optiplex_1785088113196.png' },

  // New Lenovo ThinkCentres & Mini PCs
  { id: 13, name: 'Lenovo M720Q Mini ThinkCentre', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/lenovo_tiny_1785088129692.png' },
  { id: 14, name: 'Lenovo M920Q Mini ThinkCentre', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/lenovo_tiny_1785088129692.png' },
  { id: 15, name: 'Lenovo M910Q Mini ThinkCentre', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/lenovo_tiny_1785088129692.png' },
  { id: 16, name: 'Lenovo M900 Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/lenovo_tiny_1785088129692.png' },
  { id: 17, name: 'Lenovo M700 Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/lenovo_tiny_1785088129692.png' },

  // New HP ProDesks & Mini PCs
  { id: 18, name: 'HP 400G7 SSF ProDesk', category: 'desktop', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/hp_prodesk_1785088141452.png' },
  { id: 19, name: 'HP 600G4 SSF ProDesk', category: 'desktop', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/hp_prodesk_1785088141452.png' },
  { id: 20, name: 'HP 600G6 SSF ProDesk', category: 'desktop', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/hp_prodesk_1785088141452.png' },
  { id: 21, name: 'HP 800G3 Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/hp_prodesk_1785088141452.png' },
  { id: 22, name: 'HP 400G6 Mini PC', category: 'mini-pc', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/hp_prodesk_1785088141452.png' },

  // New HP Thin Clients
  { id: 23, name: 'HP T640 Thin Client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/hp_t630_1785088178254.png' },
  { id: 24, name: 'Hp T430 Thin client', category: 'thin-client', condition: 'Refurbished', stock: 'In Stock', specs: '4GB RAM, 128GB SSD', image: '/assets/hp_t630_1785088178254.png' },
  
  // NUCs
  { id: 25, name: 'Intel NUC (Next Unit of Computing)', category: 'mini-pc', condition: 'New', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/hero_mini_pcs_1785088044717.png' },
  { id: 26, name: 'Asus NUC (Next Unit of Computing)', category: 'mini-pc', condition: 'New', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/hero_mini_pcs_1785088044717.png' },
  
  // Desktops
  { id: 27, name: 'Dell Precision 3660 Desktop PC', category: 'desktop', condition: 'New', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/dell_optiplex_1785088113196.png' },

  // Laptops
  { id: 28, name: 'Dell Latitude 5410 Laptop', category: 'laptop', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/office_modern_1785088069141.png' },
  { id: 29, name: 'Hp Elitebook 840 G5 Laptop', category: 'laptop', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/office_modern_1785088069141.png' },
  { id: 30, name: 'Dell Latitude 5490', category: 'laptop', condition: 'Refurbished', stock: 'In Stock', specs: 'Contact for specs', image: '/assets/office_modern_1785088069141.png' },
  
  // SSDs
  { id: 31, name: 'Apacer 32GB MLC SATA SSD', category: 'components', condition: 'New', stock: 'In Stock', specs: 'SATA Disk Drive', image: '/assets/storage_server_1785088081329.png' },
  { id: 32, name: 'Apacer 16GB MLC SATA SSD HALF SLIM', category: 'components', condition: 'New', stock: 'In Stock', specs: 'SATA Disk Drive', image: '/assets/storage_server_1785088081329.png' },
];
