export const MOCK_TRANSACTIONS = [
  { date: "2025-02-10", description: "Woolworths", category: "Groceries", amount: -127.45 },
  { date: "2025-02-09", description: "Netflix", category: "Entertainment", amount: -16.99 },
  { date: "2025-02-08", description: "Coles", category: "Groceries", amount: -89.32 },
  { date: "2025-02-07", description: "Salary Deposit", category: "Income", amount: 3200.00 },
  { date: "2025-02-06", description: "Uber Eats", category: "Dining", amount: -42.50 },
  { date: "2025-02-05", description: "Chemist Warehouse", category: "Healthcare", amount: -34.20 },
  { date: "2025-02-04", description: "Shell Petrol", category: "Transport", amount: -68.00 },
  { date: "2025-02-03", description: "JB Hi-Fi", category: "Shopping", amount: -249.00 },
  { date: "2025-02-02", description: "Kmart", category: "Shopping", amount: -56.80 },
  { date: "2025-01-31", description: "Rent Payment", category: "Housing", amount: -1600.00 }
];

export const FUEL_TYPES = [
  { id: "U91", label: "Unleaded 91", short: "U91" },
  { id: "P95", label: "Premium 95", short: "P95" },
  { id: "P98", label: "Premium 98", short: "P98" },
  { id: "E10", label: "Ethanol E10", short: "E10" },
  { id: "DL", label: "Diesel", short: "DSL" },
  { id: "LPG", label: "LPG", short: "LPG" },
];

export const MOCK_FUEL_STATIONS = [
  { id: 1, name: "7-Eleven Crows Nest", address: "12 Falcon St, Crows Nest NSW 2065", brand: "7-Eleven",
    prices: { U91: 1.659, P95: 1.759, P98: 1.859, E10: 1.619, DL: 1.809, LPG: null }, visits: 8 },
  { id: 2, name: "Coles Express Chatswood", address: "445 Victoria Ave, Chatswood NSW 2067", brand: "Coles",
    prices: { U91: 1.679, P95: 1.769, P98: 1.869, E10: 1.639, DL: 1.829, LPG: null }, visits: 5 },
  { id: 3, name: "Shell Neutral Bay", address: "789 Military Rd, Neutral Bay NSW 2089", brand: "Shell",
    prices: { U91: 1.679, P95: 1.769, P98: 1.879, E10: null, DL: 1.839, LPG: 0.979 }, visits: 3 },
  { id: 4, name: "BP Mosman", address: "456 Military Rd, Mosman NSW 2088", brand: "BP",
    prices: { U91: 1.649, P95: 1.749, P98: 1.849, E10: 1.609, DL: 1.819, LPG: null }, visits: 2 },
  { id: 5, name: "Metro Petroleum", address: "34 Pacific Hwy, St Leonards NSW 2065", brand: "Metro",
    prices: { U91: 1.619, P95: 1.719, P98: 1.809, E10: 1.579, DL: 1.779, LPG: 0.929 }, visits: 1 },
];

export const MOCK_GROCERY_ITEMS = [
  { name: "Full Cream Milk 2L", coles: 3.10, woolworths: 3.30, category: "Dairy" },
  { name: "White Bread Loaf 700g", coles: 3.50, woolworths: 3.20, category: "Bakery" },
  { name: "Free Range Eggs 12pk", coles: 6.50, woolworths: 6.00, category: "Dairy" },
  { name: "Bananas per kg", coles: 3.90, woolworths: 4.20, category: "Produce" },
  { name: "Chicken Breast 500g", coles: 8.50, woolworths: 9.00, category: "Meat" },
  { name: "White Rice 1kg", coles: 2.80, woolworths: 2.60, category: "Pantry" },
  { name: "Penne Pasta 500g", coles: 1.90, woolworths: 1.70, category: "Pantry" },
  { name: "Tasty Cheese Block 500g", coles: 6.00, woolworths: 6.50, category: "Dairy" },
  { name: "Tomatoes per kg", coles: 5.50, woolworths: 5.00, category: "Produce" },
  { name: "Greek Yoghurt 1kg", coles: 5.80, woolworths: 5.50, category: "Dairy" },
  { name: "Instant Coffee 200g", coles: 10.00, woolworths: 9.50, category: "Beverages" },
  { name: "Weet-Bix 750g", coles: 4.80, woolworths: 4.60, category: "Breakfast" },
  { name: "Olive Oil 500ml", coles: 8.50, woolworths: 8.20, category: "Pantry" },
  { name: "Frozen Peas 1kg", coles: 3.50, woolworths: 3.30, category: "Frozen" },
  { name: "Tim Tams 200g", coles: 3.50, woolworths: 3.50, category: "Snacks" },
];

export const getBrandColor = (brand) => {
  const colors = {
    "7-Eleven": "#f05a28",
    "Coles": "#e31937",
    "Shell": "#fbbb21",
    "BP": "#009639",
    "Metro": "#1a73e8",
  };
  return colors[brand] || "#888";
};

export const getCategoryTotals = () => {
  const categories = {};
  MOCK_TRANSACTIONS.forEach(t => {
    if (t.amount < 0) {
      if (!categories[t.category]) {
        categories[t.category] = 0;
      }
      categories[t.category] += Math.abs(t.amount);
    }
  });
  return categories;
};

export const getMostVisitedStation = () => {
  return MOCK_FUEL_STATIONS.reduce((max, station) => 
    station.visits > max.visits ? station : max
  , MOCK_FUEL_STATIONS[0]);
};
