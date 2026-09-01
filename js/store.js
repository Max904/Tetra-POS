import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import {
  SAMPLE_STAFF,
  SAMPLE_CATEGORIES,
  SAMPLE_MENU,
  SAMPLE_TABLES,
  SAMPLE_ORDERS,
} from "./data.js";

const LOW_STOCK = 5;

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
    nextTableId: load("tetra.nextTableId", 100),
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
    /* storage unavailable */
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
        currentStaff:
          state.currentStaff === action.name ? state.staff.find((s) => s !== action.name) : state.currentStaff,
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
            stock: action.stock,
          },
        ],
        nextMenuId: state.nextMenuId + 1,
      };
    case "UPDATE_ITEM":
      return {
        ...state,
        menu: state.menu.map((i) =>
          i.id === action.id ? { ...i, name: action.name, category: action.category, price: action.price, stock: action.stock } : i
        ),
      };
    case "DELETE_ITEM":
      return { ...state, menu: state.menu.filter((i) => i.id !== action.id) };

    case "ADD_TABLE":
      return {
        ...state,
        tables: [...state.tables, { id: `t${state.nextTableId}`, name: action.name, zone: action.zone, capacity: action.capacity }],
        nextTableId: state.nextTableId + 1,
      };
    case "RENAME_TABLE":
      return { ...state, tables: state.tables.map((t) => (t.id === action.id ? { ...t, name: action.name } : t)) };
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
            paid: false,
          },
        ],
        activeOrderId: `o${state.nextOrderId}`,
        nextOrderId: state.nextOrderId + 1,
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
          const items = existing
            ? o.items.map((it) =>
                it.menuId === action.menuId ? { ...it, qty: it.qty + 1 } : it
              )
            : [...o.items, { menuId: action.menuId, name: action.name, price: action.price, qty: 1, note: "" }];
          return { ...o, items };
        }),
        menu: state.menu.map((m) =>
          m.id === action.menuId ? { ...m, stock: Math.max(0, m.stock - 1) } : m
        ),
      };
    case "SET_QTY":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.orderId
            ? {
                ...o,
                items: o.items
                  .map((it, idx) => (idx === action.index ? { ...it, qty: action.qty } : it))
                  .filter((it) => it.qty > 0),
              }
            : o
        ),
      };
    case "SET_NOTE":
      return {
        ...state,
        orders: state.orders.map((o) =>
          o.id === action.orderId
            ? { ...o, items: o.items.map((it, idx) => (idx === action.index ? { ...it, note: action.note } : it)) }
            : o
        ),
      };

    case "SEND_TO_KITCHEN":
      return { ...state, orders: state.orders.map((o) => (o.id === action.orderId && o.items.length ? { ...o, status: "sent" } : o)) };
    case "SET_KITCHEN":
      return { ...state, orders: state.orders.map((o) => (o.id === action.orderId ? { ...o, status: action.status } : o)) };
    case "REQUEST_BILL":
      return { ...state, orders: state.orders.map((o) => (o.id === action.orderId ? { ...o, billRequested: true } : o)) };
    case "PAY":
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.orderId ? { ...o, paid: true, status: "paid" } : o)),
        activeOrderId: state.activeOrderId === action.orderId ? null : state.activeOrderId,
      };
    case "DISMISS_ORDER":
      return {
        ...state,
        orders: state.orders.filter((o) => o.id !== action.orderId),
        activeOrderId: state.activeOrderId === action.orderId ? null : state.activeOrderId,
      };

    default:
      return state;
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  useEffect(() => persist(state), [state]);
  const api = useMemo(() => ({ state, dispatch }), [state]);
  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}

export function useOrdersByTable(state) {
  const activeByTable = {};
  for (const o of state.orders) {
    if (o.paid) continue;
    if (!activeByTable[o.tableId] || activeByTable[o.tableId].createdAt < o.createdAt) {
      activeByTable[o.tableId] = o;
    }
  }
  return activeByTable;
}

export function useKitchenOrders(state) {
  return state.orders.filter((o) => !o.paid && o.status !== "new" && o.status !== "paid");
}

export { LOW_STOCK };