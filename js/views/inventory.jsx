import { jsxDEV } from "react/jsx-dev-runtime";
import { useStore, LOW_STOCK } from "./../store.js";

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

function InventoryView() {
  const { state } = useStore();
  return jsxDEV("div", {
    className: "settings",
    children: [
      jsxDEV("div", {
        className: "view-head",
        children: jsxDEV("div", {
          children: [
            jsxDEV("h1", { children: "Inventory" }),
            jsxDEV("p", { className: "hint", children: "Current stock for every menu item." })
          ]
        })
      }),
      jsxDEV("section", {
        className: "panel",
        children: jsxDEV("div", {
          className: "panel-list",
          children: state.menu.map((m) => {
            const b = stockBadgeInfo(m.stock);
            return jsxDEV("div", {
              className: "pl-row",
              children: [
                jsxDEV("span", { className: "pl-main", children: jsxDEV("span", { className: "pl-name", children: m.name }) }),
                jsxDEV("span", { className: `badge ${b.cls}`, children: b.label }),
                jsxDEV("span", { className: "pl-stock", "data-kind": b.cls, children: m.stock })
              ]
            }, m.id);
          })
        })
      })
    ]
  });
}
export { InventoryView as default };
