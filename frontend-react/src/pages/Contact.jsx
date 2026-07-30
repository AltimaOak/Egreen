import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import FadeUp from '../components/FadeUp';
import { pageService } from '../services/pageService';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const [productInterest, setProductInterest] = useState('');
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState(null);

  useEffect(() => {
    const loadContact = async () => {
      try {
        setLoading(true);
        const data = await pageService.getContact();
        setContactData(data);
      } catch (err) {
        console.error('Error fetching contact details', err);
      } finally {
        setLoading(false);
      }
    };
    loadContact();
  }, []);

  useEffect(() => {
    const productParam = searchParams.get('product');
    if (productParam) {
      setProductInterest('Quote for: ' + productParam);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your request. Our team will contact you shortly.');
  };

  if (loading || !contactData) {
    return (
      <div style={{ padding: '120px 24px', textAlign: 'center' }}>
        <h2>Loading contact info...</h2>
      </div>
    );
  }

  const cleanWhatsapp = contactData.whatsapp ? contactData.whatsapp.replace(/[+\-\s]/g, '') : '917942625065';

  return (
    <>
      <div className="page-header" style={{ paddingBottom: '2rem' }}>
        <FadeUp className="container visible">
          <h1 className="h1">Contact Us</h1>
          <p style={{ fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>We're here to help you with quotes, bulk orders, and enterprise support.</p>
        </FadeUp>
      </div>

      <div className="container contact-layout">
        <FadeUp>
          <h2 className="h2">Get In Touch</h2>
          <p style={{ marginBottom: '2rem' }}>Reach out to our dedicated support and sales team for immediate assistance.</p>
          
          <div className="contact-info-item">
            <svg className="contact-info-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <div>
              <h4>Office Address</h4>
              <p style={{ whiteSpace: 'pre-line' }}>{contactData.address}</p>
            </div>
          </div>

          <div className="contact-info-item">
            <svg className="contact-info-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <div>
              <h4>Phone & WhatsApp</h4>
              <p>Contact: <a href={`tel:${contactData.phone}`} style={{ color: 'inherit', textDecoration: 'none' }}>{contactData.phone}</a></p>
              <a href={`https://wa.me/${cleanWhatsapp}`} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ marginTop: '12px', borderColor: '#25D366', color: '#25D366' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="contact-info-item">
            <svg className="contact-info-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            <div>
              <h4>Email</h4>
              <p><a href={`mailto:${contactData.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{contactData.email}</a></p>
            </div>
          </div>
          
          <div className="contact-info-item">
            <svg className="contact-info-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <div>
              <h4>Business Hours</h4>
              <p style={{ whiteSpace: 'pre-line' }}>{contactData.workingHours}</p>
            </div>
          </div>
        </FadeUp>

        <FadeUp>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group full" style={{ marginBottom: '8px' }}>
              <h3 className="h3">Request a Quote</h3>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" name="fullName" className="form-control" placeholder="Enter name" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="companyName">Company Name</label>
              <input type="text" id="companyName" name="companyName" className="form-control" placeholder="Enter Company Name" />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
              <input type="tel" id="phoneNumber" name="phoneNumber" className="form-control" placeholder="Enter Phone Number" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="emailAddress">Email Address</label>
              <input type="email" id="emailAddress" name="emailAddress" className="form-control" placeholder="Enter Email Address" required />
            </div>
            <div className="form-group full">
              <label className="form-label" htmlFor="product-interest">Product Interest</label>
              <input type="text" id="product-interest" name="productInterest" className="form-control" placeholder="Enter Product Name" value={productInterest} onChange={(e) => setProductInterest(e.target.value)} />
            </div>
            <div className="form-group full">
              <label className="form-label" htmlFor="message">Message</label>
              <textarea id="message" name="message" className="form-control" placeholder="Please describe your requirements..." required></textarea>
            </div>
            <div className="form-group full">
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Request</button>
            </div>
          </form>
        </FadeUp>
      </div>
      
      <FadeUp className="container">
        <div style={{ width: '100%', height: '450px', borderRadius: '8px', overflow: 'hidden', marginTop: '2rem', marginBottom: '2rem' }}>
          {contactData.googleMapsLink ? (
            <iframe 
              src={contactData.googleMapsLink}
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade" 
              title="Google Maps"
            ></iframe>
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Map Pending
            </div>
          )}
        </div>
      </FadeUp>
    </>
  );
};

export default Contact;
