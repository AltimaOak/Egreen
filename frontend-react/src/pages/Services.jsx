import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const itServicesData = [
  {
    id: 'cloud-setup',
    title: 'Cloud Setup & Migration',
    badge: 'Enterprise Cloud',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    ),
    description: 'Scalable cloud infrastructure design, seamless data migration, automated backups, and advanced cybersecurity posture for enterprise workloads.',
    items: [
      'Cloud Server Setup',
      'Cloud Migration',
      'Cloud Backup',
      'Cloud Security'
    ],
    modalDetails: {
      overview: 'Our Cloud Setup & Migration service helps businesses transition smoothly from legacy physical infrastructure to high-availability cloud platforms (AWS, Azure, Google Cloud, and private clouds).',
      keyBenefits: [
        '99.99% uptime SLA with fault-tolerant cloud architecture',
        'Zero data loss migration strategies with minimum downtime',
        'End-to-end cloud encryption, IAM access controls, and firewall rules',
        'Automated scheduled backups with multi-region disaster recovery'
      ]
    }
  },
  {
    id: 'rack-server',
    title: 'Rack Server Setup',
    badge: 'Hardware & OS',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="8" x="2" y="2" rx="2" />
        <rect width="20" height="8" x="2" y="14" rx="2" />
        <line x1="6" x2="6.01" y1="6" y2="6" />
        <line x1="6" x2="6.01" y1="18" y2="18" />
      </svg>
    ),
    description: 'Turnkey physical server deployment, rack assembly, RAID storage pooling, OS provisioning, and enterprise network integration.',
    items: [
      'Rack Server Installation',
      'RAID Configuration',
      'Server OS Installation',
      'Server Networking'
    ],
    modalDetails: {
      overview: 'We specialize in physical server deployment across Dell PowerEdge, HP ProLiant, Lenovo ThinkSystem, and custom rack systems. From hardware mounting to OS optimization.',
      keyBenefits: [
        'Precision rack mounting, cable management, and thermal planning',
        'Hardware RAID 0/1/5/10 configuration for speed & data protection',
        'Windows Server / Linux Enterprise OS installation with hardening',
        'High-bandwidth NIC teaming, VLAN setup, and IPMI/iDRAC configuration'
      ]
    }
  },
  {
    id: 'vdi-setup',
    title: 'VDI Setup',
    badge: 'Virtualization',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="12" x="3" y="4" rx="2" />
        <line x1="2" x2="22" y1="20" y2="20" />
        <line x1="12" x2="12" y1="16" y2="20" />
      </svg>
    ),
    description: 'Centralized Virtual Desktop Infrastructure (VDI) deployment with thin client optimization for secure, seamless remote workforce management.',
    items: [
      'VDI Server Setup',
      'Virtual Desktop',
      'Thin Client Deployment',
      'User Configuration'
    ],
    modalDetails: {
      overview: 'Transform your organization’s computing environment with Virtual Desktop Infrastructure (VDI). Run desktops centrally on high-performance host servers while users connect via low-power Thin Clients or Mini PCs.',
      keyBenefits: [
        'Massively reduced hardware capital expenditures and energy costs',
        'Centralized user access management and instant image provisioning',
        'Seamless thin client provisioning (Dell Wyse, HP, Atrust, NComputing)',
        'Data remains secure in data center, preventing data leaks at endpoints'
      ]
    }
  },
  {
    id: 'rdp-setup',
    title: 'RDP Setup',
    badge: 'Remote Access',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        <path d="M12 12v6" />
        <path d="m15 15-3-3-3 3" />
      </svg>
    ),
    description: 'High-security Remote Desktop Services (RDS) installation, remote app publishing, and encrypted tunnel configurations for offsite employees.',
    items: [
      'Remote Desktop',
      'Windows RDS',
      'Secure Remote Access',
      'Remote Application'
    ],
    modalDetails: {
      overview: 'Enable encrypted, multi-user Remote Desktop access to your central office servers and software application suites from anywhere in the world.',
      keyBenefits: [
        'Windows Remote Desktop Services (RDS) licensing & CAL configuration',
        'RemoteApp publishing — run office applications directly from web browser',
        'SSL VPN / TLS gateway integration for zero-trust remote access',
        'Session shadowing, bandwith optimization, and print redirection'
      ]
    }
  },
  {
    id: 'network-infra',
    title: 'Network Infrastructure',
    badge: 'Networking & Security',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    ),
    description: 'Structured Cat6 cabling, high-speed Gigabit Wi-Fi networks, managed switch routing, and hardware firewall deployment for business networks.',
    items: [
      'LAN Setup',
      'Wi-Fi',
      'Switch & Router',
      'Firewall'
    ],
    modalDetails: {
      overview: 'End-to-end office networking services engineered for zero packet loss, high throughput, and robust perimeter defense.',
      keyBenefits: [
        'Structured LAN cabling (Cat6/Cat6A), patch panel termination, & testing',
        'Seamless mesh enterprise Wi-Fi coverage (Ubiquiti, Cisco, TP-Link Omada)',
        'Layer 2/3 Managed Switch VLAN setup and core router configuration',
        'Next-Gen Firewall installation (Sophos, Fortinet, SonicWall) with intrusion prevention'
      ]
    }
  },
  {
    id: 'it-amc',
    title: 'IT AMC & Support',
    badge: 'Maintenance & Support',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    description: 'Comprehensive Annual Maintenance Contracts (AMC) providing rapid onsite & remote technical support for servers, desktops, and networks.',
    items: [
      'Server Support',
      'Desktop Support',
      'Network Support',
      'Remote Support'
    ],
    modalDetails: {
      overview: 'Keep your IT business operations running 24/7 without unexpected downtime. Our Annual Maintenance Contract (AMC) provides dedicated engineers and SLA-backed support.',
      keyBenefits: [
        'Scheduled preventive hardware maintenance and health checkups',
        'Fast response remote helpdesk and onsite technician visit',
        'Hardware replacement coverage options & standby machine replacement',
        'Virus removal, OS patch management, and network troubleshooting'
      ]
    }
  }
];

