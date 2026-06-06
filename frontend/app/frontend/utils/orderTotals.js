export const resolveOrderTotals = (order) => {
  const itemsSubtotal = (order?.items || []).reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
  const discount = Number(order?.discount) || 0;
  const total = Number(order?.amount) || 0;
  const subtotal = order?.subtotal ?? itemsSubtotal;
  const tax = order?.tax ?? Math.max(0, total + discount - subtotal);
  return { subtotal, tax, discount, total };
};
