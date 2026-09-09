import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase, deleteMenuImageByUrl } from "./supabaseClient.js";

const LOW_STOCK = 5;

const EMPTY_STATE = {
  staff: [],
  categories: [],
  menu: [],
  tables: [],
  orders: [],
  currentStaff: "",
  activeOrderId: null,
  timerStartMode: "sent",
};

const STAGE_RANK = { sent: 0, preparing: 1, ready: 2, served: 3 };

function stationOf(state, menuId) {
  return state.menu.find((m) => m.id === menuId)?.station || "kitchen";
}

// ---------- fetch + shape everything into the state object the views expect ----------

async function fetchAll() {
  const [
    { data: staffRows, error: e1 },
    { data: menuRows, error: e2 },
    { data: tableRows, error: e3 },
    { data: orderRows, error: e4 },
    { data: orderItemRows, error: e5 },
    { data: appStateRows, error: e6 },
    { data: categoryRows, error: e7 },
  ] = await Promise.all([
    supabase.from("staff").select("*").order("name"),
    supabase.from("menu_items").select("*").order("name"),
    supabase.from("tables").select("*"),
    supabase.from("orders").select("*").order("created_at"),
    supabase.from("order_items").select("*"),
    supabase.from("app_state").select("*").eq("id", 1),
    supabase.from("categories").select("*").order("sort_order"),
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
      note: it.note || "",
    });
  }

  const stationById = {};
  for (const m of menuRows || []) {
    stationById[m.id] = m.station || "kitchen";
  }

  const orders = (orderRows || []).map((o) => {
    const items = itemsByOrder[o.id] || [];
    const kitchenApplies = items.some((it) => (stationById[it.menuId] || "kitchen") === "kitchen");
    const barApplies = items.some((it) => (stationById[it.menuId] || "kitchen") === "bar");
    const kitchenStatus = o.kitchen_status || "sent";
    const barStatus = o.bar_status || "sent";

    // The order's overall "status" (used by register/floorplan/header) tracks
    // whichever station is furthest behind, so it only reads "served" once
    // BOTH the kitchen and the bar are done with their part of the ticket.
    let status = o.status;
    if (status !== "new" && status !== "paid") {
      const active = [];
      if (kitchenApplies) active.push(kitchenStatus);
      if (barApplies) active.push(barStatus);
      if (active.length) {
        status = active.reduce((worst, s) => (STAGE_RANK[s] < STAGE_RANK[worst] ? s : worst));
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
      kitchenStartedAt: o.kitchen_started_at ? new Date(o.kitchen_started_at).getTime() : null,
      barStartedAt: o.bar_started_at ? new Date(o.bar_started_at).getTime() : null,
      kitchenDismissed: !!o.kitchen_dismissed,
      barDismissed: !!o.bar_dismissed,
      status,
      billRequested: o.bill_requested,
      paid: o.paid,
    };
  });

  const appRow = (appStateRows && appStateRows[0]) || {};
  const staffNames = (staffRows || []).map((s) => s.name);

  return {
    staff: staffNames,
    categories: (categoryRows || []).map((c) => c.name),
    menu: (menuRows || []).map((m) => ({ ...m, price: Number(m.price) })),
    tables: tableRows || [],
    orders,
    currentStaff: appRow.current_staff || staffNames[0] || "",
    activeOrderId: appRow.active_order_id || null,
    // "sent": ticket timers start the moment the waiter sends the order.
    // "preparing": ticket timers start once that station actually marks the
    // ticket as preparing (kitchen_started_at / bar_started_at below).
    timerStartMode: appRow.timer_start_mode || "sent",
  };
}

// ---------- optimistic local reducer ----------
// Mirrors what runAction() will eventually persist, so the UI updates the
// instant the user acts instead of waiting for a Supabase round trip +
// realtime event + full refetch. The real fetchAll() (triggered by realtime)
// still runs afterwards and reconciles anything this simplified version
// gets wrong (e.g. two devices editing the same order at once).

