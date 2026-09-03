import { jsxDEV } from "react/jsx-dev-runtime";
import { useEffect, useState } from "react";
import { ChefHat, CookingPot, Check, X, Timer, StickyNote } from "lucide-react";
import { useStore, useKitchenOrders } from "./../store.js";
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
      /* @__PURE__ */ jsxDEV(ChefHat, { size: 40 }, void 0, false, {
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
export {
  KdsView as default
};
