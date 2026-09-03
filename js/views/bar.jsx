import { jsxDEV } from "react/jsx-dev-runtime";
import { useEffect, useState } from "react";
import { Beer, CookingPot, Check, X, Timer, StickyNote } from "lucide-react";
import { useStore, useBarOrders } from "./../store.js";
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
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
  const now = useNow();
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
            /* @__PURE__ */ jsxDEV(Timer, { size: 15 }, void 0, false, {}, this),
            fmt(elapsed)
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
                /* @__PURE__ */ jsxDEV(StickyNote, { size: 12 }, void 0, false, {}, this),
                it.note
              ] }, void 0, true, {}, this)
            ] }, void 0, true, {}, this)
          ] }, i, true, {}, this)) }, void 0, false, {}, this)
        ] }, group.cat, true, {}, this)) }, void 0, false, {}, this),
        /* @__PURE__ */ jsxDEV("footer", { className: "k-actions", children: [
          o.barStatus === "sent" && /* @__PURE__ */ jsxDEV("button", { className: "ka preparing", onClick: () => dispatch({ type: "SET_KITCHEN", orderId: o.id, station: "bar", status: "preparing" }), children: [
            /* @__PURE__ */ jsxDEV(CookingPot, { size: 16 }, void 0, false, {}, this),
            " Preparing"
          ] }, void 0, true, {}, this),
          o.barStatus === "preparing" && /* @__PURE__ */ jsxDEV("button", { className: "ka ready", onClick: () => dispatch({ type: "SET_KITCHEN", orderId: o.id, station: "bar", status: "ready" }), children: [
            /* @__PURE__ */ jsxDEV(Check, { size: 16 }, void 0, false, {}, this),
            " Mark Ready"
          ] }, void 0, true, {}, this),
          o.barStatus === "ready" && /* @__PURE__ */ jsxDEV("button", { className: "ka serve", onClick: () => dispatch({ type: "SET_KITCHEN", orderId: o.id, station: "bar", status: "served" }), children: [
            /* @__PURE__ */ jsxDEV(Check, { size: 16 }, void 0, false, {}, this),
            " Served"
          ] }, void 0, true, {}, this),
          /* @__PURE__ */ jsxDEV("button", { className: "ka dismiss", onClick: () => dispatch({ type: "DISMISS_ORDER", orderId: o.id, station: "bar" }), children: [
            /* @__PURE__ */ jsxDEV(X, { size: 16 }, void 0, false, {}, this),
            " Dismiss"
          ] }, void 0, true, {}, this)
        ] }, void 0, true, {}, this)
      ] }, o.id, true, {}, this);
    }) }, void 0, false, {}, this)
  ] }, void 0, true, {}, this);
}
export {
  BarView as default
};
