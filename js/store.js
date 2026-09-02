import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "./supabaseClient.js";

const LOW_STOCK = 5;

const EMPTY_STATE = {
  staff: [],
  categories: [],
  menu: [],
  tables: [],
  orders: [],
  currentStaff: "",
  activeOrderId: null,
};

// ---------- fetch + shape everything into the state object the views expect ----------

async function fetchAll() {
  const [
    { data: staffRows, error: e1 },
    { data: menuRows, error: e2 },
    { data: tableRows, error: e3 },
    { data: orderRows, error: e4 },
    { data: orderItemRows, error: e5 },
    { data: appStateRows, error: e6 },
  ] = await Promise.all([
    supabase.from("staff").select("*").order("name"),
    supabase.from("menu_items").select("*"),
    supabase.from("tables").select("*"),
    supabase.from("orders").select("*").order("created_at"),
    supabase.from("order_items").select("*"),
    supabase.from("app_state").select("*").eq("id", 1),
  ]);

  const err = e1 || e2 || e3 || e4 || e5 || e6;
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
      note: it.note || "",
    });
  }

  const orders = (orderRows || []).map((o) => ({
    id: o.id,
    tableId: o.table_id,
    staff: o.staff,
    items: itemsByOrder[o.id] || [],
    createdAt: new Date(o.created_at).getTime(),
    sentAt: o.sent_at ? new Date(o.sent_at).getTime() : null,
    servedAt: o.served_at ? new Date(o.served_at).getTime() : null,
    status: o.status,
    billRequested: o.bill_requested,
    paid: o.paid,
  }));

  const appRow = (appStateRows && appStateRows[0]) || {};
  const staffNames = (staffRows || []).map((s) => s.name);

  return {
    staff: staffNames,
    categories: [...new Set((menuRows || []).map((m) => m.category))],
    menu: (menuRows || []).map((m) => ({ ...m, price: Number(m.price) })),
    tables: tableRows || [],
    orders,
    currentStaff: appRow.current_staff || staffNames[0] || "",
    activeOrderId: appRow.active_order_id || null,
  };
}

// ---------- turn a dispatched action into Supabase writes ----------
// Realtime subscriptions (below) pick up the resulting DB changes and
// refresh local state — every connected device sees the same thing.

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

    case "ADD_ITEM":
      await supabase.from("menu_items").insert({
        id: `m${Date.now()}`,
        name: action.name,
        category: action.category,
        price: action.price,
        stock: action.stock,
      });
      return;

    case "UPDATE_ITEM":
      await supabase
        .from("menu_items")
        .update({ name: action.name, category: action.category, price: action.price, stock: action.stock })
        .eq("id", action.id);
      return;

    case "DELETE_ITEM":
      await supabase.from("menu_items").delete().eq("id", action.id);
      return;

    case "ADD_TABLE":
      await supabase.from("tables").insert({
        id: `t${Date.now()}`,
        name: action.name,
        zone: action.zone,
        capacity: action.capacity,
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
        paid: false,
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
        await supabase
          .from("order_items")
          .update({ qty: existing.qty + 1 })
          .eq("order_id", action.orderId)
          .eq("menu_id", action.menuId);
      } else {
        await supabase.from("order_items").insert({
          order_id: action.orderId,
          menu_id: action.menuId,
          name: action.name,
          price: action.price,
          qty: 1,
          note: "",
        });
      }
      const menuItem = state.menu.find((m) => m.id === action.menuId);
      if (menuItem) {
        await supabase
          .from("menu_items")
          .update({ stock: Math.max(0, menuItem.stock - 1) })
          .eq("id", action.menuId);
      }
      return;
    }

    case "SET_QTY": {
      const order = state.orders.find((o) => o.id === action.orderId);
      const item = order?.items[action.index];
      if (!item) return;
      if (action.qty <= 0) {
        await supabase
          .from("order_items")
          .delete()
          .eq("order_id", action.orderId)
          .eq("menu_id", item.menuId);
      } else {
        await supabase
          .from("order_items")
          .update({ qty: action.qty })
          .eq("order_id", action.orderId)
          .eq("menu_id", item.menuId);
      }
      return;
    }

    case "SET_NOTE": {
      const order = state.orders.find((o) => o.id === action.orderId);
      const item = order?.items[action.index];
      if (!item) return;
      await supabase
        .from("order_items")
        .update({ note: action.note })
        .eq("order_id", action.orderId)
        .eq("menu_id", item.menuId);
      return;
    }

    case "SEND_TO_KITCHEN": {
      const order = state.orders.find((o) => o.id === action.orderId);
      if (order && order.items.length) {
        await supabase
          .from("orders")
          .update({ status: "sent", sent_at: new Date().toISOString() })
          .eq("id", action.orderId);
      }
      return;
    }

    case "SET_KITCHEN": {
      const patch = { status: action.status };
      if (action.status === "served") {
        patch.served_at = new Date().toISOString();
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
      await supabase.from("orders").delete().eq("id", action.orderId);
      if (state.activeOrderId === action.orderId) {
        await supabase.from("app_state").update({ active_order_id: null }).eq("id", 1);
      }
      return;
    }

    default:
      return;
  }
}

// ---------- React wiring ----------

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, setState] = useState(EMPTY_STATE);
  const stateRef = useRef(state);
  stateRef.current = state;
  const refreshTimer = useRef(null);

  const refreshNow = useCallback(async () => {
    try {
      const data = await fetchAll();
      setState(data);
    } catch {
      // network hiccup — next realtime event or action will retry
    }
  }, []);

  // Debounce so a burst of row-level realtime events (e.g. deleting an
  // order + its items) only triggers one refetch.
  const scheduleRefresh = useCallback(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(refreshNow, 150);
  }, [refreshNow]);

  useEffect(() => {
    refreshNow();

    const channel = supabase
      .channel("tetra-sync")
      .on("postgres_changes", { event: "*", schema: "public", table: "staff" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "tables" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "order_items" }, scheduleRefresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "app_state" }, scheduleRefresh)
      .subscribe();

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
