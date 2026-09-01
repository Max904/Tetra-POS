// js/app.jsx
import { useEffect as useEffect3, useState as useState4 } from "react";
import { createRoot } from "react-dom/client";
import {
  ShoppingCart,
  Printer as Printer2,
  ChefHat as ChefHat3,
  Sun,
  Moon,
  Clock,
  User as User2,
  ChevronDown,
  LayoutDashboard
} from "lucide-react";

// js/store.js
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

// js/data.js
var SAMPLE_STAFF = ["Alex", "Jordan", "Sam", "Casey"];
var SAMPLE_CATEGORIES = ["Starters", "Mains", "Drinks", "Desserts"];
var SAMPLE_MENU = [
  { id: "m1", name: "Garlic Bread", category: "Starters", price: 4.5, stock: 12 },
  { id: "m2", name: "Bruschetta", category: "Starters", price: 6, stock: 9 },
  { id: "m3", name: "Calamari", category: "Starters", price: 8, stock: 11 },
  { id: "m4", name: "Wings", category: "Starters", price: 7, stock: 4 },
  { id: "m5", name: "Margherita Pizza", category: "Mains", price: 12, stock: 0 },
  { id: "m6", name: "Pepperoni Pizza", category: "Mains", price: 14, stock: 10 },
  { id: "m7", name: "Ribeye Steak", category: "Mains", price: 23, stock: 6 },
  { id: "m8", name: "Grilled Salmon", category: "Mains", price: 19, stock: 8 },
  { id: "m9", name: "Spaghetti Bolognese", category: "Mains", price: 13, stock: 15 },
  { id: "m10", name: "Caesar Salad", category: "Mains", price: 9, stock: 13 },
  { id: "m11", name: "House Red Wine", category: "Drinks", price: 6, stock: 20 },
  { id: "m12", name: "Craft Beer", category: "Drinks", price: 5.5, stock: 3 },
  { id: "m13", name: "Iced Tea", category: "Drinks", price: 3, stock: 22 },
  { id: "m14", name: "Sparkling Water", category: "Drinks", price: 2.5, stock: 30 },
  { id: "m15", name: "Lemonade", category: "Drinks", price: 3.5, stock: 18 },
  { id: "m16", name: "Tiramisu", category: "Desserts", price: 6.5, stock: 0 },
  { id: "m17", name: "Cheesecake", category: "Desserts", price: 5.5, stock: 7 },
  { id: "m18", name: "Chocolate Brownie", category: "Desserts", price: 5, stock: 10 }
];
var SAMPLE_TABLES = [
  { id: "t1", name: "Table 1", zone: "Main", capacity: 4 },
  { id: "t2", name: "Table 2", zone: "Main", capacity: 2 },
  { id: "t3", name: "Table 3", zone: "Main", capacity: 6 },
  { id: "t4", name: "Table 4", zone: "Main", capacity: 4 },
  { id: "t5", name: "Patio 1", zone: "Patio", capacity: 4 },
  { id: "t6", name: "Patio 2", zone: "Patio", capacity: 2 }
];
var SAMPLE_ORDERS = [
  {
    id: "o1",
    tableId: "t1",
    staff: "Alex",
    items: [
      { menuId: "m2", name: "Bruschetta", price: 6, qty: 1, note: "" },
      { menuId: "m6", name: "Pepperoni Pizza", price: 14, qty: 2, note: "Extra cheese" }
    ],
    createdAt: Date.now() - 18 * 60 * 1e3,
    status: "preparing",
    billRequested: false,
    paid: false
  },
  {
    id: "o2",
    tableId: "t3",
    staff: "Jordan",
    items: [
      { menuId: "m8", name: "Grilled Salmon", price: 19, qty: 1, note: "No sauce" },
      { menuId: "m12", name: "Craft Beer", price: 5.5, qty: 1, note: "" }
    ],
    createdAt: Date.now() - 5 * 60 * 1e3,
    status: "sent",
    billRequested: false,
    paid: false
  }
];
var TAX_RATE = 0.085;

