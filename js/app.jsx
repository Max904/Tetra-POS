import { jsxDEV } from "react/jsx-dev-runtime";
import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ShoppingCart,
  Printer,
  ChefHat,
  Sun,
  Moon,
  Clock,
  User,
  ChevronDown,
  LayoutDashboard
} from "lucide-react";
import { StoreProvider, useStore, useOrdersByTable } from "./store.js";
import FloorPlanView from "./views/floorplan.jsx";
import RegisterView from "./views/register.jsx";
import KdsView from "./views/kds.jsx";
import SettingsView from "./views/settings.jsx";
const VIEWS = [
  { key: "floorplan", name: "Tables", icon: LayoutDashboard },
  { key: "register", name: "Register", icon: ShoppingCart },
  { key: "kds", name: "Kitchen", icon: ChefHat },
  { key: "settings", name: "Admin", icon: Printer }
];
function useClock() {
  const [now, setNow] = useState(() => /* @__PURE__ */ new Date());
  useEffect(() => {
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
function Header({ view, setView, theme, setTheme }) {
  const { state, dispatch } = useStore();
  const now = useClock();
  const ordersByTable = useOrdersByTable(state);
  const activeOrder = state.orders.find((o) => o.id === state.activeOrderId && !o.paid);
  const liveCount = Object.values(ordersByTable).filter((o) => o.items.length && o.status !== "new").length;
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
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
      /* @__PURE__ */ jsxDEV("div", { className: "order-label", children: activeOrder ? activeOrder.status === "new" ? "New order" : `${activeOrder.id.toUpperCase()} \xB7 ${cap(activeOrder.status)}` : "No active order" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 86,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("label", { className: "staff-switch", children: [
        /* @__PURE__ */ jsxDEV(User, { size: 16 }, void 0, false, {
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
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function Shell() {
  const [view, setView] = useState("floorplan");
  const [theme, setTheme] = useState(
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
