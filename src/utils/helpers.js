// Formats numbers into clean KES strings
export const formatKES = (amount) => {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Checks if a date falls in the current Saturday to Friday window
export const isCurrentSatToFriWindow = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();

  // Find last Saturday
  const lastSat = new Date(now);
  const day = now.getDay(); // 0 is Sun, 6 is Sat
  const diffToSat = day === 6 ? 0 : day + 1;
  lastSat.setDate(now.getDate() - diffToSat);
  lastSat.setHours(0, 0, 0, 0);

  // Next Friday end of day
  const nextFri = new Date(lastSat);
  nextFri.setDate(lastSat.getDate() + 6);
  nextFri.setHours(23, 59, 59, 999);

  return date >= lastSat && date <= nextFri;
};

// Sorts debtors dynamically by remaining balance (least to highest)
// Cleared debts move to the bottom
export const sortDebtors = (debtors) => {
  return [...debtors].sort((a, b) => {
    const remA = a.originalAmount - a.paidAmount;
    const remB = b.originalAmount - b.paidAmount;

    // Put cleared debts at the end
    if (remA === 0 && remB !== 0) return 1;
    if (remA !== 0 && remB === 0) return -1;

    // Otherwise sort lowest remaining debt first
    return remA - remB;
  });
};
