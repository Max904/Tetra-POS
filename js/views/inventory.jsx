import { jsxDEV } from "react/jsx-dev-runtime";
import { useState } from "react";
import { Search, Minus, Plus, PackageX, AlertTriangle, PackageCheck } from "lucide-react";
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

const FILTERS = [
  { key: "all", label: "All" },
  { key: "low", label: "Low" },
  { key: "out", label: "Out" },
];

function InventoryView() {
  const { state, dispatch } = useStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState({});

  const total = state.menu.length;
  const lowCount = state.menu.filter((m) => stockBadge(m.stock) === "low").length;
  const outCount = state.menu.filter((m) => stockBadge(m.stock) === "out").length;

  const q = query.trim().toLowerCase();
  const visible = state.menu.filter((m) => {
    if (q && !m.name.toLowerCase().includes(q)) return false;
    if (filter === "low" && stockBadge(m.stock) !== "low") return false;
    if (filter === "out" && stockBadge(m.stock) !== "out") return false;
    return true;
  });
  const groups = [...state.categories, "Other"]
    .map((cat) => ({ cat, items: visible.filter((m) => (m.category || "Other") === cat) }))
    .filter((g) => g.items.length > 0);

  // Restock always applies directly — bump/drop the count, or type an exact
  // number and press Enter / blur to set it. Independent from what the
  // register does when items are ordered or a mistake is removed: this is
  // for correcting the count itself (deliveries, spot-checks, waste).
  const bump = (m, delta) => dispatch({ type: "SET_STOCK", id: m.id, stock: Math.max(0, m.stock + delta) });
  const commitDraft = (m) => {
    const raw = draft[m.id];
    if (raw === undefined) return;
    const n = parseInt(raw, 10);
    setDraft((d) => {
      const next = { ...d };
      delete next[m.id];
      return next;
    });
    if (Number.isFinite(n) && n >= 0 && n !== m.stock) {
      dispatch({ type: "SET_STOCK", id: m.id, stock: n });
    }
  };

  return jsxDEV("div", {
    className: "settings",
    children: [
      jsxDEV("div", {
        className: "view-head",
        children: [
          jsxDEV("div", {
            children: [
              jsxDEV("h1", { children: "Inventory" }),
              jsxDEV("p", { className: "hint", children: "Stock moves automatically as orders go in and out; adjust it here for deliveries or corrections." })
            ]
          }),
          jsxDEV("div", { className: "inv-summary", children: [
            jsxDEV("span", { className: "inv-chip", children: [jsxDEV(PackageCheck, { size: 14 }), `${total} items`] }),
            jsxDEV("span", { className: "inv-chip low", children: [jsxDEV(AlertTriangle, { size: 14 }), `${lowCount} low`] }),
            jsxDEV("span", { className: "inv-chip out", children: [jsxDEV(PackageX, { size: 14 }), `${outCount} out`] }),
          ] })
        ]
      }),
      jsxDEV("div", { className: "inv-toolbar", children: [
        jsxDEV("label", { className: "inv-search", children: [
          jsxDEV(Search, { size: 16 }),
          jsxDEV("input", {
            placeholder: "Search items\u2026",
            value: query,
            onChange: (e) => setQuery(e.target.value)
          })
        ] }),
        jsxDEV("div", { className: "inv-filters", children: FILTERS.map((f) =>
          jsxDEV("button", {
            className: `inv-filter ${filter === f.key ? "active" : ""}`,
            onClick: () => setFilter(f.key),
            children: f.label
          }, f.key)
        ) })
      ] }),
      groups.length === 0
        ? jsxDEV("div", { className: "kds-empty", children: [
            jsxDEV(PackageX, { size: 36 }),
            jsxDEV("p", { children: "No items match." })
          ] })
        : groups.map((g) =>
            jsxDEV("section", { className: "panel", children: [
              jsxDEV("h2", { className: "zone-title", children: g.cat }),
              jsxDEV("div", { className: "panel-list", children: g.items.map((m) => {
                const b = stockBadgeInfo(m.stock);
                const value = draft[m.id] !== undefined ? draft[m.id] : String(m.stock);
                return jsxDEV("div", { className: "pl-row inv-row", children: [
                  jsxDEV("span", { className: "pl-main", children: jsxDEV("span", { className: "pl-name", children: m.name }) }),
                  jsxDEV("span", { className: `badge ${b.cls}`, children: b.label }),
                  jsxDEV("div", { className: "inv-stepper", children: [
                    jsxDEV("button", { onClick: () => bump(m, -1), disabled: m.stock <= 0, title: "-1", children: jsxDEV(Minus, { size: 14 }) }),
                    jsxDEV("input", {
                      className: "inv-input",
                      inputMode: "numeric",
                      value,
                      onChange: (e) => setDraft((d) => ({ ...d, [m.id]: e.target.value.replace(/[^0-9]/g, "") })),
                      onBlur: () => commitDraft(m),
                      onKeyDown: (e) => { if (e.key === "Enter") e.currentTarget.blur(); }
                    }),
                    jsxDEV("button", { onClick: () => bump(m, 1), title: "+1", children: jsxDEV(Plus, { size: 14 }) })
                  ] })
                ] }, m.id);
              }) })
            ] }, g.cat)
          )
    ]
  });
}
export { InventoryView as default };
