import React, { useState } from 'react';

const itServicesData = [
  {
    id: 'cloud-setup',
    title: 'Cloud Setup & Migration',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    ),
    items: [
      'Cloud Server Setup',
      'Cloud Migration',
      'Cloud Backup',
      'Cloud Security'
    ],
    overview: 'Seamlessly migrate your physical infrastructure or legacy systems to high-availability cloud platforms (AWS, Azure, Google Cloud).',
    keyBenefits: [
      '99.99% uptime with scalable cloud server infrastructure',
      'Zero-data-loss migration strategies with minimal downtime',
      'Automated daily backups and multi-region disaster recovery',
      'Advanced cloud security, firewall policies, and access controls'
    ]
  },
  {
    id: 'rack-server',
    title: 'Rack Server Setup',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="8" x="2" y="2" rx="2" />
        <rect width="20" height="8" x="2" y="14" rx="2" />
        <line x1="6" x2="6.01" y1="6" y2="6" />
        <line x1="6" x2="6.01" y1="18" y2="18" />
      </svg>
    ),
    items: [
      'Rack Server Installation',
      'RAID Configuration',
      'Server OS Installation',
      'Server Networking'
    ],
    overview: 'End-to-end physical server assembly, hardware installation, RAID array setup, and enterprise OS deployment (Dell PowerEdge, HP ProLiant, Lenovo).',
    keyBenefits: [
      'Professional rack mounting, cable management, and airflow planning',
      'Hardware RAID 0/1/5/10 configuration for max speed and redundancy',
      'Windows Server / Linux OS installation with security hardening',
      'High-speed network interface card (NIC) teaming and IPMI setup'
    ]
  },
  {
    id: 'vdi-setup',
    title: 'VDI Setup',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="12" x="3" y="4" rx="2" />
        <line x1="2" x2="22" y1="20" y2="20" />
        <line x1="12" x2="12" y1="16" y2="20" />
      </svg>
    ),
    items: [
      'VDI Server Setup',
      'Virtual Desktop',
      'Thin Client Deployment',
      'User Configuration'
    ],
    overview: 'Centralized Virtual Desktop Infrastructure (VDI) powering secure employee desktops remotely via low-cost Thin Clients or Mini PCs.',
    keyBenefits: [
      'Drastically reduce hardware costs and electricity consumption',
      'Centralized administration: deploy or update user desktops in seconds',
      'Compatible with Dell Wyse, HP, Atrust, and NComputing Thin Clients',
      'Enhanced data security: zero data saved on local endpoint devices'
    ]
  },
  {
    id: 'rdp-setup',
    title: 'RDP Setup',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        <path d="M12 12v6" />
        <path d="m15 15-3-3-3 3" />
      </svg>
    ),
    items: [
      'Remote Desktop',
      'Windows RDS',
      'Secure Remote Access',
      'Remote Application'
    ],
    overview: 'Secure multi-user Remote Desktop Services (RDS) allowing employees to safely access central office software from anywhere in the world.',
    keyBenefits: [
      'Windows RDS CAL licensing, Gateway, and Web Access setup',
      'RemoteApp support: publish individual apps directly to user browsers',
      'SSL VPN & encrypted gateway protection for secure offsite work',
      'Session shadowing, bandwith management, and remote printer mapping'
    ]
  },
  {
    id: 'network-infra',
    title: 'Network Infrastructure',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    ),
    items: [
      'LAN Setup',
      'Wi-Fi',
      'Switch & Router',
      'Firewall'
    ],
    overview: 'Complete office network installation including structured Cat6 cabling, high-speed Wi-Fi Access Points, managed switches, and Next-Gen Firewalls.',
    keyBenefits: [
      'Structured Cat6/Cat6A cabling, patch panel termination, and testing',
      'Enterprise mesh Wi-Fi coverage (Ubiquiti UniFi, Cisco, TP-Link)',
      'Managed Switch VLAN segmentation for voice, data, and guest networks',
      'Hardware Firewall installation (Sophos, Fortinet) for intrusion prevention'
    ]
  },
  {
    id: 'it-amc',
    title: 'IT AMC & Support',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    items: [
      'Server Support',
      'Desktop Support',
      'Network Support',
      'Remote Support'
    ],
    overview: 'Comprehensive Annual Maintenance Contracts (AMC) providing rapid remote helpdesk and onsite technician support for your entire IT fleet.',
    keyBenefits: [
      'Preventive hardware maintenance and quarterly health diagnostics',
      'Dedicated SLA response times for critical server & network failures',
      'Standby computer hardware replacement during emergency breakdowns',
      'OS patch management, malware cleanup, and network troubleshooting'
    ]
  }
];

