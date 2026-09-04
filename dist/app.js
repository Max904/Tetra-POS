// js/jsxDevShim.js
import { jsx, Fragment } from "react/jsx-runtime";
function jsxDEV(type, props, key) {
  return jsx(type, props, key);
}

// js/app.jsx
import { useEffect as useEffect5, useState as useState6 } from "react";
import { createRoot } from "react-dom/client";
import {
  ShoppingCart,
  Printer as Printer2,
  ChefHat as ChefHat4,
  Beer as Beer3,
  Sun,
  Moon,
  Clock,
  User as User2,
  ChevronDown,
  LayoutDashboard,
  Bell,
  Users
} from "lucide-react";

// js/deviceRole.js
var STORAGE_KEY = "tetra:deviceRole";
var VALID_ROLES = ["waiter", "kitchen", "bar"];
function getDeviceRole() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return VALID_ROLES.includes(stored) ? stored : "waiter";
  } catch {
    return "waiter";
  }
}
function setDeviceRole(role) {
  if (!VALID_ROLES.includes(role)) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, role);
  } catch {
  }
}

// js/notify.js
var audioCtx = null;
function getCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    audioCtx = new Ctx();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}
function tone(ctx, freq, startAt, duration, peak) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(peak, startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(1e-4, startAt + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
}
function playReadyBell() {
  try {
    const ctx = getCtx();
    const now2 = ctx.currentTime;
    tone(ctx, 880, now2, 0.32, 0.2);
    tone(ctx, 659.25, now2 + 0.16, 0.42, 0.2);
  } catch {
  }
}

// js/useReadyAlerts.js
import { useEffect as useEffect6, useRef as useRef2, useState as useState7 } from "react";
function useReadyAlerts(orders, deviceRole) {
  const prevStatusRef = useRef2({});
  const [readyOrders, setReadyOrders] = useState7([]);
  useEffect6(() => {
    const prevStatus = prevStatusRef.current;
    const nextStatus = {};
    let justBecameReady = false;
    for (const order of orders) {
      nextStatus[order.id] = order.status;
      const wasReady = prevStatus[order.id] === "ready";
      if (order.status === "ready" && prevStatus[order.id] && !wasReady) {
        justBecameReady = true;
      }
    }
    prevStatusRef.current = nextStatus;
    if (justBecameReady && deviceRole === "waiter") {
      playReadyBell();
    }
    setReadyOrders(orders.filter((o) => o.status === "ready" && !o.paid));
  }, [orders, deviceRole]);
  return readyOrders;
}

// js/store.js
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

// js/supabaseClient.js
import { createClient } from "@supabase/supabase-js";
var SUPABASE_URL = "https://venfrxrsqutlyxhsblbx.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlbmZyeHJzcXV0bHl4aHNibGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNzY5ODUsImV4cCI6MjEwMzg1Mjk4NX0.6tmXf2Y1-AZdq4o_9QlFmSjEVddY3n7iNmyJ5uAWUeE";
var supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: {
    params: { eventsPerSecond: 10 }
  }
});

