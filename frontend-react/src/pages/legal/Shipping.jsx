import React from 'react';
import LegalPage from '../../components/LegalPage';

const Shipping = () => {
  return (
    <LegalPage title="Shipping Policy" lastUpdated="05 October 2026">
      <h2>1. Delivery Timelines</h2>
      <p>
        Delivery timelines displayed on the website or provided in a quotation are estimates. Actual delivery times may vary depending on product availability, logistics, courier service performance, and other circumstances beyond our control.
      </p>

      <h2>2. Shipping Charges</h2>
      <p>
        Shipping charges, if applicable, will be communicated in your quotation or order confirmation before dispatch.
      </p>

      <h2>3. Delivery Address</h2>
      <p>
        Please ensure the delivery address and contact number provided are accurate. We are not responsible for delays or losses caused by incorrect delivery information.
      </p>

      <h2>4. Damage in Transit</h2>
      <p>
        If your shipment arrives visibly damaged, please refuse delivery if possible and notify us immediately at{' '}
        <a href="mailto:egreentechnology24@gmail.com">egreentechnology24@gmail.com</a> or{' '}
        <a href="tel:+919867760106">+91-9867760106</a>.
      </p>
    </LegalPage>
  );
};

export default Shipping;