function recomputeStatus(state, order) {
  if (order.status === "new" || order.status === "paid") return order.status;
  const kitchenApplies = order.items.some((it) => stationOf(state, it.menuId) === "kitchen");
  const barApplies = order.items.some((it) => stationOf(state, it.menuId) === "bar");
  const active = [];
  if (kitchenApplies) active.push(order.kitchenStatus);
  if (barApplies) active.push(order.barStatus);
  if (!active.length) return order.status;
  return active.reduce((worst, s) => (STAGE_RANK[s] < STAGE_RANK[worst] ? s : worst));
}

function withOrder(state, orderId, patch) {
  return {
    ...state,
    orders: state.orders.map((o) => {
      if (o.id !== orderId) return o;
      const next = typeof patch === "function" ? patch(o) : { ...o, ...patch };
      return { ...next, status: recomputeStatus(state, next) };
    }),
  };
}

function applyOptimistic(state, action) {
  switch (action.type) {
    case "SET_STAFF":
      return { ...state, currentStaff: action.name };

    case "SET_TIMER_MODE":
      return { ...state, timerStartMode: action.mode };

    case "ADD_STAFF":
      return state.staff.includes(action.name)
        ? state
        : { ...state, staff: [...state.staff, action.name] };

    case "REMOVE_STAFF": {
      if (state.staff.length <= 1) return state;
      const staff = state.staff.filter((s) => s !== action.name);
      const currentStaff = state.currentStaff === action.name ? staff[0] || "" : state.currentStaff;
      return { ...state, staff, currentStaff };
    }

    case "OPEN_ORDER": {
      const newOrder = {
        id: action.id,
        tableId: action.tableId,
        staff: state.currentStaff,
        items: [],
        createdAt: Date.now(),
        sentAt: null,
        kitchenStatus: "sent",
        barStatus: "sent",
        kitchenServedAt: null,
        barServedAt: null,
        kitchenStartedAt: null,
        barStartedAt: null,
        kitchenDismissed: false,
        barDismissed: false,
        status: "new",
        billRequested: false,
        paid: false,
      };
      return { ...state, orders: [...state.orders, newOrder], activeOrderId: action.id };
    }

    case "SELECT_ORDER":
      return { ...state, activeOrderId: action.orderId };

    case "SET_ACTIVE_TABLE":
      return { ...state, activeOrderId: null };

    case "ADD_TO_ORDER": {
      const next = withOrder(state, action.orderId, (o) => {
        const idx = o.items.findIndex((it) => it.menuId === action.menuId);
        const items =
          idx >= 0
            ? o.items.map((it, i) => (i === idx ? { ...it, qty: it.qty + 1 } : it))
            : [...o.items, { menuId: action.menuId, name: action.name, price: action.price, qty: 1, note: "" }];
        return { ...o, items };
      });
      return {
        ...next,
        menu: next.menu.map((m) => (m.id === action.menuId ? { ...m, stock: Math.max(0, m.stock - 1) } : m)),
      };
    }

    case "SET_QTY":
      return withOrder(state, action.orderId, (o) => {
        const item = o.items[action.index];
        if (!item) return o;
        const items =
          action.qty <= 0
            ? o.items.filter((_, i) => i !== action.index)
            : o.items.map((it, i) => (i === action.index ? { ...it, qty: action.qty } : it));
        return { ...o, items };
      });

    case "SET_NOTE":
      return withOrder(state, action.orderId, (o) => ({
        ...o,
        items: o.items.map((it, i) => (i === action.index ? { ...it, note: action.note } : it)),
      }));

    case "SEND_TO_KITCHEN":
      return withOrder(state, action.orderId, (o) => {
        if (!o.items.length) return o;
        return {
          ...o,
          status: "sent",
          sentAt: Date.now(),
          kitchenStatus: "sent",
          barStatus: "sent",
          kitchenDismissed: false,
          barDismissed: false,
        };
      });

    case "SET_KITCHEN": {
      const station = action.station === "bar" ? "bar" : "kitchen";
      return withOrder(state, action.orderId, (o) => {
        const patch = {};
        if (station === "bar") {
          patch.barStatus = action.status;
          if (action.status === "preparing" && !o.barStartedAt) patch.barStartedAt = Date.now();
          if (action.status === "served") patch.barServedAt = Date.now();
        } else {
          patch.kitchenStatus = action.status;
          if (action.status === "preparing" && !o.kitchenStartedAt) patch.kitchenStartedAt = Date.now();
          if (action.status === "served") patch.kitchenServedAt = Date.now();
        }
        return { ...o, ...patch };
      });
    }

    case "REQUEST_BILL":
      return withOrder(state, action.orderId, { billRequested: true });

    case "PAY": {
      const next = withOrder(state, action.orderId, { paid: true, status: "paid" });
      return state.activeOrderId === action.orderId ? { ...next, activeOrderId: null } : next;
    }

    case "DISMISS_ORDER": {
      const order = state.orders.find((o) => o.id === action.orderId);
      if (!order) return state;
      const station = action.station === "bar" ? "bar" : "kitchen";
      let next = withOrder(
        state,
        action.orderId,
        station === "bar" ? { barDismissed: true } : { kitchenDismissed: true }
      );
      const updated = next.orders.find((o) => o.id === action.orderId);
      const kitchenApplies = order.items.some((it) => stationOf(state, it.menuId) === "kitchen");
      const barApplies = order.items.some((it) => stationOf(state, it.menuId) === "bar");
      const kitchenDone = !kitchenApplies || updated.kitchenDismissed || station === "kitchen";
      const barDone = !barApplies || updated.barDismissed || station === "bar";
      if (kitchenDone && barDone) {
        next = { ...next, orders: next.orders.filter((o) => o.id !== action.orderId) };
        if (next.activeOrderId === action.orderId) next = { ...next, activeOrderId: null };
      }
      return next;
    }

    // Menu/table/category admin edits (Settings screen) are infrequent and
    // not where the lag was reported, so they still wait for the realtime
    // refresh to reflect on screen.
    default:
      return state;
  }
}

