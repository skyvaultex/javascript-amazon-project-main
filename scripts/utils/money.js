export function formatCurrency (priceCents) {
  return (Math.round(priceCents) / 100).toFixed(2);
}

export function formatShippingPrice(priceCents) {
  if(priceCents === 0) return 'FREE shipping';

  return `$${(priceCents / 100).toFixed(2)} - shipping`;
}