const softwareDevData = [
  {
    id: 'website-dev',
    title: 'Website Development',
    badge: 'Web Solutions',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    description: 'Modern, mobile-responsive, lightning-fast corporate websites engineered for conversion, brand authority, and top Google search rankings.',
    items: [
      'Responsive Website Design',
      'Corporate & E-Commerce Portals',
      'SEO & Performance Optimization',
      'CMS Integration (WordPress/Custom)'
    ],
    modalDetails: {
      overview: 'We build ultra-fast, mobile-optimized websites using clean modern code standards that showcase your enterprise products and drive targeted business inquiries.',
      keyBenefits: [
        '100% responsive across mobile, tablet, and ultra-wide desktops',
        'Blazing fast page loading speed optimized for SEO rankings',
        'Custom interactive elements, quote forms, and live chat integration',
        'Secure hosting deployment with free SSL certificate setup'
      ]
    }
  },
  {
    id: 'webapp-dev',
    title: 'Web Application Development',
    badge: 'Full-Stack SaaS',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    description: 'Custom React, Node.js, and Cloud web applications built for complex business logic, customer portals, dashboards, and SaaS platforms.',
    items: [
      'Custom Web Portals & Dashboards',
      'SaaS Application Engineering',
      'REST & GraphQL API Integration',
      'Database Architecture & Security'
    ],
    modalDetails: {
      overview: 'Empower your operations with robust web applications. From custom inventory portals to complex customer-facing dashboards, we build scalable digital platforms.',
      keyBenefits: [
        'Modern React / Vue frontend coupled with Node.js / Express backend',
        'Role-Based Access Control (RBAC) and JWT secure authentication',
        'Relational & NoSQL database architecture (Postgres, MongoDB, MySQL)',
        'Third-party API integrations (Payment gateways, CRM, ERP)'
      ]
    }
  },
  {
    id: 'app-dev',
    title: 'App Development',
    badge: 'Mobile Apps',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
        <line x1="12" x2="12.01" y1="18" y2="18" />
      </svg>
    ),
    description: 'Native and cross-platform mobile apps for Android & iOS designed with slick UI, push notifications, offline capability, and store deployment.',
    items: [
      'Android & iOS App Development',
      'React Native & Cross-Platform Solutions',
      'Enterprise Workforce Apps',
      'Play Store & App Store Publishing'
    ],
    modalDetails: {
      overview: 'Deliver intuitive mobile experiences to your customers and staff. We build cross-platform mobile apps using React Native and Flutter for high performance.',
      keyBenefits: [
        'Single codebase powering both Android and iOS devices seamlessly',
        'Push notifications, offline data sync, and device camera/GPS integration',
        'Intuitive UI/UX design following iOS Human Interface & Material Design',
        'Complete store submission & approval assistance'
      ]
    }
  },
  {
    id: 'custom-software',
    title: 'Custom Software Development',
    badge: 'Tailored Business Tech',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    description: 'Bespoke business software, ERP/CRM modules, inventory management systems, and workflow automation crafted for your exact specifications.',
    items: [
      'Tailored ERP & Billing Systems',
      'Inventory & Stock Management',
      'Business Process Automation',
      'Legacy Software Modernization'
    ],
    modalDetails: {
      overview: 'Eliminate repetitive manual tasks and off-the-shelf limitations with custom software designed specifically around your business workflows.',
      keyBenefits: [
        'Tailored features with zero unnecessary bloatware',
        'Seamless integration with your existing IT & hardware ecosystem',
        'Automated reporting, PDF invoice generation, and audit trails',
        'Full ownership of source code and intellectual property'
      ]
    }
  }
];

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);

  const openServiceModal = (service) => {
    setSelectedService(service);
  };

  const closeServiceModal = () => {
    setSelectedService(null);
  };

  const getWhatsAppLink = (serviceTitle) => {
    const message = encodeURIComponent(
      `Hello Egreen Technology team, I am interested in your service: "${serviceTitle}". Please share more information and pricing details.`
    );
    return `https://wa.me/917942625065?text=${message}`;
  };

  return (
    <div className="services-page-wrapper">
      {/* 1. HERO BANNER */}
      <section className="services-hero-section">
        <div className="services-container">
          <div className="services-hero-content">
            <span className="services-badge-pill">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              Enterprise Hardware & Digital Solutions
            </span>
            <h1 className="services-hero-title">
              Professional <span className="text-primary-gradient">IT Services</span> &amp; Custom Software Solutions
            </h1>
            <p className="services-hero-desc">
              From enterprise server deployment and VDI virtualization to full-stack web and app development, 
              Egreen Technology delivers end-to-end technology infrastructure tailored for modern businesses.
            </p>
            <div className="services-hero-actions">
              <a href="#it-services" className="btn btn-primary btn-lg">
                Explore IT Services
              </a>
              <a href="#software-dev" className="btn btn-outline btn-lg">
                Software Development
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. IT SERVICES SECTION */}
      <section id="it-services" className="services-section bg-light">
        <div className="services-container">
          <div className="section-header center">
            <span className="section-subtitle">Infrastructure &amp; Networking</span>
            <h2 className="section-title">IT Services</h2>
            <p className="section-desc">
              Complete hardware infrastructure setup, cloud migration, virtual desktop deployment, and ongoing technical support.
            </p>
          </div>

          <div className="services-cards-grid">
            {itServicesData.map((service, idx) => (
              <div className="service-card" key={service.id}>
                <div className="service-card-header">
                  <div className="service-icon-box">{service.icon}</div>
                  <span className="service-card-badge">{service.badge}</span>
                </div>
                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-desc">{service.description}</p>
                
                <div className="service-items-list">
                  {service.items.map((item, i) => (
                    <div className="service-item-bullet" key={i}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="check-icon">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="service-card-footer">
                  <button 
                    className="btn-learn-more"
                    onClick={() => openServiceModal(service)}
                  >
                    Learn More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SOFTWARE DEVELOPMENT SECTION */}
      <section id="software-dev" className="services-section bg-white">
        <div className="services-container">
          <div className="section-header center">
            <span className="section-subtitle">Custom Digital Solutions</span>
            <h2 className="section-title">Software Development</h2>
            <p className="section-desc">
              Bespoke web applications, high-converting websites, mobile applications, and automated enterprise software systems.
            </p>
          </div>

          <div className="services-cards-grid">
            {softwareDevData.map((service) => (
              <div className="service-card software-card" key={service.id}>
                <div className="service-card-header">
                  <div className="service-icon-box software-icon">{service.icon}</div>
                  <span className="service-card-badge software-badge">{service.badge}</span>
                </div>
                <h3 className="service-card-title">{service.title}</h3>
                <p className="service-card-desc">{service.description}</p>
                
                <div className="service-items-list">
                  {service.items.map((item, i) => (
                    <div className="service-item-bullet" key={i}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="check-icon software-check">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="service-card-footer">
                  <button 
                    className="btn-learn-more software-btn"
                    onClick={() => openServiceModal(service)}
                  >
                    Learn More
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION SECTION */}
      <section className="services-cta-section">
        <div className="services-container">
          <div className="services-cta-box">
            <div className="cta-content">
              <h2>Need a Customized IT or Software Solution?</h2>
              <p>Speak directly with our technical team for custom quotes, architectural guidance, or hardware deployment requirements.</p>
            </div>
            <div className="cta-actions">
              <a 
                href="https://wa.me/917942625065?text=Hello%20Egreen%20Technology,%20I%20would%20like%20to%20discuss%20an%20IT%20Service%20/%20Software%20Development%20project." 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-whatsapp-large"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Chat on WhatsApp
              </a>
              <Link to="/contact" className="btn btn-secondary-white">
                Contact Form
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE LEARN MORE MODAL */}
      {selectedService && (
        <div className="service-modal-overlay" onClick={closeServiceModal}>
          <div className="service-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="service-modal-close" onClick={closeServiceModal} aria-label="Close modal">
              &times;
            </button>
            <div className="service-modal-header">
              <div className="service-icon-box modal-icon">{selectedService.icon}</div>
              <div>
                <span className="service-card-badge">{selectedService.badge}</span>
                <h3 className="modal-title">{selectedService.title}</h3>
              </div>
            </div>
            
            <div className="service-modal-body">
              <p className="modal-overview">{selectedService.modalDetails.overview}</p>
              
              <h4 className="modal-subheading">Core Capabilities</h4>
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

              <h4 className="modal-subheading">Key Benefits &amp; Deliverables</h4>
              <ul className="modal-benefits-list">
                {selectedService.modalDetails.keyBenefits.map((benefit, bIdx) => (
                  <li key={bIdx}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className="service-modal-footer">
              <a 
                href={getWhatsAppLink(selectedService.title)} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary btn-full-width"
              >
                Request Quote for {selectedService.title}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