// js/store.js
import { jsx as jsx2 } from "react/jsx-runtime";
var LOW_STOCK = 5;
var EMPTY_STATE = {
  staff: [],
  categories: [],
  menu: [],
  tables: [],
  orders: [],
  currentStaff: "",
  activeOrderId: null
};
async function fetchAll() {
  const [
    { data: staffRows, error: e1 },
    { data: menuRows, error: e2 },
    { data: tableRows, error: e3 },
    { data: orderRows, error: e4 },
    { data: orderItemRows, error: e5 },
    { data: appStateRows, error: e6 },
    { data: categoryRows, error: e7 }
  ] = await Promise.all([
    supabase.from("staff").select("*").order("name"),
    supabase.from("menu_items").select("*"),
    supabase.from("tables").select("*"),
    supabase.from("orders").select("*").order("created_at"),
    supabase.from("order_items").select("*"),
    supabase.from("app_state").select("*").eq("id", 1),
    supabase.from("categories").select("*").order("sort_order")
  ]);
  const err = e1 || e2 || e3 || e4 || e5 || e6 || e7;
  if (err) {
    console.error("Supabase fetch error:", err);
    throw err;
  }
  const itemsByOrder = {};
  for (const it of orderItemRows || []) {
    (itemsByOrder[it.order_id] ||= []).push({
      menuId: it.menu_id,
      name: it.name,
      price: Number(it.price),
      qty: it.qty,
      note: it.note || ""
    });
  }
  const stationById = {};
  for (const m of menuRows || []) {
    stationById[m.id] = m.station || "kitchen";
  }
  const STAGE_RANK = { sent: 0, preparing: 1, ready: 2, served: 3 };
  const orders = (orderRows || []).map((o) => {
    const items = itemsByOrder[o.id] || [];
    const kitchenApplies = items.some((it) => (stationById[it.menuId] || "kitchen") === "kitchen");
    const barApplies = items.some((it) => (stationById[it.menuId] || "kitchen") === "bar");
    const kitchenStatus = o.kitchen_status || "sent";
    const barStatus = o.bar_status || "sent";
    let status = o.status;
    if (status !== "new" && status !== "paid") {
      const active = [];
      if (kitchenApplies) active.push(kitchenStatus);
      if (barApplies) active.push(barStatus);
      if (active.length) {
        status = active.reduce((worst, s) => STAGE_RANK[s] < STAGE_RANK[worst] ? s : worst);
      }
    }
    return {
      id: o.id,
      tableId: o.table_id,
      staff: o.staff,
      items,
      createdAt: new Date(o.created_at).getTime(),
      sentAt: o.sent_at ? new Date(o.sent_at).getTime() : null,
      kitchenStatus,
      barStatus,
      kitchenServedAt: o.kitchen_served_at ? new Date(o.kitchen_served_at).getTime() : null,
      barServedAt: o.bar_served_at ? new Date(o.bar_served_at).getTime() : null,
      kitchenDismissed: !!o.kitchen_dismissed,
      barDismissed: !!o.bar_dismissed,
      status,
      billRequested: o.bill_requested,
      paid: o.paid
    };
  });
  const appRow = appStateRows && appStateRows[0] || {};
  const staffNames = (staffRows || []).map((s) => s.name);
  return {
    staff: staffNames,
    categories: (categoryRows || []).map((c) => c.name),
    menu: (menuRows || []).map((m) => ({ ...m, price: Number(m.price) })),
    tables: tableRows || [],
    orders,
    currentStaff: appRow.current_staff || staffNames[0] || "",
    activeOrderId: appRow.active_order_id || null
  };
}
async function runAction(action, state) {
  switch (action.type) {
    case "SET_STAFF":
      await supabase.from("app_state").update({ current_staff: action.name }).eq("id", 1);
      return;
    case "ADD_STAFF":
      await supabase.from("staff").insert({ name: action.name });
      return;
    case "REMOVE_STAFF": {
      if (state.staff.length <= 1) return;
      await supabase.from("staff").delete().eq("name", action.name);
      if (state.currentStaff === action.name) {
        const next = state.staff.find((s) => s !== action.name);
        await supabase.from("app_state").update({ current_staff: next }).eq("id", 1);
      }
      return;
    }
    case "ADD_CATEGORY":
      await supabase.from("categories").insert({
        id: `c${Date.now()}`,
        name: action.name,
        sort_order: state.categories.length
      });
      return;
    case "RENAME_CATEGORY": {
      await supabase.from("categories").update({ name: action.newName }).eq("name", action.oldName);
      await supabase.from("menu_items").update({ category: action.newName }).eq("category", action.oldName);
      return;
    }
    case "DELETE_CATEGORY":
      await supabase.from("categories").delete().eq("name", action.name);
      return;
    case "ADD_ITEM":
      await supabase.from("menu_items").insert({
        id: `m${Date.now()}`,
        name: action.name,
        category: action.category,
        price: action.price,
        stock: action.stock,
        station: action.station || "kitchen"
      });
      return;
    case "UPDATE_ITEM":
      await supabase.from("menu_items").update({
        name: action.name,
        category: action.category,
        price: action.price,
        stock: action.stock,
        station: action.station || "kitchen"
      }).eq("id", action.id);
      return;
    case "DELETE_ITEM":
      await supabase.from("menu_items").delete().eq("id", action.id);
      return;
    case "ADD_TABLE":
      await supabase.from("tables").insert({
        id: `t${Date.now()}`,
        name: action.name,
        zone: action.zone,
        capacity: action.capacity
      });
      return;
    case "RENAME_TABLE":
      await supabase.from("tables").update({ name: action.name }).eq("id", action.id);
      return;
    case "DELETE_TABLE":
      await supabase.from("tables").delete().eq("id", action.id);
      return;
    case "OPEN_ORDER": {
      const id = `o${Date.now()}`;
      await supabase.from("orders").insert({
        id,
        table_id: action.tableId,
        staff: state.currentStaff,
        status: "new",
        bill_requested: false,
        paid: false
      });
      await supabase.from("app_state").update({ active_order_id: id }).eq("id", 1);
      return;
    }
    case "SELECT_ORDER":
      await supabase.from("app_state").update({ active_order_id: action.orderId }).eq("id", 1);
      return;
    case "SET_ACTIVE_TABLE":
      await supabase.from("app_state").update({ active_order_id: null }).eq("id", 1);
      return;
    case "ADD_TO_ORDER": {
      const order = state.orders.find((o) => o.id === action.orderId);
      const existing = order?.items.find((it) => it.menuId === action.menuId);
      if (existing) {
        await supabase.from("order_items").update({ qty: existing.qty + 1 }).eq("order_id", action.orderId).eq("menu_id", action.menuId);
      } else {
        await supabase.from("order_items").insert({
          order_id: action.orderId,
          menu_id: action.menuId,
          name: action.name,
          price: action.price,
          qty: 1,
          note: ""
        });
      }
      const menuItem = state.menu.find((m) => m.id === action.menuId);
      if (menuItem) {
        await supabase.from("menu_items").update({ stock: Math.max(0, menuItem.stock - 1) }).eq("id", action.menuId);
      }
      return;
    }
    case "SET_QTY": {
      const order = state.orders.find((o) => o.id === action.orderId);
      const item = order?.items[action.index];
      if (!item) return;
      if (action.qty <= 0) {
        await supabase.from("order_items").delete().eq("order_id", action.orderId).eq("menu_id", item.menuId);
      } else {
        await supabase.from("order_items").update({ qty: action.qty }).eq("order_id", action.orderId).eq("menu_id", item.menuId);
      }
      return;
    }
    case "SET_NOTE": {
      const order = state.orders.find((o) => o.id === action.orderId);
      const item = order?.items[action.index];
      if (!item) return;
      await supabase.from("order_items").update({ note: action.note }).eq("order_id", action.orderId).eq("menu_id", item.menuId);
      return;
    }
    case "SEND_TO_KITCHEN": {
      const order = state.orders.find((o) => o.id === action.orderId);
      if (order && order.items.length) {
        await supabase.from("orders").update({
          status: "sent",
          sent_at: (/* @__PURE__ */ new Date()).toISOString(),
          kitchen_status: "sent",
          bar_status: "sent",
          kitchen_dismissed: false,
          bar_dismissed: false
        }).eq("id", action.orderId);
      }
      return;
    }
    case "SET_KITCHEN": {
      const station = action.station === "bar" ? "bar" : "kitchen";
      const patch = {};
      if (station === "bar") {
        patch.bar_status = action.status;
        if (action.status === "served") patch.bar_served_at = (/* @__PURE__ */ new Date()).toISOString();
      } else {
        patch.kitchen_status = action.status;
        if (action.status === "served") patch.kitchen_served_at = (/* @__PURE__ */ new Date()).toISOString();
      }
      await supabase.from("orders").update(patch).eq("id", action.orderId);
      return;
    }
    case "REQUEST_BILL":
      await supabase.from("orders").update({ bill_requested: true }).eq("id", action.orderId);
      return;
    case "PAY": {
      await supabase.from("orders").update({ paid: true, status: "paid" }).eq("id", action.orderId);
      if (state.activeOrderId === action.orderId) {
        await supabase.from("app_state").update({ active_order_id: null }).eq("id", 1);
      }
      return;
    }
    case "DISMISS_ORDER": {
      const order = state.orders.find((o) => o.id === action.orderId);
      const station = action.station === "bar" ? "bar" : "kitchen";
      const patch = station === "bar" ? { bar_dismissed: true } : { kitchen_dismissed: true };
      await supabase.from("orders").update(patch).eq("id", action.orderId);
      if (order) {
        const kitchenApplies = order.items.some((it) => stationOf(state, it.menuId) === "kitchen");
        const barApplies = order.items.some((it) => stationOf(state, it.menuId) === "bar");
        const kitchenDone = !kitchenApplies || order.kitchenDismissed || station === "kitchen";
        const barDone = !barApplies || order.barDismissed || station === "bar";
        if (kitchenDone && barDone) {
          await supabase.from("orders").delete().eq("id", action.orderId);
          if (state.activeOrderId === action.orderId) {
            await supabase.from("app_state").update({ active_order_id: null }).eq("id", 1);
          }
        }
      }
      return;
    }
    default:
      return;
  }
}
var StoreContext = createContext(null);
function StoreProvider({ children }) {
  const [state, setState] = useState(EMPTY_STATE);
  const stateRef = useRef(state);
  stateRef.current = state;
  const refreshTimer = useRef(null);
  const refreshNow = useCallback(async () => {
    try {
      const data = await fetchAll();
      setState(data);
    } catch {
    }
  }, []);
  const scheduleRefresh = useCallback(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(refreshNow, 150);
  }, [refreshNow]);
  useEffect(() => {
    refreshNow();
    const channel = supabase.channel("tetra-sync").on("postgres_changes", { event: "*", schema: "public", table: "staff" }, scheduleRefresh).on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, scheduleRefresh).on("postgres_changes", { event: "*", schema: "public", table: "tables" }, scheduleRefresh).on("postgres_changes", { event: "*", schema: "public", table: "orders" }, scheduleRefresh).on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, scheduleRefresh).on("postgres_changes", { event: "*", schema: "public", table: "app_state" }, scheduleRefresh).on("postgres_changes", { event: "*", schema: "public", table: "categories" }, scheduleRefresh).subscribe();
    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      supabase.removeChannel(channel);
    };
  }, [refreshNow, scheduleRefresh]);
  const dispatch = useCallback((action) => {
    runAction(action, stateRef.current).catch((err) => {
      console.error("Supabase write failed:", action.type, err);
    });
  }, []);
  const api = useMemo(() => ({ state, dispatch }), [state]);
  return /* @__PURE__ */ jsx2(StoreContext.Provider, { value: api, children });
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
function stationOf(state, menuId) {
  return state.menu.find((m) => m.id === menuId)?.station || "kitchen";
}
function useKitchenOrders(state) {
  return state.orders.filter((o) => !o.paid && o.status !== "new" && o.status !== "paid" && !o.kitchenDismissed).map((o) => ({
    ...o,
    items: o.items.filter((it) => stationOf(state, it.menuId) === "kitchen")
  })).filter((o) => o.items.length > 0);
}
function useBarOrders(state) {
  return state.orders.filter((o) => !o.paid && o.status !== "new" && o.status !== "paid" && !o.barDismissed).map((o) => ({
    ...o,
    items: o.items.filter((it) => stationOf(state, it.menuId) === "bar")
  })).filter((o) => o.items.length > 0);
}