// js/store.js
import { jsx } from "react/jsx-runtime";
var LOW_STOCK = 5;
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function initialState() {
  return {
    staff: load("tetra.staff", SAMPLE_STAFF),
    categories: load("tetra.categories", SAMPLE_CATEGORIES),
    menu: load("tetra.menu", SAMPLE_MENU),
    tables: load("tetra.tables", SAMPLE_TABLES),
    orders: load("tetra.orders", SAMPLE_ORDERS),
    currentStaff: load("tetra.currentStaff", SAMPLE_STAFF[0]),
    activeOrderId: load("tetra.activeOrderId", null),
    nextMenuId: load("tetra.nextMenuId", 100),
    nextOrderId: load("tetra.nextOrderId", 100),
    nextTableId: load("tetra.nextTableId", 100)
  };
}
function persist(state) {
  try {
    localStorage.setItem("tetra.staff", JSON.stringify(state.staff));
    localStorage.setItem("tetra.categories", JSON.stringify(state.categories));
    localStorage.setItem("tetra.menu", JSON.stringify(state.menu));
    localStorage.setItem("tetra.tables", JSON.stringify(state.tables));
    localStorage.setItem("tetra.orders", JSON.stringify(state.orders));
    localStorage.setItem("tetra.currentStaff", JSON.stringify(state.currentStaff));
    localStorage.setItem("tetra.activeOrderId", JSON.stringify(state.activeOrderId));
    localStorage.setItem("tetra.nextMenuId", JSON.stringify(state.nextMenuId));
    localStorage.setItem("tetra.nextOrderId", JSON.stringify(state.nextOrderId));
    localStorage.setItem("tetra.nextTableId", JSON.stringify(state.nextTableId));
  } catch {
  }
}
function reducer(state, action) {
  switch (action.type) {
    case "SET_STAFF":
      return { ...state, currentStaff: action.name };
    case "ADD_STAFF":
      return { ...state, staff: [...state.staff, action.name] };
    case "REMOVE_STAFF":
      if (state.staff.length <= 1) return state;
      return {
        ...state,
        staff: state.staff.filter((s) => s !== action.name),
        currentStaff: state.currentStaff === action.name ? state.staff.find((s) => s !== action.name) : state.currentStaff
      };
    case "ADD_ITEM":
      return {
        ...state,
        menu: [
          ...state.menu,
          {
            id: `m${state.nextMenuId}`,
            name: action.name,
            category: action.category,
            price: action.price,
            stock: action.stock
          }
        ],
        nextMenuId: state.nextMenuId + 1
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        menu: state.menu.map(
          (i) => i.id === action.id ? { ...i, name: action.name, category: action.category, price: action.price, stock: action.stock } : i
        )
      };
    case "DELETE_ITEM":
      return { ...state, menu: state.menu.filter((i) => i.id !== action.id) };
    case "ADD_TABLE":
      return {
        ...state,
        tables: [...state.tables, { id: `t${state.nextTableId}`, name: action.name, zone: action.zone, capacity: action.capacity }],
        nextTableId: state.nextTableId + 1
      };
    case "RENAME_TABLE":
      return { ...state, tables: state.tables.map((t) => t.id === action.id ? { ...t, name: action.name } : t) };
    case "DELETE_TABLE":
      return { ...state, tables: state.tables.filter((t) => t.id !== action.id) };
    case "OPEN_ORDER":
      return {
        ...state,
        orders: [
          ...state.orders,
          {
            id: `o${state.nextOrderId}`,
            tableId: action.tableId,
            staff: state.currentStaff,
            items: [],
            createdAt: Date.now(),
            status: "new",
            billRequested: false,
            paid: false
          }
        ],
        activeOrderId: `o${state.nextOrderId}`,
        nextOrderId: state.nextOrderId + 1
      };
    case "SELECT_ORDER":
      return { ...state, activeOrderId: action.orderId };
    case "SET_ACTIVE_TABLE":
      return { ...state, activeOrderId: null };
    case "ADD_TO_ORDER":
      return {
        ...state,
        orders: state.orders.map((o) => {
          if (o.id !== action.orderId) return o;
          const existing = o.items.find((it) => it.menuId === action.menuId);
          const items = existing ? o.items.map(
            (it) => it.menuId === action.menuId ? { ...it, qty: it.qty + 1 } : it
          ) : [...o.items, { menuId: action.menuId, name: action.name, price: action.price, qty: 1, note: "" }];
          return { ...o, items };
        }),
        menu: state.menu.map(
          (m) => m.id === action.menuId ? { ...m, stock: Math.max(0, m.stock - 1) } : m
        )
      };
    case "SET_QTY":
      return {
        ...state,
        orders: state.orders.map(
          (o) => o.id === action.orderId ? {
            ...o,
            items: o.items.map((it, idx) => idx === action.index ? { ...it, qty: action.qty } : it).filter((it) => it.qty > 0)
          } : o
        )
      };
    case "SET_NOTE":
      return {
        ...state,
        orders: state.orders.map(
          (o) => o.id === action.orderId ? { ...o, items: o.items.map((it, idx) => idx === action.index ? { ...it, note: action.note } : it) } : o
        )
      };
    case "SEND_TO_KITCHEN":
      return { ...state, orders: state.orders.map((o) => o.id === action.orderId && o.items.length ? { ...o, status: "sent" } : o) };
    case "SET_KITCHEN":
      return { ...state, orders: state.orders.map((o) => o.id === action.orderId ? { ...o, status: action.status } : o) };
    case "REQUEST_BILL":
      return { ...state, orders: state.orders.map((o) => o.id === action.orderId ? { ...o, billRequested: true } : o) };
    case "PAY":
      return {
        ...state,
        orders: state.orders.map((o) => o.id === action.orderId ? { ...o, paid: true, status: "paid" } : o),
        activeOrderId: state.activeOrderId === action.orderId ? null : state.activeOrderId
      };
    case "DISMISS_ORDER":
      return {
        ...state,
        orders: state.orders.filter((o) => o.id !== action.orderId),
        activeOrderId: state.activeOrderId === action.orderId ? null : state.activeOrderId
      };
    default:
      return state;
  }
}
var StoreContext = createContext(null);
function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, void 0, initialState);
  useEffect(() => persist(state), [state]);
  const api = useMemo(() => ({ state, dispatch }), [state]);
  return /* @__PURE__ */ jsx(StoreContext.Provider, { value: api, children });
}
function useStore() {
  return useContext(StoreContext);
}
function useOrdersByTable(state) {
  const activeByTable = {};
  for (const o of state.orders) {
    if (o.paid) continue;
    if (!activeByTable[o.tableId] || activeByTable[o.tableId].createdAt < o.createdAt) {
      activeByTable[o.tableId] = o;
    }
  }
  return activeByTable;
}
function useKitchenOrders(state) {
  return state.orders.filter((o) => !o.paid && o.status !== "new" && o.status !== "paid");
}