const softwareServicesData = [
  {
    id: 'website-dev',
    title: 'Website Development',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    items: [
      'Responsive Web Design',
      'E-Commerce Portals',
      'SEO & Speed Optimization',
      'CMS & Content Management'
    ],
    overview: 'High-performing, responsive websites built with modern web technologies engineered for lead generation, speed, and search engine visibility.',
    keyBenefits: [
      '100% responsive across mobile, tablet, and desktop screens',
      'Fast loading speed optimized for Google Core Web Vitals',
      'Custom interactive forms, product catalogs, and live chat setup',
      'Free SSL certificate installation and domain deployment'
    ]
  },
  {
    id: 'webapp-dev',
    title: 'Web Application Development',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    items: [
      'Custom Web Dashboards',
      'SaaS Platform Engineering',
      'REST API Integration',
      'Database Architecture'
    ],
    overview: 'Scalable full-stack web applications (React, Node.js, PostgreSQL) tailored for complex business logic, customer portals, and SaaS solutions.',
    keyBenefits: [
      'Custom React frontend paired with robust Node.js API backend',
      'Role-based access control (RBAC) and secure authentication',
      'Relational database architecture built for speed and reliability',
      'Integration with payment gateways, CRMs, and third-party APIs'
    ]
  },
  {
    id: 'app-dev',
    title: 'App Development',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <line x1="12" x2="12.01" y1="18" y2="18" />
      </svg>
    ),
    items: [
      'Android & iOS Apps',
      'React Native Development',
      'Enterprise Workforce Apps',
      'App Store Deployment'
    ],
    overview: 'Intuitive cross-platform mobile apps for iOS & Android featuring fast performance, push notifications, and offline data sync.',
    keyBenefits: [
      'Single codebase delivering native performance on iOS & Android',
      'Push notifications, camera/GPS integration, and secure user login',
      'Modern UI/UX designed following Material Design & Apple HIG guidelines',
      'Full assistance with Google Play Store & Apple App Store publishing'
    ]
  },
  {
    id: 'custom-software',
    title: 'Custom Software Development',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    items: [
      'Tailored ERP & Billing Systems',
      'Inventory & Stock Management',
      'Business Process Automation',
      'Legacy Code Modernization'
    ],
    overview: 'Bespoke software systems designed specifically to automate your business workflows, inventory management, and billing operations.',
    keyBenefits: [
      'Tailored features built exactly around your business process',
      'Eliminate repetitive spreadsheet work with automated workflows',
      'Automated PDF invoice generation and financial audit reporting',
      'Full ownership of complete source code and custom modules'
    ]
  }
];

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  const openModal = (service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  const handleWhatsAppInquiry = (title) => {
    const text = encodeURIComponent(`Hello Egreen Technology team, I would like to inquire about: "${title}". Please share details and pricing.`);
    window.open(`https://wa.me/919867760106?text=${text}`, '_blank');
  };

  return (
    <div className="simple-services-page">
      {/* IT Services Section */}
      <section className="simple-services-section">
        <div className="services-container">
          <h2 className="simple-section-title">IT Services</h2>
          
          <div className="simple-cards-grid">
            {itServicesData.map((service) => (
              <div className="simple-card" key={service.id}>
                <div className="simple-card-header">
                  <div className="simple-icon-box">{service.icon}</div>
                  <h3 className="simple-card-title">{service.title}</h3>
                </div>

                <ul className="simple-items-list">
                  {service.items.map((item, idx) => (
                    <li key={idx}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="simple-check">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  type="button"
                  className="simple-learn-btn"
                  onClick={() => openModal(service)}
                >
                  Learn More
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Software Development Section */}
      <section className="simple-services-section bg-alt">
        <div className="services-container">
          <h2 className="simple-section-title">Software Development</h2>
          
          <div className="simple-software-grid">
            {softwareServicesData.map((sw) => (
              <div className="simple-software-card" key={sw.id}>
                <div className="simple-icon-box sw-icon">{sw.icon}</div>
                <h3 className="simple-card-title">{sw.title}</h3>
                <button 
                  type="button"
                  className="simple-learn-btn sw-btn"
                  onClick={() => openModal(sw)}
                >
                  Learn More
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Info Modal */}
      {selectedService && (
        <div className="service-modal-overlay" onClick={closeModal}>
          <div className="service-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="service-modal-close" onClick={closeModal} aria-label="Close">
              &times;
            </button>
            
            <div className="service-modal-header">
              <div className="simple-icon-box">{selectedService.icon}</div>
              <h3 className="modal-title">{selectedService.title}</h3>
            </div>

            <div className="service-modal-body">
              <p className="modal-overview">{selectedService.overview}</p>
              
              <h4 className="modal-subheading">Core Offerings</h4>
              <div className="modal-items-grid">
                {selectedService.items.map((item, i) => (
                  <div className="modal-item-chip" key={i}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <h4 className="modal-subheading">Key Benefits</h4>
              <ul className="modal-benefits-list">
                {selectedService.keyBenefits.map((benefit, bIdx) => (
                  <li key={bIdx}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className="service-modal-footer">
              <button
                type="button"
                className="btn-whatsapp-inquiry"
                onClick={() => handleWhatsAppInquiry(selectedService.title)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Inquire on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
