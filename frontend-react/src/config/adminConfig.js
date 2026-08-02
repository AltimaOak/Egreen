// Default config settings for Egreen Admin Panel

// Standard SHA-256 hash of "admin123" is "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9"
export const ADMIN_CREDENTIALS = {
  username: 'admin',
  passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // SHA-256 for admin123
};

export const DEFAULT_HOMEPAGE_DATA = {
  heroTitle: 'Reliable New & Refurbished IT Hardware Solutions',
  heroSubtitle: 'Egreen Technology supplies premium Dell, HP and Lenovo business systems, thin clients and computer components with competitive pricing and dependable customer support.',
  heroBtnText: 'Explore Products',
  heroBtnLink: '/products',
  ctaBtnText: 'Request Quote',
  ctaBtnLink: 'https://wa.me/917942625065',
  heroImage: '', // fallback to default CSS or standard image
  bannerImages: [],
  offers: [
    { title: 'Genuine Products', desc: '100% authentic hardware sourced from trusted manufacturers.' },
    { title: 'Quality Tested', desc: 'Every refurbished unit undergoes rigorous testing before shipment.' },
    { title: 'Wholesale Pricing', desc: 'Competitive rates that improve your bottom line.' },
    { title: 'Bulk Orders', desc: 'Capacity to fulfill massive IT requirements efficiently.' },
    { title: 'Fast Delivery', desc: 'Optimized logistics for quick dispatch and arrival.' },
    { title: 'Customer Support', desc: 'Dedicated assistance for all your technical inquiries.' }
  ],
  testimonials: [
    { id: 1, name: 'John Doe', role: 'IT Manager at TechCorp', content: 'Egreen provides outstanding refurbished mini PCs. We upgraded our whole office and everything runs smoothly.' },
    { id: 2, name: 'Sara Khan', role: 'Operations Lead at GlobalSys', content: 'Wholesale pricing is unmatched. The customer support guided us through our custom bulk build order.' }
  ],
  gallery: [],
  footerText: 'Â© 2026 Egreen Technology. All rights reserved.'
};

export const DEFAULT_ABOUT_DATA = {
  heroTitle: 'About Egreen Technology',
  heroSubtitle: 'Your trusted partner in enterprise IT hardware solutions since inception.',
  story: 'Egreen Technology has been a pioneer in distributing high-quality new and refurbished enterprise IT hardware across India. We specialize in Thin Clients, Mini PCs, Desktops, Laptops, Processors, and solid-state storage. By combining premium brands like Dell, HP, and Lenovo with strict quality check standards, we serve IT requirements of small, medium, and corporate businesses.',
  mission: 'Our mission is to offer top quality products at competitive prices, ensuring excellent value and performance for our customers. Whether you\'re looking for reliable brand-new equipment or high-quality refurbished products, Egreen Technology is your trusted partner in the IT industry.',
  vision: 'To become India\'s most trusted and preferred wholesaler of new and refurbished IT infrastructure, setting the industry standard for quality, transparency, and customer satisfaction.',
  facts: [
    { label: 'Headquarters', value: 'Mumbai' },
    { label: 'Business Type', value: 'Wholesale' },
    { label: 'GST Registered', value: 'Available' },
    { label: 'Clients Served', value: '1000+' }
  ],
  timeline: [
    { year: '2020', title: 'Inception', desc: 'Started Egreen Technology with a core focus on refurbished Thin Clients.' },
    { year: '2022', title: 'Expansion', desc: 'Expanded product line to Mini PCs, SSD storage devices, and premium business laptops.' },
    { year: '2024', title: 'GST Registration & Wholesaling', desc: 'Obtained official certifications, serving over 1000 B2B enterprise partners across India.' }
  ],
  ceoName: 'Tamy (Proprietor)',
  ceoMessage: 'At Egreen Technology, we believe that high-quality technology should be sustainable, affordable, and accessible. Our rigorous inspection and testing ensure every client receives hardware they can rely on for years to come.',
  ceoImage: '',
  team: [
    { id: 1, name: 'Tamy', role: 'Founder & CEO', image: '' },
    { id: 2, name: 'Support Team', role: 'Customer & Technical Support', image: '' }
  ],
  achievements: [
    'ISO Certified Hardening Standards',
    'Best IT Hardware Wholesaler (Regional)',
    '100% Quality Assurance Guarantee'
  ]
};

export const DEFAULT_CONTACT_DATA = {
  address: '3rd Floor, A-302, Aakar Nirman Sra Co-Op-Hsg Soc, Vilgml Road Dindoshi, Goregaon East, Mumbai - 400063, Maharashtra, India',
  phone: '+91-7942625065',
  whatsapp: '+917942625065',
  email: 'egreentechnology24@gmail.com',
  workingHours: 'Monday - Saturday: 9:00 AM - 6:00 PM; Sunday: Closed',
  googleMapsLink: 'https://maps.google.com/maps?q=19%C2%B010\'22.5%22N+72%C2%B051\'27.1%22E&hl=en&z=15&output=embed',
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  footerContact: '3rd Floor, A-302, Goregaon East, Mumbai - 400063'
};

export const DEFAULT_SETTINGS_DATA = {
  websiteName: 'Egreen Technology',
  logoText: 'Egreen Technology',
  logoImage: '', // Base64 or URL
  favicon: '',
  adminName: 'Administrator',
  primaryColor: '#10B981', // green theme
  primaryHoverColor: '#059669',
  secondaryColor: '#111827',
  footerText: 'Â© 2026 Egreen Technology. All rights reserved.',
  maintenanceMode: false
};

