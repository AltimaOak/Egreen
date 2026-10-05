import React from 'react';
import LegalPage from '../../components/LegalPage';

const Warranty = () => {
  return (
    <LegalPage title="Warranty &amp; Returns" lastUpdated="05 October 2026">
      <h2>1. Warranty Coverage</h2>
      <p>
        Warranty is provided as per the warranty terms specified for the respective product. Where applicable, up to 3 years Seller Warranty may be provided as mentioned in the quotation, invoice or product description.
      </p>

      <h2>2. Warranty Exclusions</h2>
      <p>
        Warranty will not cover products that are physically damaged, tampered with, misused, improperly installed, modified or repaired by an unauthorized person.
      </p>
      <p>
        No warranty is provided on power supply units or adapters, unless specifically stated in writing.
      </p>

      <h2>3. How to Raise a Warranty Claim</h2>
      <p>
        To raise a warranty claim, contact us at{' '}
        <a href="mailto:egreentechnology24@gmail.com">egreentechnology24@gmail.com</a> or{' '}
        <a href="tel:+919867760106">+91-9867760106</a> with your invoice number, product details, and a description of the issue.
      </p>

      <h2>4. Return of Warranty Items</h2>
      <p>
        Warranty items must be returned with original packaging where possible and with the original invoice. Return shipping arrangements will be communicated when the claim is approved.
      </p>

      <h2>5. Contact</h2>
      <p>
        For warranty questions, contact{' '}
        <a href="mailto:egreentechnology24@gmail.com">egreentechnology24@gmail.com</a>.
      </p>
    </LegalPage>
  );
};

export default Warranty;