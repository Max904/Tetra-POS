export const SAMPLE_STAFF = ["Alex", "Jordan", "Sam", "Casey"];

export const SAMPLE_CATEGORIES = ["Starters", "Mains", "Drinks", "Desserts"];

export const SAMPLE_MENU = [
  { id: "m1", name: "Garlic Bread", category: "Starters", price: 4.5, stock: 12, station: "kitchen" },
  { id: "m2", name: "Bruschetta", category: "Starters", price: 6.0, stock: 9, station: "kitchen" },
  { id: "m3", name: "Calamari", category: "Starters", price: 8.0, stock: 11, station: "kitchen" },
  { id: "m4", name: "Wings", category: "Starters", price: 7.0, stock: 4, station: "kitchen" },
  { id: "m5", name: "Margherita Pizza", category: "Mains", price: 12.0, stock: 0, station: "kitchen" },
  { id: "m6", name: "Pepperoni Pizza", category: "Mains", price: 14.0, stock: 10, station: "kitchen" },
  { id: "m7", name: "Ribeye Steak", category: "Mains", price: 23.0, stock: 6, station: "kitchen" },
  { id: "m8", name: "Grilled Salmon", category: "Mains", price: 19.0, stock: 8, station: "kitchen" },
  { id: "m9", name: "Spaghetti Bolognese", category: "Mains", price: 13.0, stock: 15, station: "kitchen" },
  { id: "m10", name: "Caesar Salad", category: "Mains", price: 9.0, stock: 13, station: "kitchen" },
  { id: "m11", name: "House Red Wine", category: "Drinks", price: 6.0, stock: 20, station: "bar" },
  { id: "m12", name: "Craft Beer", category: "Drinks", price: 5.5, stock: 3, station: "bar" },
  { id: "m13", name: "Iced Tea", category: "Drinks", price: 3.0, stock: 22, station: "bar" },
  { id: "m14", name: "Sparkling Water", category: "Drinks", price: 2.5, stock: 30, station: "bar" },
  { id: "m15", name: "Lemonade", category: "Drinks", price: 3.5, stock: 18, station: "bar" },
  { id: "m16", name: "Tiramisu", category: "Desserts", price: 6.5, stock: 0, station: "kitchen" },
  { id: "m17", name: "Cheesecake", category: "Desserts", price: 5.5, stock: 7, station: "kitchen" },
  { id: "m18", name: "Chocolate Brownie", category: "Desserts", price: 5.0, stock: 10, station: "kitchen" },
];

export const SAMPLE_TABLES = [
  { id: "t1", name: "Table 1", zone: "Main", capacity: 4 },
  { id: "t2", name: "Table 2", zone: "Main", capacity: 2 },
  { id: "t3", name: "Table 3", zone: "Main", capacity: 6 },
  { id: "t4", name: "Table 4", zone: "Main", capacity: 4 },
  { id: "t5", name: "Patio 1", zone: "Patio", capacity: 4 },
  { id: "t6", name: "Patio 2", zone: "Patio", capacity: 2 },
];

export const SAMPLE_ORDERS = [
  {
    id: "o1",
    tableId: "t1",
    staff: "Alex",
    items: [
      { menuId: "m2", name: "Bruschetta", price: 6.0, qty: 1, note: "" },
      { menuId: "m6", name: "Pepperoni Pizza", price: 14.0, qty: 2, note: "Extra cheese" },
    ],
    createdAt: Date.now() - 18 * 60 * 1000,
    status: "preparing",
    billRequested: false,
    paid: false,
  },
  {
    id: "o2",
    tableId: "t3",
    staff: "Jordan",
    items: [
      { menuId: "m8", name: "Grilled Salmon", price: 19.0, qty: 1, note: "No sauce" },
      { menuId: "m12", name: "Craft Beer", price: 5.5, qty: 1, note: "" },
    ],
    createdAt: Date.now() - 5 * 60 * 1000,
    status: "sent",
    billRequested: false,
    paid: false,
  },
];

export const TAX_RATE = 0.085;