// js/views/floorplan.jsx
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
function tableStatus(order) {
  if (!order || order.paid) return "available";
  if (order.billRequested || order.status === "served") return "bill";
  return "occupied";
}
function statusString(order) {
  if (!order || order.paid) return "Available";
  if (order.status === "new") return "Open order";
  if (order.billRequested || order.status === "served") return "Pending bill";
  return `${cap(order.staff)} \xB7 ${order.items.length} items`;
}
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function FloorPlanView({ setView }) {
  const { state, dispatch } = useStore();
  const ordersByTable = useOrdersByTable(state);
  const zones = [...new Set(state.tables.map((t) => t.zone))];
  const handleTable = (table) => {
    const existing = ordersByTable[table.id];
    if (existing) {
      dispatch({ type: "SELECT_ORDER", orderId: existing.id });
    } else {
      dispatch({ type: "OPEN_ORDER", tableId: table.id });
    }
    setView("register");
  };
  return /* @__PURE__ */ jsxs("div", { className: "floorplan", children: [
    /* @__PURE__ */ jsxs("div", { className: "view-head", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx2("h1", { children: "Floor Plan" }),
        /* @__PURE__ */ jsx2("p", { className: "hint", children: "Tap a table to open or join its order." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "legend", children: [
        /* @__PURE__ */ jsxs("span", { className: "lg", children: [
          /* @__PURE__ */ jsx2("i", { className: "dot avail" }),
          "Available"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "lg", children: [
          /* @__PURE__ */ jsx2("i", { className: "dot occ" }),
          "Occupied"
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "lg", children: [
          /* @__PURE__ */ jsx2("i", { className: "dot bill" }),
          "Bill"
        ] })
      ] })
    ] }),
    zones.map((zone) => /* @__PURE__ */ jsxs("section", { className: "zone", children: [
      /* @__PURE__ */ jsx2("h2", { className: "zone-title", children: zone }),
      /* @__PURE__ */ jsx2("div", { className: "table-grid", children: state.tables.filter((t) => t.zone === zone).map((table) => {
        const order = ordersByTable[table.id];
        const status = tableStatus(order);
        return /* @__PURE__ */ jsxs("button", { className: `table-card ${status}`, onClick: () => handleTable(table), children: [
          /* @__PURE__ */ jsx2("span", { className: "table-shape", children: Array.from({ length: table.capacity }).map((_, i) => /* @__PURE__ */ jsx2("i", {}, i)) }),
          /* @__PURE__ */ jsx2("span", { className: "table-name", children: table.name }),
          /* @__PURE__ */ jsx2("span", { className: "table-status", children: statusString(order) })
        ] }, table.id);
      }) })
    ] }, zone))
  ] });
}

// js/views/register.jsx
import { useMemo as useMemo2, useState } from "react";
import { Search, Plus, Minus, Trash2, ChefHat, Printer, CreditCard, PackageX, Receipt } from "lucide-react";
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function stockLabel(item) {
  if (item.stock === 0) return { text: "Out", cls: "out" };
  if (item.stock <= 5) return { text: "Low", cls: "low" };
  return null;
}
function RegisterView() {
  const { state, dispatch } = useStore();
  const [activeCat, setActiveCat] = useState(state.categories[0]);
  const [query, setQuery] = useState("");
  const order = state.orders.find((o) => o.id === state.activeOrderId && !o.paid);
  const table = state.tables.find((t) => t.id === order?.tableId);
  const items = useMemo2(() => {
    const q = query.trim().toLowerCase();
    return state.menu.filter(
      (m) => m.category === activeCat && (!q || m.name.toLowerCase().includes(q))
    );
  }, [state.menu, activeCat, query]);
  const menuInStock = state.menu.filter((m) => m.category === activeCat && m.stock > 0);
  void menuInStock;
  const subtitle = order ? `${table?.name || "Unassigned"} \xB7 taken by ${order.staff}` : "Select a table from the Floor Plan to start";
  return /* @__PURE__ */ jsxs2("div", { className: "register", children: [
    /* @__PURE__ */ jsx3("div", { className: "view-head", children: /* @__PURE__ */ jsxs2("div", { children: [
      /* @__PURE__ */ jsx3("h1", { children: "Register" }),
      /* @__PURE__ */ jsx3("p", { className: "hint", children: subtitle })
    ] }) }),
    /* @__PURE__ */ jsxs2("div", { className: "register-body", children: [
      /* @__PURE__ */ jsxs2("div", { className: "menu-pane", children: [
        /* @__PURE__ */ jsx3("div", { className: "cat-tabs", children: state.categories.map((c) => /* @__PURE__ */ jsx3(
          "button",
          {
            className: `cat-tab ${activeCat === c ? "active" : ""}`,
            onClick: () => setActiveCat(c),
            children: c
          },
          c
        )) }),
        /* @__PURE__ */ jsxs2("div", { className: "search", children: [
          /* @__PURE__ */ jsx3(Search, { size: 16 }),
          /* @__PURE__ */ jsx3(
            "input",
            {
              placeholder: "Search items\u2026 e.g. pizza",
              value: query,
              onChange: (e) => setQuery(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "menu-grid", children: [
          items.map((m) => {
            const stock = stockLabel(m);
            return /* @__PURE__ */ jsxs2(
              "button",
              {
                className: `menu-item ${stock?.cls || ""}`,
                disabled: !order || m.stock <= 0,
                onClick: () => {
                  if (order && m.stock > 0) {
                    dispatch({ type: "ADD_TO_ORDER", orderId: order.id, menuId: m.id, name: m.name, price: m.price });
                  }
                },
                children: [
                  /* @__PURE__ */ jsx3("span", { className: "mi-name", children: m.name }),
                  /* @__PURE__ */ jsxs2("span", { className: "mi-price", children: [
                    "$",
                    m.price.toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsx3("span", { className: "mi-stock", children: m.stock <= 0 ? /* @__PURE__ */ jsxs2(Fragment, { children: [
                    /* @__PURE__ */ jsx3(PackageX, { size: 13 }),
                    " Out of stock"
                  ] }) : stock ? /* @__PURE__ */ jsxs2(Fragment, { children: [
                    stock.text,
                    " (",
                    m.stock,
                    ")"
                  ] }) : `${m.stock} in stock` })
                ]
              },
              m.id
            );
          }),
          items.length === 0 && /* @__PURE__ */ jsx3("p", { className: "empty", children: "No items in this category." })
        ] })
      ] }),
      /* @__PURE__ */ jsx3(TicketPanel, { order })
    ] })
  ] });
}
function TicketPanel({ order }) {
  const { state, dispatch } = useStore();
  const items = order?.items || [];
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const canSend = items.length > 0 && order && order.status === "new";
  if (!order) {
    return /* @__PURE__ */ jsxs2("aside", { className: "ticket empty", children: [
      /* @__PURE__ */ jsx3(Receipt, { size: 28 }),
      /* @__PURE__ */ jsxs2("p", { children: [
        "No open order.",
        /* @__PURE__ */ jsx3("br", {}),
        "Tap a table to begin."
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs2("aside", { className: "ticket", children: [
    /* @__PURE__ */ jsxs2("div", { className: "ticket-head", children: [
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsxs2("h2", { children: [
          "Table ",
          order.tableId.slice(1)
        ] }),
        /* @__PURE__ */ jsx3("span", { className: "ticket-staff", children: order.staff })
      ] }),
      /* @__PURE__ */ jsx3("span", { className: `kstatus ${order.status}`, children: cap2(order.status) })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "ticket-items", children: [
      items.length === 0 && /* @__PURE__ */ jsx3("p", { className: "empty", children: "Cart is empty \u2014 add items." }),
      items.map((it, idx) => /* @__PURE__ */ jsxs2("div", { className: "ticket-item", children: [
        /* @__PURE__ */ jsxs2("div", { className: "ti-top", children: [
          /* @__PURE__ */ jsxs2("span", { className: "ti-name", children: [
            it.qty,
            "\xD7 ",
            it.name
          ] }),
          /* @__PURE__ */ jsxs2("span", { className: "ti-price", children: [
            "$",
            (it.price * it.qty).toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "ti-controls", children: [
          /* @__PURE__ */ jsxs2("div", { className: "qty", children: [
            /* @__PURE__ */ jsx3("button", { onClick: () => setQty(dispatch, order, idx, it.qty - 1), disabled: it.qty <= 1, children: /* @__PURE__ */ jsx3(Minus, { size: 14 }) }),
            /* @__PURE__ */ jsx3("span", { children: it.qty }),
            /* @__PURE__ */ jsx3("button", { onClick: () => setQty(dispatch, order, idx, it.qty + 1), children: /* @__PURE__ */ jsx3(Plus, { size: 14 }) })
          ] }),
          /* @__PURE__ */ jsx3(
            "input",
            {
              className: "note",
              placeholder: "Add note\u2026",
              value: it.note,
              onChange: (e) => dispatch({ type: "SET_NOTE", orderId: order.id, index: idx, note: e.target.value })
            }
          ),
          /* @__PURE__ */ jsx3("button", { className: "remove", onClick: () => setQty(dispatch, order, idx, 0), children: /* @__PURE__ */ jsx3(Trash2, { size: 15 }) })
        ] })
      ] }, `${it.menuId}-${idx}`))
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "ticket-totals", children: [
      /* @__PURE__ */ jsxs2("div", { className: "tl", children: [
        /* @__PURE__ */ jsx3("span", { children: "Subtotal" }),
        /* @__PURE__ */ jsxs2("span", { children: [
          "$",
          subtotal.toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "tl", children: [
        /* @__PURE__ */ jsxs2("span", { children: [
          "Tax (",
          (TAX_RATE * 100).toFixed(1),
          "%)"
        ] }),
        /* @__PURE__ */ jsxs2("span", { children: [
          "$",
          tax.toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxs2("div", { className: "tl total", children: [
        /* @__PURE__ */ jsx3("span", { children: "Total" }),
        /* @__PURE__ */ jsxs2("span", { children: [
          "$",
          total.toFixed(2)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "ticket-actions", children: [
      /* @__PURE__ */ jsxs2(
        "button",
        {
          className: "btn kitchen",
          disabled: !canSend,
          onClick: () => dispatch({ type: "SEND_TO_KITCHEN", orderId: order.id }),
          children: [
            /* @__PURE__ */ jsx3(ChefHat, { size: 17 }),
            " Send to Kitchen"
          ]
        }
      ),
      /* @__PURE__ */ jsxs2("div", { className: "row", children: [
        /* @__PURE__ */ jsxs2(
          "button",
          {
            className: "btn ghost",
            disabled: items.length === 0,
            onClick: () => dispatch({ type: "REQUEST_BILL", orderId: order.id }),
            children: [
              /* @__PURE__ */ jsx3(Printer, { size: 16 }),
              " Print Bill"
            ]
          }
        ),
        /* @__PURE__ */ jsxs2(
          "button",
          {
            className: "btn pay",
            disabled: items.length === 0,
            onClick: () => dispatch({ type: "PAY", orderId: order.id }),
            children: [
              /* @__PURE__ */ jsx3(CreditCard, { size: 16 }),
              " Pay Now"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function setQty(dispatch, order, index, qty) {
  dispatch({ type: "SET_QTY", orderId: order.id, index, qty: Math.max(0, qty) });
}
function cap2(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// js/views/kds.jsx
import { useEffect as useEffect2, useState as useState2 } from "react";
import { ChefHat as ChefHat2, CookingPot, Check, X, Timer } from "lucide-react";
import { jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
function useNow() {
  const [now, setNow] = useState2(() => Date.now());
  useEffect2(() => {
    const id = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(id);
  }, []);
  return now;
}
function fmt(ms) {
  const s = Math.max(0, Math.floor(ms / 1e3));
  const m = Math.floor(s / 60);
  const r = s % 60;
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}:${String(m % 60).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  return `${m}:${String(r).padStart(2, "0")}`;
}
function KdsView() {
  const { state, dispatch } = useStore();
  const orders = useKitchenOrders(state);
  const now = useNow();
  const tableName = (id) => state.tables.find((t) => t.id === id)?.name || id;
  return /* @__PURE__ */ jsxs3("div", { className: "kds", children: [
    /* @__PURE__ */ jsxs3("div", { className: "view-head", children: [
      /* @__PURE__ */ jsxs3("div", { children: [
        /* @__PURE__ */ jsx4("h1", { children: "Kitchen Display" }),
        /* @__PURE__ */ jsx4("p", { className: "hint", children: "Orders 15+ min are flagged red." })
      ] }),
      /* @__PURE__ */ jsxs3("span", { className: "kds-count", children: [
        orders.length,
        " live ticket",
        orders.length !== 1 ? "s" : ""
      ] })
    ] }),
    orders.length === 0 ? /* @__PURE__ */ jsxs3("div", { className: "kds-empty", children: [
      /* @__PURE__ */ jsx4(ChefHat2, { size: 40 }),
      /* @__PURE__ */ jsx4("p", { children: "All caught up \u2014 no active tickets." })
    ] }) : /* @__PURE__ */ jsx4("div", { className: "kds-grid", children: orders.map((o) => {
      const elapsed = now - o.createdAt;
      const red = elapsed > 15 * 60 * 1e3;
      return /* @__PURE__ */ jsxs3("article", { className: `ticket-card ${o.status} ${red ? "over" : ""}`, children: [
        /* @__PURE__ */ jsxs3("header", { className: "k-head", children: [
          /* @__PURE__ */ jsxs3("div", { children: [
            /* @__PURE__ */ jsx4("h3", { children: tableName(o.tableId) }),
            /* @__PURE__ */ jsx4("span", { className: "k-staff", children: o.staff })
          ] }),
          /* @__PURE__ */ jsxs3("div", { className: `k-timer ${red ? "hot" : ""}`, children: [
            /* @__PURE__ */ jsx4(Timer, { size: 15 }),
            fmt(elapsed)
          ] })
        ] }),
        /* @__PURE__ */ jsx4("ul", { className: "k-items", children: o.items.map((it, i) => /* @__PURE__ */ jsxs3("li", { children: [
          /* @__PURE__ */ jsxs3("span", { className: "k-qty", children: [
            it.qty,
            "\xD7"
          ] }),
          /* @__PURE__ */ jsxs3("span", { className: "k-line", children: [
            it.name,
            it.note && /* @__PURE__ */ jsx4("em", { className: "k-note", children: it.note })
          ] })
        ] }, i)) }),
        /* @__PURE__ */ jsxs3("footer", { className: "k-actions", children: [
          o.status === "sent" && /* @__PURE__ */ jsxs3("button", { className: "ka preparing", onClick: () => dispatch({ type: "SET_KITCHEN", orderId: o.id, status: "preparing" }), children: [
            /* @__PURE__ */ jsx4(CookingPot, { size: 16 }),
            " Preparing"
          ] }),
          o.status === "preparing" && /* @__PURE__ */ jsxs3("button", { className: "ka ready", onClick: () => dispatch({ type: "SET_KITCHEN", orderId: o.id, status: "ready" }), children: [
            /* @__PURE__ */ jsx4(Check, { size: 16 }),
            " Mark Ready"
          ] }),
          o.status === "ready" && /* @__PURE__ */ jsxs3("button", { className: "ka serve", onClick: () => dispatch({ type: "SET_KITCHEN", orderId: o.id, status: "served" }), children: [
            /* @__PURE__ */ jsx4(Check, { size: 16 }),
            " Served"
          ] }),
          /* @__PURE__ */ jsxs3("button", { className: "ka dismiss", onClick: () => dispatch({ type: "DISMISS_ORDER", orderId: o.id }), children: [
            /* @__PURE__ */ jsx4(X, { size: 16 }),
            " Dismiss"
          ] })
        ] })
      ] }, o.id);
    }) })
  ] });
}

// js/views/settings.jsx
import { useState as useState3 } from "react";
import { Plus as Plus2, Trash2 as Trash22, User } from "lucide-react";
import { jsx as jsx5, jsxs as jsxs4 } from "react/jsx-runtime";
function SettingsView() {
  return /* @__PURE__ */ jsxs4("div", { className: "settings", children: [
    /* @__PURE__ */ jsx5("div", { className: "view-head", children: /* @__PURE__ */ jsxs4("div", { children: [
      /* @__PURE__ */ jsx5("h1", { children: "Admin" }),
      /* @__PURE__ */ jsx5("p", { className: "hint", children: "Manage menu, stock, staff and floor plan." })
    ] }) }),
    /* @__PURE__ */ jsxs4("div", { className: "setting-tabs-grid", children: [
      /* @__PURE__ */ jsx5(MenuManager, {}),
      /* @__PURE__ */ jsx5(StaffManager, {}),
      /* @__PURE__ */ jsx5(FloorManager, {}),
      /* @__PURE__ */ jsx5(InventoryPanel, {})
    ] })
  ] });
}
function MenuManager() {
  const { state, dispatch } = useStore();
  const [name, setName] = useState3("");
  const [category, setCategory] = useState3(state.categories[0]);
  const [price, setPrice] = useState3("");
  const [stock, setStock] = useState3("");
  const [editing, setEditing] = useState3(null);
  const submit = () => {
    if (!name.trim()) return;
    const p = Math.max(0, parseFloat(price) || 0);
    const s = Math.max(0, parseInt(stock, 10) || 0);
    if (editing) {
      dispatch({ type: "UPDATE_ITEM", id: editing, name: name.trim(), category, price: p, stock: s });
    } else {
      dispatch({ type: "ADD_ITEM", name: name.trim(), category, price: p, stock: s });
    }
    setEditing(null);
    setName("");
    setPrice("");
    setStock("");
  };
  const startEdit = (item) => {
    setEditing(item.id);
    setName(item.name);
    setCategory(item.category);
    setPrice(String(item.price));
    setStock(String(item.stock));
  };
  return /* @__PURE__ */ jsxs4("section", { className: "panel", children: [
    /* @__PURE__ */ jsx5("h2", { children: "Menu" }),
    /* @__PURE__ */ jsxs4("div", { className: "form", children: [
      /* @__PURE__ */ jsx5("input", { placeholder: "Item name", value: name, onChange: (e) => setName(e.target.value) }),
      /* @__PURE__ */ jsxs4("div", { className: "form-row", children: [
        /* @__PURE__ */ jsx5("select", { value: category, onChange: (e) => setCategory(e.target.value), children: state.categories.map((c) => /* @__PURE__ */ jsx5("option", { children: c }, c)) }),
        /* @__PURE__ */ jsx5("input", { type: "number", min: "0", step: "0.01", placeholder: "Price", value: price, onChange: (e) => setPrice(e.target.value) }),
        /* @__PURE__ */ jsx5("input", { type: "number", min: "0", placeholder: "Stock", value: stock, onChange: (e) => setStock(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxs4("button", { className: "btn primary", onClick: submit, children: [
          /* @__PURE__ */ jsx5(Plus2, { size: 16 }),
          " ",
          editing ? "Update item" : "Add item"
        ] }),
        editing && /* @__PURE__ */ jsx5("button", { className: "btn ghost", onClick: () => {
          setEditing(null);
          setName("");
          setPrice("");
          setStock("");
        }, children: "Cancel" })
      ] })
    ] }),
    /* @__PURE__ */ jsx5("div", { className: "panel-list", children: state.menu.map((m) => /* @__PURE__ */ jsxs4("div", { className: "pl-row", children: [
      /* @__PURE__ */ jsxs4("span", { className: "pl-main", children: [
        /* @__PURE__ */ jsx5("span", { className: "pl-name", children: m.name }),
        /* @__PURE__ */ jsx5("span", { className: "pl-cat", children: m.category })
      ] }),
      /* @__PURE__ */ jsx5("span", { className: "pl-stock", "data-kind": stockBadge(m.stock), children: m.stock <= 0 ? "Out" : m.stock <= LOW_STOCK ? `Low \xB7 ${m.stock}` : `${m.stock} in stock` }),
      /* @__PURE__ */ jsxs4("span", { className: "pl-price", children: [
        "$",
        m.price.toFixed(2)
      ] }),
      /* @__PURE__ */ jsx5("button", { className: "pl-edit", onClick: () => startEdit(m), children: "Edit" }),
      /* @__PURE__ */ jsx5("button", { className: "pl-del", onClick: () => dispatch({ type: "DELETE_ITEM", id: m.id }), children: /* @__PURE__ */ jsx5(Trash22, { size: 15 }) })
    ] }, m.id)) })
  ] });
}
function stockBadge(stock) {
  if (stock <= 0) return "out";
  if (stock <= LOW_STOCK) return "low";
  return "ok";
}
function StaffManager() {
  const { state, dispatch } = useStore();
  const [name, setName] = useState3("");
  const add = () => {
    const n = name.trim();
    if (n && !state.staff.includes(n)) {
      dispatch({ type: "ADD_STAFF", name: n });
      setName("");
    }
  };
  return /* @__PURE__ */ jsxs4("section", { className: "panel", children: [
    /* @__PURE__ */ jsx5("h2", { children: "Staff" }),
    /* @__PURE__ */ jsx5("div", { className: "form", onSubmit: (e) => e.preventDefault(), children: /* @__PURE__ */ jsxs4("div", { className: "form-row", children: [
      /* @__PURE__ */ jsx5("input", { placeholder: "Add waitstaff name", value: name, onChange: (e) => setName(e.target.value), onKeyDown: (e) => e.key === "Enter" && add() }),
      /* @__PURE__ */ jsxs4("button", { className: "btn primary", onClick: add, children: [
        /* @__PURE__ */ jsx5(Plus2, { size: 16 }),
        " Add"
      ] })
    ] }) }),
    /* @__PURE__ */ jsx5("div", { className: "panel-list", children: state.staff.map((s) => /* @__PURE__ */ jsxs4("div", { className: "pl-row", children: [
      /* @__PURE__ */ jsxs4("span", { className: "pl-main", children: [
        /* @__PURE__ */ jsx5(User, { size: 14 }),
        " ",
        /* @__PURE__ */ jsx5("span", { className: "pl-name", children: s })
      ] }),
      /* @__PURE__ */ jsx5("span", { className: "pl-stock ok", children: s === state.currentStaff ? "Active" : "" }),
      /* @__PURE__ */ jsx5("button", { className: "pl-del", onClick: () => dispatch({ type: "REMOVE_STAFF", name: s }), children: /* @__PURE__ */ jsx5(Trash22, { size: 15 }) })
    ] }, s)) })
  ] });
}
function FloorManager() {
  const { state, dispatch } = useStore();
  const [name, setName] = useState3("");
  const [zone, setZone] = useState3("Main");
  const [caps, setCaps] = useState3("4");
  const add = () => {
    const n = name.trim();
    if (n) {
      dispatch({ type: "ADD_TABLE", name: n, zone, capacity: parseInt(caps, 10) || 4 });
      setName("");
    }
  };
  return /* @__PURE__ */ jsxs4("section", { className: "panel", children: [
    /* @__PURE__ */ jsx5("h2", { children: "Floor Plan" }),
    /* @__PURE__ */ jsxs4("div", { className: "form", children: [
      /* @__PURE__ */ jsxs4("div", { className: "form-row", children: [
        /* @__PURE__ */ jsx5("input", { placeholder: "Table name (e.g. Table 7)", value: name, onChange: (e) => setName(e.target.value) }),
        /* @__PURE__ */ jsx5("input", { type: "number", min: "1", value: caps, onChange: (e) => setCaps(e.target.value), title: "Seats" })
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "form-row", children: [
        /* @__PURE__ */ jsx5("select", { value: zone, onChange: (e) => setZone(e.target.value), children: ["Main", "Patio", "Bar", "Window"].map((z) => /* @__PURE__ */ jsx5("option", { children: z }, z)) }),
        /* @__PURE__ */ jsxs4("button", { className: "btn primary", onClick: add, children: [
          /* @__PURE__ */ jsx5(Plus2, { size: 16 }),
          " Add table"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx5("div", { className: "panel-list", children: state.tables.map((t) => /* @__PURE__ */ jsxs4("div", { className: "pl-row", children: [
      /* @__PURE__ */ jsxs4("span", { className: "pl-main", children: [
        /* @__PURE__ */ jsx5(Square, { size: 14 }),
        " ",
        /* @__PURE__ */ jsx5("span", { className: "pl-name", children: t.name })
      ] }),
      /* @__PURE__ */ jsxs4("span", { className: "pl-cat", children: [
        t.zone,
        " \xB7 ",
        t.capacity,
        " seats"
      ] }),
      /* @__PURE__ */ jsx5("button", { className: "pl-edit", onClick: () => {
        const nn = prompt(`Rename ${t.name}:`, t.name);
        if (nn && nn.trim()) dispatch({ type: "RENAME_TABLE", id: t.id, name: nn.trim() });
      }, children: "Rename" }),
      /* @__PURE__ */ jsx5("button", { className: "pl-del", onClick: () => dispatch({ type: "DELETE_TABLE", id: t.id }), children: /* @__PURE__ */ jsx5(Trash22, { size: 15 }) })
    ] }, t.id)) })
  ] });
}
function InventoryPanel() {
  const { state } = useStore();
  return /* @__PURE__ */ jsxs4("section", { className: "panel", children: [
    /* @__PURE__ */ jsx5("h2", { children: "Inventory" }),
    /* @__PURE__ */ jsx5("div", { className: "panel-list", children: state.menu.map((m) => {
      const b = stockBadge(m.stock);
      return /* @__PURE__ */ jsxs4("div", { className: "pl-row", children: [
        /* @__PURE__ */ jsx5("span", { className: "pl-main", children: /* @__PURE__ */ jsx5("span", { className: "pl-name", children: m.name }) }),
        /* @__PURE__ */ jsx5("span", { className: `badge ${b.cls}`, children: b.label }),
        /* @__PURE__ */ jsx5("span", { className: "pl-stock", "data-kind": b.cls, children: m.stock })
      ] }, m.id);
    }) })
  ] });
}

// js/app.jsx
import { jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var VIEWS = [
  { key: "floorplan", name: "Tables", icon: LayoutDashboard },
  { key: "register", name: "Register", icon: ShoppingCart },
  { key: "kds", name: "Kitchen", icon: ChefHat3 },
  { key: "settings", name: "Admin", icon: Printer2 }
];
function useClock() {
  const [now, setNow] = useState4(() => /* @__PURE__ */ new Date());
  useEffect3(() => {
    const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(id);
  }, []);
  return now;
}
function ThemeToggle({ theme, setTheme }) {
  return /* @__PURE__ */ jsx6(
    "button",
    {
      className: "icon-btn",
      onClick: () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
      },
      title: "Toggle theme",
      children: theme === "dark" ? /* @__PURE__ */ jsx6(Sun, { size: 18 }) : /* @__PURE__ */ jsx6(Moon, { size: 18 })
    }
  );
}
function Header({ view, setView, theme, setTheme }) {
  const { state, dispatch } = useStore();
  const now = useClock();
  const ordersByTable = useOrdersByTable(state);
  const activeOrder = state.orders.find((o) => o.id === state.activeOrderId && !o.paid);
  const liveCount = Object.values(ordersByTable).filter((o) => o.items.length && o.status !== "new").length;
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return /* @__PURE__ */ jsxs5("header", { className: "header", children: [
    /* @__PURE__ */ jsxs5("div", { className: "brand", children: [
      /* @__PURE__ */ jsx6("span", { className: "brand-mark", children: "T" }),
      /* @__PURE__ */ jsx6("span", { className: "brand-name", children: "Tetra POS" })
    ] }),
    /* @__PURE__ */ jsx6("nav", { className: "nav", children: VIEWS.map((v) => {
      const Icon = v.icon;
      return /* @__PURE__ */ jsxs5("button", { className: `nav-btn ${view === v.key ? "active" : ""}`, onClick: () => setView(v.key), children: [
        /* @__PURE__ */ jsx6(Icon, { size: 18 }),
        /* @__PURE__ */ jsx6("span", { children: v.name })
      ] }, v.key);
    }) }),
    /* @__PURE__ */ jsxs5("div", { className: "header-right", children: [
      /* @__PURE__ */ jsxs5("div", { className: "status-chip", "data-kind": liveCount ? "live" : "idle", children: [
        /* @__PURE__ */ jsx6("span", { className: "status-dot" }),
        /* @__PURE__ */ jsx6("span", { children: liveCount ? `${liveCount} live` : "Idle" })
      ] }),
      /* @__PURE__ */ jsx6("div", { className: "order-label", children: activeOrder ? activeOrder.status === "new" ? "New order" : `${activeOrder.id.toUpperCase()} \xB7 ${cap3(activeOrder.status)}` : "No active order" }),
      /* @__PURE__ */ jsxs5("label", { className: "staff-switch", children: [
        /* @__PURE__ */ jsx6(User2, { size: 16 }),
        /* @__PURE__ */ jsx6("select", { value: state.currentStaff, onChange: (e) => dispatch({ type: "SET_STAFF", name: e.target.value }), children: state.staff.map((s) => /* @__PURE__ */ jsx6("option", { value: s, children: s }, s)) }),
        /* @__PURE__ */ jsx6(ChevronDown, { size: 14 })
      ] }),
      /* @__PURE__ */ jsxs5("div", { className: "clock-chip", children: [
        /* @__PURE__ */ jsx6(Clock, { size: 15 }),
        /* @__PURE__ */ jsx6("span", { children: timeStr })
      ] }),
      /* @__PURE__ */ jsx6(ThemeToggle, { theme, setTheme })
    ] })
  ] });
}
function cap3(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function Shell() {
  const [view, setView] = useState4("floorplan");
  const [theme, setTheme] = useState4(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );
  return /* @__PURE__ */ jsxs5("div", { className: "app", children: [
    /* @__PURE__ */ jsx6(Header, { view, setView, theme, setTheme }),
    /* @__PURE__ */ jsxs5("main", { className: "main", children: [
      view === "floorplan" && /* @__PURE__ */ jsx6(FloorPlanView, { setView }),
      view === "register" && /* @__PURE__ */ jsx6(RegisterView, {}),
      view === "kds" && /* @__PURE__ */ jsx6(KdsView, {}),
      view === "settings" && /* @__PURE__ */ jsx6(SettingsView, {})
    ] })
  ] });
}
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsx6(StoreProvider, { children: /* @__PURE__ */ jsx6(Shell, {}) })
);