// ---------- turn a dispatched action into Supabase writes ----------
// Realtime subscriptions (below) pick up the resulting DB changes and
// refresh local state — every connected device sees the same thing.

async function runAction(action, state) {
  switch (action.type) {
    case "SET_STAFF":
      await supabase.from("app_state").update({ current_staff: action.name }).eq("id", 1);
      return;

    case "SET_TIMER_MODE":
      await supabase.from("app_state").update({ timer_start_mode: action.mode }).eq("id", 1);
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
        sort_order: state.categories.length,
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
        station: action.station || "kitchen",
        image_url: action.imageUrl || null,
      });
      return;

    case "UPDATE_ITEM":
      await supabase
        .from("menu_items")
        .update({
          name: action.name,
          category: action.category,
          price: action.price,
          stock: action.stock,
          station: action.station || "kitchen",
          image_url: action.imageUrl || null,
        })
        .eq("id", action.id);
      return;

    case "DELETE_ITEM": {
      const item = state.menu.find((m) => m.id === action.id);
      await supabase.from("menu_items").delete().eq("id", action.id);
      // Clean up the orphaned photo in Storage — but only if no other menu
      // item still points at the same URL (can happen if someone pasted the
      // same external link into two items).
      const stillUsed = state.menu.some((m) => m.id !== action.id && m.image_url === item?.image_url);
      if (item?.image_url && !stillUsed) {
        await deleteMenuImageByUrl(item.image_url);
      }
      return;
    }

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
      const id = action.id || `o${Date.now()}`;
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
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            kitchen_status: "sent",
            bar_status: "sent",
            kitchen_dismissed: false,
            bar_dismissed: false,
          })
          .eq("id", action.orderId);
      }
      return;
    }

    case "SET_KITCHEN": {
      const station = action.station === "bar" ? "bar" : "kitchen";
      const order = state.orders.find((o) => o.id === action.orderId);
      const patch = {};
      if (station === "bar") {
        patch.bar_status = action.status;
        // Only stamp this the first time the ticket enters "preparing" —
        // it's what the "preparing" timer-start mode measures from.
        if (action.status === "preparing" && !order?.barStartedAt) {
          patch.bar_started_at = new Date().toISOString();
        }
        if (action.status === "served") patch.bar_served_at = new Date().toISOString();
      } else {
        patch.kitchen_status = action.status;
        if (action.status === "preparing" && !order?.kitchenStartedAt) {
          patch.kitchen_started_at = new Date().toISOString();
        }
        if (action.status === "served") patch.kitchen_served_at = new Date().toISOString();
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
      const station = action.station === "bar" ? "bar" : "kitchen";
      const patch = station === "bar" ? { bar_dismissed: true } : { kitchen_dismissed: true };

      // Read back the row we just patched instead of trusting this device's
      // local cache. Kitchen and Bar are normally separate tablets, each
      // syncing over realtime — if both are dismissed within the same
      // second, whichever device is second may not have heard about the
      // first device's dismiss yet. Deciding from a fresh DB read (rather
      // than `order.kitchenDismissed`/`barDismissed` from local state)
      // means the two devices can never both think "the other one isn't
      // done yet" and leave the order stuck forever.
      const { data: updated, error } = await supabase
        .from("orders")
        .update(patch)
        .eq("id", action.orderId)
        .select()
        .single();
      if (error || !updated) return;

      const order = state.orders.find((o) => o.id === action.orderId);
      const kitchenApplies = order ? order.items.some((it) => stationOf(state, it.menuId) === "kitchen") : true;
      const barApplies = order ? order.items.some((it) => stationOf(state, it.menuId) === "bar") : true;
      const kitchenDone = !kitchenApplies || !!updated.kitchen_dismissed;
      const barDone = !barApplies || !!updated.bar_dismissed;
      if (kitchenDone && barDone) {
        // Delete child rows first. If this Supabase project doesn't have an
        // ON DELETE CASCADE from order_items -> orders, deleting "orders"
        // directly fails on the foreign key — and since that error used to
        // go unchecked, the row silently stayed in the database. The local
        // optimistic removal would then get overwritten by the next
        // refresh, making the dismissed order appear to "come back".
        const { error: itemsErr } = await supabase
          .from("order_items")
          .delete()
          .eq("order_id", action.orderId);
        if (itemsErr) throw itemsErr;

        const { error: orderErr } = await supabase.from("orders").delete().eq("id", action.orderId);
        if (orderErr) throw orderErr;

        if (state.activeOrderId === action.orderId) {
          await supabase.from("app_state").update({ active_order_id: null }).eq("id", 1);
        }
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
      stateRef.current = data;
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
      .on("postgres_changes", { event: "*", schema: "public", table: "categories" }, scheduleRefresh)
      .subscribe();

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current);
      supabase.removeChannel(channel);
    };
  }, [refreshNow, scheduleRefresh]);

  const dispatch = useCallback(
    (action) => {
      const current = stateRef.current;
      // OPEN_ORDER needs the same id locally and in Supabase, or the
      // optimistic ticket and the "real" one from the next refresh would
      // show up as two separate orders.
      const act =
        action.type === "OPEN_ORDER" && !action.id
          ? { ...action, id: `o${Date.now()}` }
          : action;

      const optimistic = applyOptimistic(current, act);
      stateRef.current = optimistic;
      setState(optimistic);

      runAction(act, current).catch((err) => {
        console.error("Supabase write failed:", act.type, err);
        // Our local guess may now be wrong (write failed after the UI
        // already moved on) — force a resync with the real data.
        refreshNow();
      });
    },
    [refreshNow]
  );

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
  return state.orders
    .filter((o) => !o.paid && o.status !== "new" && o.status !== "paid" && !o.kitchenDismissed)
    .map((o) => ({
      ...o,
      items: o.items.filter((it) => stationOf(state, it.menuId) === "kitchen"),
    }))
    .filter((o) => o.items.length > 0);
}

export function useBarOrders(state) {
  return state.orders
    .filter((o) => !o.paid && o.status !== "new" && o.status !== "paid" && !o.barDismissed)
    .map((o) => ({
      ...o,
      items: o.items.filter((it) => stationOf(state, it.menuId) === "bar"),
    }))
    .filter((o) => o.items.length > 0);
}

export { LOW_STOCK };
