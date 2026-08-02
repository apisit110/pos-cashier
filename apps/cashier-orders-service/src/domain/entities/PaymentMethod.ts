// CREDIT_CARD/QR are not supported yet — no payment-gateway integration exists,
// so those would insert a payment that never leaves PENDING. Only accept CASH.
export type PaymentMethod = 'CASH';
