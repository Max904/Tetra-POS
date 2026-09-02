import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Minus, Trash2, ChefHat, Printer, CreditCard, PackageX, Receipt } from "lucide-react";
import { useStore } from "./../store.js";
import { TAX_RATE } from "./../data.js";
function stockLabel(item) {
  if (item.stock === 0) return { text: "Out", cls: "out" };
  if (item.stock <= 5) return { text: "Low", cls: "low" };
  return null;
}
function RegisterView() {
  const { state, dispatch } = useStore();
  const [activeCat, setActiveCat] = useState(state.categories[0]);
  const [query, setQuery] = useState("");
  const order = state.orders.find((o) => o.id === state.activeOrderId && !o.paid);
  const table = state.tables.find((t) => t.id === order?.tableId);
  const items = useMemo(() => {
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
  const [noteDrafts, setNoteDrafts] = useState({});
  useEffect(() => {
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
      /* @__PURE__ */ jsxDEV("span", { className: `kstatus ${order.status}`, children: cap(order.status) }, void 0, false, {
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
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
export {
  RegisterView as default
};