// js/views/floorplan.jsx
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
  return /* @__PURE__ */ jsxDEV("div", { className: "floorplan", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "view-head", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h1", { children: "Floor Plan" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 39,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "hint", children: "Tap a table to open or join its order." }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 40,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 38,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "legend", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "lg", children: [
          /* @__PURE__ */ jsxDEV("i", { className: "dot avail" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 43,
            columnNumber: 32
          }, this),
          "Available"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 43,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "lg", children: [
          /* @__PURE__ */ jsxDEV("i", { className: "dot occ" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 44,
            columnNumber: 32
          }, this),
          "Occupied"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 44,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "lg", children: [
          /* @__PURE__ */ jsxDEV("i", { className: "dot bill" }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 45,
            columnNumber: 32
          }, this),
          "Bill"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 45,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 42,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 37,
      columnNumber: 7
    }, this),
    zones.map((zone) => /* @__PURE__ */ jsxDEV("section", { className: "zone", children: [
      /* @__PURE__ */ jsxDEV("h2", { className: "zone-title", children: zone }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 51,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "table-grid", children: state.tables.filter((t) => t.zone === zone).map((table) => {
        const order = ordersByTable[table.id];
        const status = tableStatus(order);
        return /* @__PURE__ */ jsxDEV("button", { className: `table-card ${status}`, onClick: () => handleTable(table), children: [
          /* @__PURE__ */ jsxDEV("span", { className: "table-shape", children: Array.from({ length: table.capacity }).map((_, i) => /* @__PURE__ */ jsxDEV("i", {}, i, false, {
            fileName: "<stdin>",
            lineNumber: 62,
            columnNumber: 25
          }, this)) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 60,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "table-name", children: table.name }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 65,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "table-status", children: statusString(order) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 66,
            columnNumber: 21
          }, this)
        ] }, table.id, true, {
          fileName: "<stdin>",
          lineNumber: 59,
          columnNumber: 19
        }, this);
      }) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 52,
        columnNumber: 11
      }, this)
    ] }, zone, true, {
      fileName: "<stdin>",
      lineNumber: 50,
      columnNumber: 9
    }, this))
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 36,
    columnNumber: 5
  }, this);
}

// js/views/register.jsx
import { useEffect as useEffect2, useMemo as useMemo2, useState as useState2 } from "react";
import { Search, Plus, Minus, Trash2, ChefHat, Printer, CreditCard, PackageX, Receipt } from "lucide-react";

// js/data.js
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

