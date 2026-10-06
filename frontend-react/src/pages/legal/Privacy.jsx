import React from 'react';
import LegalPage from '../../components/LegalPage';

const Privacy = () => {
  return (
    <LegalPage title="Privacy Policy" lastUpdated="05 October 2026">
      <p>
        This Privacy Policy describes how Egreen Technology ("we", "us") collects, uses, and protects information when you use our website.
      </p>

      <h2>1. Information We Collect</h2>
      <p>When you create an account, we collect:</p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Password (stored only as a one-way bcrypt hash — never in plaintext)</li>
        <li>Optional: phone number, company name, and address</li>
      </ul>
      <p>When you place an order or add items to a cart, we store:</p>
      <ul>
        <li>The products and quantities in your cart or order</li>
        <li>Order total, order status, and any notes you provide</li>
        <li>Order date and timestamp</li>
      </ul>
      <p>When you submit an enquiry through our contact form, we store:</p>
      <ul>
        <li>Name, email address, phone number, company name</li>
        <li>The product you are enquiring about (if provided)</li>
        <li>Your message</li>
        <li>IP address and browser user-agent (collected automatically by our server logging and rate-limiting systems)</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <ul>
        <li>To create and maintain your account</li>
        <li>To process and fulfil orders and enquiries</li>
        <li>To communicate with you about your order or enquiry</li>
        <li>To protect the site from abuse (rate limiting) and to diagnose technical issues</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h2>3. Cookies and Local Storage</h2>
      <p>
        We do not set cookies on your browser. We use your browser's local storage to keep you signed in and to remember your theme preference. Local storage data stays on your device and is not transmitted automatically with each request.
      </p>

      <h2>4. Third-Party Service Providers</h2>
      <p>We use the following third parties to operate the site:</p>
      <ul>
        <li><strong>Neon</strong> — managed PostgreSQL database where account, order, cart and enquiry data is stored.</li>
        <li><strong>Render</strong> — hosts the backend API. Request logs containing IP address and URL are retained by Render.</li>
        <li><strong>Vercel</strong> — hosts the frontend and runs serverless functions.</li>
        <li><strong>Cloudinary</strong> — stores product images. No customer-uploaded images are stored.</li>
        <li><strong>WhatsApp / Meta</strong> — only when you click an "Order on WhatsApp" or "WhatsApp Enquiry" button, your browser opens WhatsApp with a pre-filled message. No data is transmitted from our servers to Meta.</li>
      </ul>

      <h2>5. Data Retention</h2>
      <p>
        Account, order, cart and enquiry records are retained until you request deletion or until we have no further legal or operational need to keep them. To request deletion, contact us at{' '}
        <a href="mailto:egreentechnology24@gmail.com">egreentechnology24@gmail.com</a>.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You may request access to, correction of, or deletion of your personal data by emailing{' '}
        <a href="mailto:egreentechnology24@gmail.com">egreentechnology24@gmail.com</a>. We will respond within a reasonable period.
      </p>

      <h2>7. Security</h2>
      <p>
        Passwords are hashed with bcrypt. Authentication uses signed JSON Web Tokens with a limited expiry. Admin-only functions are restricted at the API level. No system is perfectly secure; we do not guarantee absolute security.
      </p>

      <h2>8. Children</h2>
      <p>
        Our services are intended for businesses and adults. We do not knowingly collect personal data from children under 18.
      </p>

      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The "Last updated" date at the top of the page reflects the most recent version.
      </p>

      <h2>10. Contact</h2>
      <p>
        For any questions about this Privacy Policy, contact us at{' '}
        <a href="mailto:egreentechnology24@gmail.com">egreentechnology24@gmail.com</a>.
      </p>
    </LegalPage>
  );
};

export default Privacy;