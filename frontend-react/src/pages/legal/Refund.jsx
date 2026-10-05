import React from 'react';
import LegalPage from '../../components/LegalPage';

const Refund = () => {
  return (
    <LegalPage title="Refund &amp; Cancellation Policy" lastUpdated="05 October 2026">
      <h2>1. Cancellation</h2>
      <p>
        Order cancellation requests must be submitted in writing to{' '}
        <a href="mailto:egreentechnology24@gmail.com">egreentechnology24@gmail.com</a> or by phone to{' '}
        <a href="tel:+919867760106">+91-9867760106</a> before dispatch.
      </p>

      <h2>2. Cancellation Charges</h2>
      <p>
        If a Purchase Order (PO) has been issued and advance payment has been made against the PO, and you subsequently cancel the order, 20% of the total order value will be deducted as cancellation charges. The remaining 80% will be refunded to you through the applicable payment method.
      </p>

      <h2>3. Non-Cancellable Items</h2>
      <p>
        Customized, configured, specially procured, or already dispatched products may not be eligible for cancellation. For such products, additional terms may apply depending on the order status and product category.
      </p>

      <h2>4. Refund Processing</h2>
      <p>
        Approved refunds are processed through the original payment method. The exact timeline depends on the payment method and bank. We will confirm the refund amount and expected timeline in writing before processing.
      </p>

      <h2>5. Contact</h2>
      <p>
        For refund or cancellation queries, contact{' '}
        <a href="mailto:egreentechnology24@gmail.com">egreentechnology24@gmail.com</a>.
      </p>
    </LegalPage>
  );
};

export default Refund;