// js/views/register.jsx
function stockLabel(item) {
  if (item.stock === 0) return { text: "Out", cls: "out" };
  if (item.stock <= 5) return { text: "Low", cls: "low" };
  return null;
}
function RegisterView() {
  const { state, dispatch } = useStore();
  const [activeCat, setActiveCat] = useState2(state.categories[0]);
  const [query, setQuery] = useState2("");
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
  const canEdit = !!order && order.status === "new";
  const subtitle = order ? `${table?.name || "Unassigned"} \xB7 taken by ${order.staff}` : "Select a table from the Floor Plan to start";
  return /* @__PURE__ */ jsxDEV("div", { className: "register", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "view-head", children: /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("h1", { children: "Register" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 40,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "hint", children: subtitle }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 41,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 39,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 38,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "register-body", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "menu-pane", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "cat-tabs", children: state.categories.map((c) => /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: `cat-tab ${activeCat === c ? "active" : ""}`,
            onClick: () => setActiveCat(c),
            children: c
          },
          c,
          false,
          {
            fileName: "<stdin>",
            lineNumber: 49,
            columnNumber: 15
          },
          this
        )) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 47,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "search", children: [
          /* @__PURE__ */ jsxDEV(Search, { size: 16 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 60,
            columnNumber: 13
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              placeholder: "Search items\u2026 e.g. pizza",
              value: query,
              onChange: (e) => setQuery(e.target.value)
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 61,
              columnNumber: 13
            },
            this
          )
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 59,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "menu-grid", children: [
          items.map((m) => {
            const stock = stockLabel(m);
            return /* @__PURE__ */ jsxDEV(
              "button",
              {
                className: `menu-item ${stock?.cls || ""}`,
                disabled: !order || !canEdit || m.stock <= 0,
                onClick: () => {
                  if (order && canEdit && m.stock > 0) {
                    dispatch({ type: "ADD_TO_ORDER", orderId: order.id, menuId: m.id, name: m.name, price: m.price });
                  }
                },
                children: [
                  /* @__PURE__ */ jsxDEV("span", { className: "mi-name", children: m.name }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 82,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "mi-price", children: [
                    "$",
                    m.price.toFixed(2)
                  ] }, void 0, true, {
                    fileName: "<stdin>",
                    lineNumber: 83,
                    columnNumber: 19
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { className: "mi-stock", children: m.stock <= 0 ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                    /* @__PURE__ */ jsxDEV(PackageX, { size: 13 }, void 0, false, {
                      fileName: "<stdin>",
                      lineNumber: 87,
                      columnNumber: 25
                    }, this),
                    " Out of stock"
                  ] }, void 0, true, {
                    fileName: "<stdin>",
                    lineNumber: 86,
                    columnNumber: 23
                  }, this) : stock ? /* @__PURE__ */ jsxDEV(Fragment, { children: [
                    stock.text,
                    " (",
                    m.stock,
                    ")"
                  ] }, void 0, true, {
                    fileName: "<stdin>",
                    lineNumber: 90,
                    columnNumber: 23
                  }, this) : `${m.stock} in stock` }, void 0, false, {
                    fileName: "<stdin>",
                    lineNumber: 84,
                    columnNumber: 19
                  }, this)
                ]
              },
              m.id,
              true,
              {
                fileName: "<stdin>",
                lineNumber: 72,
                columnNumber: 17
              },
              this
            );
          }),
          items.length === 0 && /* @__PURE__ */ jsxDEV("p", { className: "empty", children: "No items in this category." }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 100,
            columnNumber: 36
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 68,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 46,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(TicketPanel, { order, canEdit }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 104,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 45,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 37,
    columnNumber: 5
  }, this);
}
function TicketPanel({ order, canEdit }) {
  const { state, dispatch } = useStore();
  const items = order?.items || [];
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const canSend = items.length > 0 && order && order.status === "new";
  const [noteDrafts, setNoteDrafts] = useState2({});
  useEffect2(() => {
    setNoteDrafts({});
  }, [order?.id]);
  const noteValue = (idx) => noteDrafts[idx] !== void 0 ? noteDrafts[idx] : items[idx]?.note || "";
  const handleNoteChange = (idx, value) => {
    setNoteDrafts((d) => ({ ...d, [idx]: value }));
  };
  const flushNoteDrafts = () => {
    Object.entries(noteDrafts).forEach(([idxStr, note]) => {
      const idx = Number(idxStr);
      const item = items[idx];
      if (item && note !== item.note) {
        dispatch({ type: "SET_NOTE", orderId: order.id, index: idx, note });
      }
    });
  };
  const handleSendToKitchen = () => {
    flushNoteDrafts();
    dispatch({ type: "SEND_TO_KITCHEN", orderId: order.id });
    setNoteDrafts({});
  };
  const handleNewOrder = () => {
    dispatch({ type: "OPEN_ORDER", tableId: order.tableId });
  };
  if (!order) {
    return /* @__PURE__ */ jsxDEV("aside", { className: "ticket empty", children: [
      /* @__PURE__ */ jsxDEV(Receipt, { size: 28 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 121,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("p", { children: [
        "No open order.",
        /* @__PURE__ */ jsxDEV("br", {}, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 122,
          columnNumber: 26
        }, this),
        "Tap a table to begin."
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 122,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 120,
      columnNumber: 7
    }, this);
  }
  return /* @__PURE__ */ jsxDEV("aside", { className: "ticket", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "ticket-head", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h2", { children: [
          "Table ",
          order.tableId.slice(1)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 131,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "ticket-staff", children: order.staff }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 132,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 130,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: `kstatus ${order.status}`, children: cap2(order.status) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 134,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 129,
      columnNumber: 7
    }, this),
    !canEdit && /* @__PURE__ */ jsxDEV("div", { className: "ticket-locked", children: [
      /* @__PURE__ */ jsxDEV("p", { children: "Ya fue enviado a cocina y no se puede modificar." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 129,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          className: "btn ghost",
          onClick: handleNewOrder,
          children: [
            /* @__PURE__ */ jsxDEV(Plus, { size: 16 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 129,
              columnNumber: 7
            }, this),
            " Nuevo pedido para esta mesa"
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 129,
          columnNumber: 7
        },
        this
      )
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 129,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "ticket-items", children: [
      items.length === 0 && /* @__PURE__ */ jsxDEV("p", { className: "empty", children: "Cart is empty \u2014 add items." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 138,
        columnNumber: 32
      }, this),
      items.map((it, idx) => /* @__PURE__ */ jsxDEV("div", { className: "ticket-item", children: [
        /* @__PURE__ */ jsxDEV("div", { className: "ti-top", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "ti-name", children: [
            it.qty,
            "\xD7 ",
            it.name
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 142,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "ti-price", children: [
            "$",
            (it.price * it.qty).toFixed(2)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 145,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 141,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "ti-controls", children: [
          /* @__PURE__ */ jsxDEV("div", { className: "qty", children: [
            /* @__PURE__ */ jsxDEV("button", { onClick: () => setQty(dispatch, order, idx, it.qty - 1), disabled: it.qty <= 1 || !canEdit, children: /* @__PURE__ */ jsxDEV(Minus, { size: 14 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 150,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 149,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: it.qty }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 152,
              columnNumber: 17
            }, this),
            /* @__PURE__ */ jsxDEV("button", { onClick: () => setQty(dispatch, order, idx, it.qty + 1), disabled: !canEdit, children: /* @__PURE__ */ jsxDEV(Plus, { size: 14 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 154,
              columnNumber: 19
            }, this) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 153,
              columnNumber: 17
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 148,
            columnNumber: 15
          }, this),
          /* @__PURE__ */ jsxDEV(
            "input",
            {
              className: "note",
              placeholder: "Add note\u2026",
              value: noteValue(idx),
              disabled: !canEdit,
              onChange: (e) => handleNoteChange(idx, e.target.value)
            },
            void 0,
            false,
            {
              fileName: "<stdin>",
              lineNumber: 157,
              columnNumber: 15
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("button", { className: "remove", disabled: !canEdit, onClick: () => setQty(dispatch, order, idx, 0), children: /* @__PURE__ */ jsxDEV(Trash2, { size: 15 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 164,
            columnNumber: 17
          }, this) }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 163,
            columnNumber: 15
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 147,
          columnNumber: 13
        }, this)
      ] }, `${it.menuId}-${idx}`, true, {
        fileName: "<stdin>",
        lineNumber: 140,
        columnNumber: 11
      }, this))
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 137,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "ticket-totals", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "tl", children: [
        /* @__PURE__ */ jsxDEV("span", { children: "Subtotal" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 172,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("span", { children: [
          "$",
          subtotal.toFixed(2)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 172,
          columnNumber: 50
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 172,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "tl", children: [
        /* @__PURE__ */ jsxDEV("span", { children: [
          "Tax (",
          (TAX_RATE * 100).toFixed(1),
          "%)"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 173,
          columnNumber: 29
        }, this),
        /* @__PURE__ */ jsxDEV("span", { children: [
          "$",
          tax.toFixed(2)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 173,
          columnNumber: 78
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 173,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "tl total", children: [
        /* @__PURE__ */ jsxDEV("span", { children: "Total" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 174,
          columnNumber: 35
        }, this),
        /* @__PURE__ */ jsxDEV("span", { children: [
          "$",
          total.toFixed(2)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 174,
          columnNumber: 53
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 174,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 171,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "ticket-actions", children: [
      /* @__PURE__ */ jsxDEV(
        "button",
        {
          className: "btn kitchen",
          disabled: !canSend,
          onClick: handleSendToKitchen,
          children: [
            /* @__PURE__ */ jsxDEV(ChefHat, { size: 17 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 183,
              columnNumber: 11
            }, this),
            " Send to Kitchen"
          ]
        },
        void 0,
        true,
        {
          fileName: "<stdin>",
          lineNumber: 178,
          columnNumber: 9
        },
        this
      ),
      /* @__PURE__ */ jsxDEV("div", { className: "row", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: "btn ghost",
            disabled: items.length === 0,
            onClick: () => dispatch({ type: "REQUEST_BILL", orderId: order.id }),
            children: [
              /* @__PURE__ */ jsxDEV(Printer, { size: 16 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 191,
                columnNumber: 13
              }, this),
              " Print Bill"
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 186,
            columnNumber: 11
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            className: "btn pay",
            disabled: items.length === 0,
            onClick: () => dispatch({ type: "PAY", orderId: order.id }),
            children: [
              /* @__PURE__ */ jsxDEV(CreditCard, { size: 16 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 198,
                columnNumber: 13
              }, this),
              " Pay Now"
            ]
          },
          void 0,
          true,
          {
            fileName: "<stdin>",
            lineNumber: 193,
            columnNumber: 11
          },
          this
        )
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 185,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 177,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 128,
    columnNumber: 5
  }, this);
}
function setQty(dispatch, order, index, qty) {
  dispatch({ type: "SET_QTY", orderId: order.id, index, qty: Math.max(0, qty) });
}
function cap2(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// js/views/kds.jsx
import { useEffect as useEffect3, useState as useState3 } from "react";
import { ChefHat as ChefHat2, CookingPot, Check, X, Timer, StickyNote } from "lucide-react";
function useNow() {
  const [now, setNow] = useState3(() => Date.now());
  useEffect3(() => {
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
  return /* @__PURE__ */ jsxDEV("div", { className: "kds", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "view-head", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h1", { children: "Kitchen Display" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 33,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("p", { className: "hint", children: "Orders 15+ min are flagged red." }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 34,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 32,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "kds-count", children: [
        orders.length,
        " live ticket",
        orders.length !== 1 ? "s" : ""
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 36,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 31,
      columnNumber: 7
    }, this),
    orders.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "kds-empty", children: [
      /* @__PURE__ */ jsxDEV(ChefHat2, { size: 40 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 41,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { children: "All caught up \u2014 no active tickets." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 42,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 40,
      columnNumber: 9
    }, this) : /* @__PURE__ */ jsxDEV("div", { className: "kds-grid", children: orders.map((o) => {
      const startedAt = o.sentAt || o.createdAt;
      const endedAt = o.kitchenServedAt || now;
      const elapsed = endedAt - startedAt;
      const red = o.kitchenStatus !== "served" && elapsed > 15 * 60 * 1e3;
      return /* @__PURE__ */ jsxDEV("article", { className: `ticket-card ${o.kitchenStatus} ${red ? "over" : ""}`, children: [
        /* @__PURE__ */ jsxDEV("header", { className: "k-head", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("h3", { children: tableName(o.tableId) }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 53,
              columnNumber: 21
            }, this),
            /* @__PURE__ */ jsxDEV("span", { className: "k-staff", children: o.staff }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 54,
              columnNumber: 21
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 52,
            columnNumber: 19
          }, this),
          /* @__PURE__ */ jsxDEV("div", { className: `k-timer ${red ? "hot" : ""}`, children: [
            /* @__PURE__ */ jsxDEV(Timer, { size: 15 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 57,
              columnNumber: 21
            }, this),
            fmt(elapsed)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 56,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 51,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("ul", { className: "k-items", children: o.items.map((it, i) => /* @__PURE__ */ jsxDEV("li", { children: [
          /* @__PURE__ */ jsxDEV("span", { className: "k-qty", children: [
            it.qty,
            "\xD7"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 65,
            columnNumber: 23
          }, this),
          /* @__PURE__ */ jsxDEV("span", { className: "k-line", children: [
            /* @__PURE__ */ jsxDEV("span", { children: it.name }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 66,
              columnNumber: 23
            }, this),
            it.note && /* @__PURE__ */ jsxDEV("span", { className: "k-note", children: [
              /* @__PURE__ */ jsxDEV(StickyNote, { size: 12 }, void 0, false, {
                fileName: "<stdin>",
                lineNumber: 68,
                columnNumber: 39
              }, this),
              it.note
            ] }, void 0, true, {
              fileName: "<stdin>",
              lineNumber: 68,
              columnNumber: 37
            }, this)
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 66,
            columnNumber: 23
          }, this)
        ] }, i, true, {
          fileName: "<stdin>",
          lineNumber: 64,
          columnNumber: 21
        }, this)) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 62,
          columnNumber: 17
        }, this),
        /* @__PURE__ */ jsxDEV("footer", { className: "k-actions", children: [
          o.kitchenStatus === "sent" && /* @__PURE__ */ jsxDEV("button", { className: "ka preparing", onClick: () => dispatch({ type: "SET_KITCHEN", orderId: o.id, station: "kitchen", status: "preparing" }), children: [
            /* @__PURE__ */ jsxDEV(CookingPot, { size: 16 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 77,
              columnNumber: 23
            }, this),
            " Preparing"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 76,
            columnNumber: 21
          }, this),
          o.kitchenStatus === "preparing" && /* @__PURE__ */ jsxDEV("button", { className: "ka ready", onClick: () => dispatch({ type: "SET_KITCHEN", orderId: o.id, station: "kitchen", status: "ready" }), children: [
            /* @__PURE__ */ jsxDEV(Check, { size: 16 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 82,
              columnNumber: 23
            }, this),
            " Mark Ready"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 81,
            columnNumber: 21
          }, this),
          o.kitchenStatus === "ready" && /* @__PURE__ */ jsxDEV("button", { className: "ka serve", onClick: () => dispatch({ type: "SET_KITCHEN", orderId: o.id, station: "kitchen", status: "served" }), children: [
            /* @__PURE__ */ jsxDEV(Check, { size: 16 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 87,
              columnNumber: 23
            }, this),
            " Served"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 86,
            columnNumber: 21
          }, this),
          /* @__PURE__ */ jsxDEV("button", { className: "ka dismiss", onClick: () => dispatch({ type: "DISMISS_ORDER", orderId: o.id, station: "kitchen" }), children: [
            /* @__PURE__ */ jsxDEV(X, { size: 16 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 91,
              columnNumber: 21
            }, this),
            " Dismiss"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 90,
            columnNumber: 19
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 74,
          columnNumber: 17
        }, this)
      ] }, o.id, true, {
        fileName: "<stdin>",
        lineNumber: 50,
        columnNumber: 15
      }, this);
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 45,
      columnNumber: 9
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 30,
    columnNumber: 5
  }, this);
}

// js/views/bar.jsx
import { useEffect as useEffect4, useState as useState4 } from "react";
import { Beer, CookingPot as CookingPot2, Check as Check2, X as X2, Timer as Timer2, StickyNote as StickyNote2 } from "lucide-react";
function useNow2() {
  const [now, setNow] = useState4(() => Date.now());
  useEffect4(() => {
    const id = setInterval(() => setNow(Date.now()), 1e3);
    return () => clearInterval(id);
  }, []);
  return now;
}
function fmt2(ms) {
  const s = Math.max(0, Math.floor(ms / 1e3));
  const m = Math.floor(s / 60);
  const r = s % 60;
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}:${String(m % 60).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  return `${m}:${String(r).padStart(2, "0")}`;
}
function groupByCategory(items, menu, categories) {
  const catOf = (menuId) => menu.find((m) => m.id === menuId)?.category || "Other";
  const groups = {};
  for (const it of items) {
    const cat = catOf(it.menuId);
    (groups[cat] ||= []).push(it);
  }
  const order = [...categories, "Other"];
  return order.filter((c) => groups[c]).map((cat) => ({ cat, items: groups[cat] }));
}
function BarView() {
  const { state, dispatch } = useStore();
  const orders = useBarOrders(state);
  const now = useNow2();
  const tableName = (id) => state.tables.find((t) => t.id === id)?.name || id;
  return /* @__PURE__ */ jsxDEV("div", { className: "kds", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "view-head", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h1", { children: "Bar" }, void 0, false, {}, this),
        /* @__PURE__ */ jsxDEV("p", { className: "hint", children: "Drink orders 15+ min are flagged red." }, void 0, false, {}, this)
      ] }, void 0, true, {}, this),
      /* @__PURE__ */ jsxDEV("span", { className: "kds-count", children: [
        orders.length,
        " live ticket",
        orders.length !== 1 ? "s" : ""
      ] }, void 0, true, {}, this)
    ] }, void 0, true, {}, this),
    orders.length === 0 ? /* @__PURE__ */ jsxDEV("div", { className: "kds-empty", children: [
      /* @__PURE__ */ jsxDEV(Beer, { size: 40 }, void 0, false, {}, this),
      /* @__PURE__ */ jsxDEV("p", { children: "All caught up \u2014 no active drink tickets." }, void 0, false, {}, this)
    ] }, void 0, true, {}, this) : /* @__PURE__ */ jsxDEV("div", { className: "kds-grid", children: orders.map((o) => {
      const startedAt = o.sentAt || o.createdAt;
      const endedAt = o.barServedAt || now;
      const elapsed = endedAt - startedAt;
      const red = o.barStatus !== "served" && elapsed > 15 * 60 * 1e3;
      return /* @__PURE__ */ jsxDEV("article", { className: `ticket-card ${o.barStatus} ${red ? "over" : ""}`, children: [
        /* @__PURE__ */ jsxDEV("header", { className: "k-head", children: [
          /* @__PURE__ */ jsxDEV("div", { children: [
            /* @__PURE__ */ jsxDEV("h3", { children: tableName(o.tableId) }, void 0, false, {}, this),
            /* @__PURE__ */ jsxDEV("span", { className: "k-staff", children: o.staff }, void 0, false, {}, this)
          ] }, void 0, true, {}, this),
          /* @__PURE__ */ jsxDEV("div", { className: `k-timer ${red ? "hot" : ""}`, children: [
            /* @__PURE__ */ jsxDEV(Timer2, { size: 15 }, void 0, false, {}, this),
            fmt2(elapsed)
          ] }, void 0, true, {}, this)
        ] }, void 0, true, {}, this),
        /* @__PURE__ */ jsxDEV("div", { className: "k-groups", children: groupByCategory(o.items, state.menu, state.categories).map((group) => /* @__PURE__ */ jsxDEV("div", { className: "k-cat-group", children: [
          /* @__PURE__ */ jsxDEV("span", { className: "k-cat-label", children: group.cat }, void 0, false, {}, this),
          /* @__PURE__ */ jsxDEV("ul", { className: "k-items", children: group.items.map((it, i) => /* @__PURE__ */ jsxDEV("li", { children: [
            /* @__PURE__ */ jsxDEV("span", { className: "k-qty", children: [
              it.qty,
              "\xD7"
            ] }, void 0, true, {}, this),
            /* @__PURE__ */ jsxDEV("span", { className: "k-line", children: [
              /* @__PURE__ */ jsxDEV("span", { children: it.name }, void 0, false, {}, this),
              it.note && /* @__PURE__ */ jsxDEV("span", { className: "k-note", children: [
                /* @__PURE__ */ jsxDEV(StickyNote2, { size: 12 }, void 0, false, {}, this),
                it.note
              ] }, void 0, true, {}, this)
            ] }, void 0, true, {}, this)
          ] }, i, true, {}, this)) }, void 0, false, {}, this)
        ] }, group.cat, true, {}, this)) }, void 0, false, {}, this),
        /* @__PURE__ */ jsxDEV("footer", { className: "k-actions", children: [
          o.barStatus === "sent" && /* @__PURE__ */ jsxDEV("button", { className: "ka preparing", onClick: () => dispatch({ type: "SET_KITCHEN", orderId: o.id, station: "bar", status: "preparing" }), children: [
            /* @__PURE__ */ jsxDEV(CookingPot2, { size: 16 }, void 0, false, {}, this),
            " Preparing"
          ] }, void 0, true, {}, this),
          o.barStatus === "preparing" && /* @__PURE__ */ jsxDEV("button", { className: "ka ready", onClick: () => dispatch({ type: "SET_KITCHEN", orderId: o.id, station: "bar", status: "ready" }), children: [
            /* @__PURE__ */ jsxDEV(Check2, { size: 16 }, void 0, false, {}, this),
            " Mark Ready"
          ] }, void 0, true, {}, this),
          o.barStatus === "ready" && /* @__PURE__ */ jsxDEV("button", { className: "ka serve", onClick: () => dispatch({ type: "SET_KITCHEN", orderId: o.id, station: "bar", status: "served" }), children: [
            /* @__PURE__ */ jsxDEV(Check2, { size: 16 }, void 0, false, {}, this),
            " Served"
          ] }, void 0, true, {}, this),
          /* @__PURE__ */ jsxDEV("button", { className: "ka dismiss", onClick: () => dispatch({ type: "DISMISS_ORDER", orderId: o.id, station: "bar" }), children: [
            /* @__PURE__ */ jsxDEV(X2, { size: 16 }, void 0, false, {}, this),
            " Dismiss"
          ] }, void 0, true, {}, this)
        ] }, void 0, true, {}, this)
      ] }, o.id, true, {}, this);
    }) }, void 0, false, {}, this)
  ] }, void 0, true, {}, this);
}

// js/views/settings.jsx
import { useState as useState5 } from "react";
import { Plus as Plus2, Trash2 as Trash22, User, Square, ChefHat as ChefHat3, Beer as Beer2 } from "lucide-react";
function SettingsView() {
  return /* @__PURE__ */ jsxDEV("div", { className: "settings", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "view-head", children: /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("h1", { children: "Admin" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 10,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "hint", children: "Manage menu, stock, staff and floor plan." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 11,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 9,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 8,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "setting-tabs-grid", children: [
      /* @__PURE__ */ jsxDEV(MenuManager, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 15,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(StaffManager, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 16,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FloorManager, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 17,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(InventoryPanel, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 18,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 14,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 7,
    columnNumber: 5
  }, this);
}
function MenuManager() {
  const { state, dispatch } = useStore();
  const [name, setName] = useState5("");
  const [category, setCategory] = useState5(state.categories[0]);
  const [price, setPrice] = useState5("");
  const [stock, setStock] = useState5("");
  const [station, setStation] = useState5("kitchen");
  const [editing, setEditing] = useState5(null);
  const submit = () => {
    if (!name.trim()) return;
    const p = Math.max(0, parseFloat(price) || 0);
    const s = Math.max(0, parseInt(stock, 10) || 0);
    if (editing) {
      dispatch({ type: "UPDATE_ITEM", id: editing, name: name.trim(), category, price: p, stock: s, station });
    } else {
      dispatch({ type: "ADD_ITEM", name: name.trim(), category, price: p, stock: s, station });
    }
    setEditing(null);
    setName("");
    setPrice("");
    setStock("");
    setStation("kitchen");
  };
  const startEdit = (item) => {
    setEditing(item.id);
    setName(item.name);
    setCategory(item.category);
    setPrice(String(item.price));
    setStock(String(item.stock));
    setStation(item.station || "kitchen");
  };
  return /* @__PURE__ */ jsxDEV("section", { className: "panel", children: [
    /* @__PURE__ */ jsxDEV("h2", { children: "Menu" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 57,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "form", children: [
      /* @__PURE__ */ jsxDEV("input", { placeholder: "Item name", value: name, onChange: (e) => setName(e.target.value) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 59,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxDEV("select", { value: category, onChange: (e) => setCategory(e.target.value), children: state.categories.map((c) => /* @__PURE__ */ jsxDEV("option", { children: c }, c, false, {
          fileName: "<stdin>",
          lineNumber: 63,
          columnNumber: 15
        }, this)) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 61,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("input", { type: "number", min: "0", step: "0.01", placeholder: "Price", value: price, onChange: (e) => setPrice(e.target.value) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 66,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("input", { type: "number", min: "0", placeholder: "Stock", value: stock, onChange: (e) => setStock(e.target.value) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 67,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 60,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "station-label", children: "Sends to:" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 68,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "station-toggle", role: "group", "aria-label": "Station", children: [
          /* @__PURE__ */ jsxDEV("button", { type: "button", className: `station-btn ${station === "kitchen" ? "active" : ""}`, onClick: () => setStation("kitchen"), children: [
            /* @__PURE__ */ jsxDEV(ChefHat3, { size: 15 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 68,
              columnNumber: 11
            }, this),
            " Kitchen"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 68,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV("button", { type: "button", className: `station-btn ${station === "bar" ? "active" : ""}`, onClick: () => setStation("bar"), children: [
            /* @__PURE__ */ jsxDEV(Beer2, { size: 15 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 68,
              columnNumber: 11
            }, this),
            " Bar"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 68,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 68,
          columnNumber: 9
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 68,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxDEV("button", { className: "btn primary", onClick: submit, children: [
          /* @__PURE__ */ jsxDEV(Plus2, { size: 16 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 71,
            columnNumber: 13
          }, this),
          " ",
          editing ? "Update item" : "Add item"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 70,
          columnNumber: 11
        }, this),
        editing && /* @__PURE__ */ jsxDEV("button", { className: "btn ghost", onClick: () => {
          setEditing(null);
          setName("");
          setPrice("");
          setStock("");
          setStation("kitchen");
        }, children: "Cancel" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 73,
          columnNumber: 23
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 69,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 58,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "panel-list", children: state.menu.map((m) => /* @__PURE__ */ jsxDEV("div", { className: "pl-row", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "pl-main", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "pl-name", children: m.name }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 81,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "pl-cat", children: m.category }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 82,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: `pl-station ${(m.station || "kitchen") === "bar" ? "bar" : "kitchen"}`, children: [
          (m.station || "kitchen") === "bar" ? /* @__PURE__ */ jsxDEV(Beer2, { size: 12 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 82,
            columnNumber: 15
          }, this) : /* @__PURE__ */ jsxDEV(ChefHat3, { size: 12 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 82,
            columnNumber: 15
          }, this),
          (m.station || "kitchen") === "bar" ? "Bar" : "Kitchen"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 82,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 80,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "pl-stock", "data-kind": stockBadge(m.stock), children: m.stock <= 0 ? "Out" : m.stock <= LOW_STOCK ? `Low \xB7 ${m.stock}` : `${m.stock} in stock` }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 84,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "pl-price", children: [
        "$",
        m.price.toFixed(2)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 87,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "pl-edit", onClick: () => startEdit(m), children: "Edit" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 88,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "pl-del", onClick: () => dispatch({ type: "DELETE_ITEM", id: m.id }), children: /* @__PURE__ */ jsxDEV(Trash22, { size: 15 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 90,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 89,
        columnNumber: 13
      }, this)
    ] }, m.id, true, {
      fileName: "<stdin>",
      lineNumber: 79,
      columnNumber: 11
    }, this)) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 77,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 56,
    columnNumber: 5
  }, this);
}
function stockBadge(stock) {
  if (stock <= 0) return "out";
  if (stock <= LOW_STOCK) return "low";
  return "ok";
}
function stockBadgeInfo(stock) {
  const cls = stockBadge(stock);
  const label = cls === "out" ? "Out of stock" : cls === "low" ? "Low stock" : "In stock";
  return { cls, label };
}
function StaffManager() {
  const { state, dispatch } = useStore();
  const [name, setName] = useState5("");
  const add = () => {
    const n = name.trim();
    if (n && !state.staff.includes(n)) {
      dispatch({ type: "ADD_STAFF", name: n });
      setName("");
    }
  };
  return /* @__PURE__ */ jsxDEV("section", { className: "panel", children: [
    /* @__PURE__ */ jsxDEV("h2", { children: "Staff" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 118,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "form", onSubmit: (e) => e.preventDefault(), children: /* @__PURE__ */ jsxDEV("div", { className: "form-row", children: [
      /* @__PURE__ */ jsxDEV("input", { placeholder: "Add waitstaff name", value: name, onChange: (e) => setName(e.target.value), onKeyDown: (e) => e.key === "Enter" && add() }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 121,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "btn primary", onClick: add, children: [
        /* @__PURE__ */ jsxDEV(Plus2, { size: 16 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 123,
          columnNumber: 13
        }, this),
        " Add"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 122,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 120,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 119,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "panel-list", children: state.staff.map((s) => /* @__PURE__ */ jsxDEV("div", { className: "pl-row", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "pl-main", children: [
        /* @__PURE__ */ jsxDEV(User, { size: 14 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 130,
          columnNumber: 39
        }, this),
        " ",
        /* @__PURE__ */ jsxDEV("span", { className: "pl-name", children: s }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 130,
          columnNumber: 58
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 130,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "pl-stock ok", children: s === state.currentStaff ? "Active" : "" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 131,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "pl-del", onClick: () => dispatch({ type: "REMOVE_STAFF", name: s }), children: /* @__PURE__ */ jsxDEV(Trash22, { size: 15 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 133,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 132,
        columnNumber: 13
      }, this)
    ] }, s, true, {
      fileName: "<stdin>",
      lineNumber: 129,
      columnNumber: 11
    }, this)) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 127,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 117,
    columnNumber: 5
  }, this);
}
function FloorManager() {
  const { state, dispatch } = useStore();
  const [name, setName] = useState5("");
  const [zone, setZone] = useState5("Main");
  const [caps, setCaps] = useState5("4");
  const add = () => {
    const n = name.trim();
    if (n) {
      dispatch({ type: "ADD_TABLE", name: n, zone, capacity: parseInt(caps, 10) || 4 });
      setName("");
    }
  };
  return /* @__PURE__ */ jsxDEV("section", { className: "panel", children: [
    /* @__PURE__ */ jsxDEV("h2", { children: "Floor Plan" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 158,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "form", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxDEV("input", { placeholder: "Table name (e.g. Table 7)", value: name, onChange: (e) => setName(e.target.value) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 161,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("input", { type: "number", min: "1", value: caps, onChange: (e) => setCaps(e.target.value), title: "Seats" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 162,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 160,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxDEV("select", { value: zone, onChange: (e) => setZone(e.target.value), children: ["Main", "Patio", "Bar", "Window"].map((z) => /* @__PURE__ */ jsxDEV("option", { children: z }, z, false, {
          fileName: "<stdin>",
          lineNumber: 167,
          columnNumber: 15
        }, this)) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 165,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: "btn primary", onClick: add, children: [
          /* @__PURE__ */ jsxDEV(Plus2, { size: 16 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 171,
            columnNumber: 13
          }, this),
          " Add table"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 170,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 164,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 159,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "panel-list", children: state.tables.map((t) => /* @__PURE__ */ jsxDEV("div", { className: "pl-row", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "pl-main", children: [
        /* @__PURE__ */ jsxDEV(Square, { size: 14 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 179,
          columnNumber: 39
        }, this),
        " ",
        /* @__PURE__ */ jsxDEV("span", { className: "pl-name", children: t.name }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 179,
          columnNumber: 60
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 179,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "pl-cat", children: [
        t.zone,
        " \xB7 ",
        t.capacity,
        " seats"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 180,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "pl-edit", onClick: () => {
        const nn = prompt(`Rename ${t.name}:`, t.name);
        if (nn && nn.trim()) dispatch({ type: "RENAME_TABLE", id: t.id, name: nn.trim() });
      }, children: "Rename" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 181,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "pl-del", onClick: () => dispatch({ type: "DELETE_TABLE", id: t.id }), children: /* @__PURE__ */ jsxDEV(Trash22, { size: 15 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 185,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 184,
        columnNumber: 13
      }, this)
    ] }, t.id, true, {
      fileName: "<stdin>",
      lineNumber: 178,
      columnNumber: 11
    }, this)) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 176,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 157,
    columnNumber: 5
  }, this);
}
function InventoryPanel() {
  const { state } = useStore();
  return /* @__PURE__ */ jsxDEV("section", { className: "panel", children: [
    /* @__PURE__ */ jsxDEV("h2", { children: "Inventory" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 198,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "panel-list", children: state.menu.map((m) => {
      const b = stockBadgeInfo(m.stock);
      return /* @__PURE__ */ jsxDEV("div", { className: "pl-row", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "pl-main", children: /* @__PURE__ */ jsxDEV("span", { className: "pl-name", children: m.name }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 204,
          columnNumber: 41
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 204,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: `badge ${b.cls}`, children: b.label }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 205,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "pl-stock", "data-kind": b.cls, children: m.stock }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 206,
          columnNumber: 15
        }, this)
      ] }, m.id, true, {
        fileName: "<stdin>",
        lineNumber: 203,
        columnNumber: 13
      }, this);
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 199,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 197,
    columnNumber: 5
  }, this);
}

// js/app.jsx
var VIEWS = [
  { key: "floorplan", name: "Tables", icon: LayoutDashboard },
  { key: "register", name: "Register", icon: ShoppingCart },
  { key: "kds", name: "Kitchen", icon: ChefHat4 },
  { key: "bar", name: "Bar", icon: Beer3 },
  { key: "settings", name: "Admin", icon: Printer2 }
];
function useClock() {
  const [now, setNow] = useState6(() => /* @__PURE__ */ new Date());
  useEffect5(() => {
    const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(id);
  }, []);
  return now;
}
function ThemeToggle({ theme, setTheme }) {
  return /* @__PURE__ */ jsxDEV(
    "button",
    {
      className: "icon-btn",
      onClick: () => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
      },
      title: "Toggle theme",
      children: theme === "dark" ? /* @__PURE__ */ jsxDEV(Sun, { size: 18 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 47,
        columnNumber: 27
      }, this) : /* @__PURE__ */ jsxDEV(Moon, { size: 18 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 47,
        columnNumber: 47
      }, this)
    },
    void 0,
    false,
    {
      fileName: "<stdin>",
      lineNumber: 38,
      columnNumber: 5
    },
    this
  );
}
var ROLE_ICONS = { waiter: Users, kitchen: ChefHat4, bar: Beer3 };
var ROLE_LABELS = { waiter: "Waiter", kitchen: "Kitchen", bar: "Bar" };
function RoleSwitch({ role, onChange }) {
  const RoleIcon = ROLE_ICONS[role] || Users;
  return jsxDEV(
    "label",
    {
      className: "role-switch",
      title: "This device's role \u2014 controls which screen gets the pickup bell",
      children: [
        jsxDEV(RoleIcon, { size: 16 }),
        jsxDEV("select", {
          value: role,
          onChange: (e) => onChange(e.target.value),
          children: Object.keys(ROLE_LABELS).map(
            (r) => jsxDEV("option", { value: r, children: ROLE_LABELS[r] }, r)
          )
        }),
        jsxDEV(ChevronDown, { size: 14 })
      ]
    }
  );
}
function ReadyBell({ count }) {
  return jsxDEV(
    "div",
    {
      className: `ready-bell icon-btn ${count ? "ringing" : ""}`,
      title: count ? `${count} order${count === 1 ? "" : "s"} ready for pickup` : "No orders ready for pickup",
      children: [
        jsxDEV(Bell, { size: 18 }),
        count > 0 && jsxDEV("span", { className: "ready-badge", children: count })
      ]
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
  const [role, setRole] = useState6(() => getDeviceRole());
  const handleRoleChange = (next) => {
    setDeviceRole(next);
    setRole(next);
  };
  const readyOrders = useReadyAlerts(state.orders, role);
  return /* @__PURE__ */ jsxDEV("header", { className: "header", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "brand", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "brand-mark", children: "T" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 64,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "brand-name", children: "Tetra POS" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 65,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 63,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("nav", { className: "nav", children: VIEWS.map((v) => {
      const Icon = v.icon;
      return /* @__PURE__ */ jsxDEV("button", { className: `nav-btn ${view === v.key ? "active" : ""}`, onClick: () => setView(v.key), children: [
        /* @__PURE__ */ jsxDEV(Icon, { size: 18 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 73,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("span", { children: v.name }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 74,
          columnNumber: 15
        }, this)
      ] }, v.key, true, {
        fileName: "<stdin>",
        lineNumber: 72,
        columnNumber: 13
      }, this);
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 68,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "header-right", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "status-chip", "data-kind": liveCount ? "live" : "idle", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "status-dot" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 82,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { children: liveCount ? `${liveCount} live` : "Idle" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 83,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 81,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "order-label", children: activeOrder ? activeOrder.status === "new" ? "New order" : `${activeOrder.id.toUpperCase()} \xB7 ${cap3(activeOrder.status)}` : "No active order" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 86,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("label", { className: "staff-switch", children: [
        /* @__PURE__ */ jsxDEV(User2, { size: 16 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 95,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("select", { value: state.currentStaff, onChange: (e) => dispatch({ type: "SET_STAFF", name: e.target.value }), children: state.staff.map((s) => /* @__PURE__ */ jsxDEV("option", { value: s, children: s }, s, false, {
          fileName: "<stdin>",
          lineNumber: 98,
          columnNumber: 15
        }, this)) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 96,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV(ChevronDown, { size: 14 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 103,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 94,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "clock-chip", children: [
        /* @__PURE__ */ jsxDEV(Clock, { size: 15 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 107,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("span", { children: timeStr }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 108,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 106,
        columnNumber: 9
      }, this),
      role === "waiter" && jsxDEV(ReadyBell, { count: readyOrders.length }),
      jsxDEV(RoleSwitch, { role, onChange: handleRoleChange }),
      /* @__PURE__ */ jsxDEV(ThemeToggle, { theme, setTheme }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 111,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 80,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 62,
    columnNumber: 5
  }, this);
}
function cap3(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function Shell() {
  const [view, setView] = useState6("floorplan");
  const [theme, setTheme] = useState6(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );
  return /* @__PURE__ */ jsxDEV("div", { className: "app", children: [
    /* @__PURE__ */ jsxDEV(Header, { view, setView, theme, setTheme }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 129,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("main", { className: "main", children: [
      view === "floorplan" && /* @__PURE__ */ jsxDEV(FloorPlanView, { setView }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 131,
        columnNumber: 34
      }, this),
      view === "register" && /* @__PURE__ */ jsxDEV(RegisterView, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 132,
        columnNumber: 33
      }, this),
      view === "kds" && /* @__PURE__ */ jsxDEV(KdsView, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 133,
        columnNumber: 28
      }, this),
      view === "bar" && /* @__PURE__ */ jsxDEV(BarView, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 133,
        columnNumber: 28
      }, this),
      view === "settings" && /* @__PURE__ */ jsxDEV(SettingsView, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 134,
        columnNumber: 33
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 130,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 128,
    columnNumber: 5
  }, this);
}
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxDEV(StoreProvider, { children: /* @__PURE__ */ jsxDEV(Shell, {}, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 142,
    columnNumber: 5
  }) }, void 0, false, {
    fileName: "<stdin>",
    lineNumber: 141,
    columnNumber: 3
  })
);
