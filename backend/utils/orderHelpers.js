// utils/orderHelpers.js

/**
 * Calculate total weight of all items in the order
 * param {Array} items - Order items (each with a quantity and optionally a weight)
 * returns {number} Total weight in kg
 */
export function calculateTotalWeight(items) {
  const DEFAULT_WEIGHT_PER_UNIT = 0.2; // kg
  return items.reduce((total, item) => {
    const unitWeight = item.weight || DEFAULT_WEIGHT_PER_UNIT;
    return total + unitWeight * item.quantity;
  }, 0);
}

/**
 * Calculate estimated delivery date based on max delivery days
 * param {number} maxDays - Maximum number of days for delivery
 * returns {Date} Estimated delivery date
 */
export function calculateEstimatedDate(maxDays) {
  const date = new Date();
  date.setDate(date.getDate() + maxDays);
  return date;
}