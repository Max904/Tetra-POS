import { jsxDEV } from "react/jsx-dev-runtime";
import { useStore, useOrdersByTable } from "./../store.js";
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
export {
  FloorPlanView as default
};
