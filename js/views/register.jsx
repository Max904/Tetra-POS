import { Fragment, jsxDEV } from "react/jsx-dev-runtime";
import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Minus, Trash2, ChefHat, Printer, CreditCard, PackageX, Receipt, ImageOff, ChevronDown } from "lucide-react";
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
  // Which guest (by seat number) new items get added to. null = shared /
  // no particular seat — the default, so tables that don't use this stay
  // exactly like before. Resets whenever the open order changes so a seat
  // picked for one table doesn't silently carry over to the next.
  const [activeSeat, setActiveSeat] = useState(null);
  useEffect(() => {
    setActiveSeat(null);
  }, [order?.id]);
  const seatCount = table?.capacity > 1 ? table.capacity : 0;
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
        seatCount > 0 && /* @__PURE__ */ jsxDEV("div", { className: "seat-tabs", children: [
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              className: `seat-tab ${activeSeat === null ? "active" : ""}`,
              disabled: !canEdit,
              onClick: () => setActiveSeat(null),
              children: "Compartido"
            },
            "shared",
            false,
            {},
            this
          ),
          Array.from({ length: seatCount }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsxDEV(
            "button",
            {
              className: `seat-tab ${activeSeat === n ? "active" : ""}`,
              disabled: !canEdit,
              onClick: () => setActiveSeat(n),
              children: `Asiento ${n}`
            },
            n,
            false,
            {},
            this
          ))
        ] }, void 0, true, {}, this),
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
                    dispatch({ type: "ADD_TO_ORDER", orderId: order.id, menuId: m.id, name: m.name, price: m.price, seat: activeSeat });
                  }
                },
                children: [
                  m.image_url ? /* @__PURE__ */ jsxDEV("img", { src: m.image_url, alt: "", className: "mi-photo", onError: (e) => {
                    e.target.style.display = "none";
                  } }, void 0, false, {}, this) : /* @__PURE__ */ jsxDEV("span", { className: "mi-photo placeholder", children: /* @__PURE__ */ jsxDEV(ImageOff, { size: 20 }, void 0, false, {}, this) }, void 0, false, {}, this),
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
// Buckets item indices by seat number so the ticket can show "Compartido"
// (seat === null) and "Asiento N" groups instead of one flat list. Only
// meaningful once at least one line actually has a seat set — see hasSeats
// below, which is what decides whether the headers render at all.
function groupItemsBySeat(items) {
  const bySeat = new Map();
  items.forEach((it, idx) => {
    const seat = it.seat ?? null;
    if (!bySeat.has(seat)) bySeat.set(seat, []);
    bySeat.get(seat).push(idx);
  });
  const seats = [...bySeat.keys()].sort((a, b) => {
    if (a === null) return -1;
    if (b === null) return 1;
    return a - b;
  });
  return seats.map((seat) => ({ seat, indices: bySeat.get(seat) }));
}
function seatLabel(seat) {
  return seat === null ? "Compartido" : `Asiento ${seat}`;
}
function TicketPanel({ order, canEdit }) {
  const { state, dispatch } = useStore();
  const table = state.tables.find((t) => t.id === order?.tableId);
  const items = order?.items || [];
  const seatCount = table?.capacity > 1 ? table.capacity : 0;
  const hasSeats = items.some((it) => (it.seat ?? null) !== null);
  const seatGroups = groupItemsBySeat(items);
  const menuStockOf = (menuId) => state.menu.find((m) => m.id === menuId)?.stock ?? 0;
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
  const saleStrip = jsxDEV(SaleStrip, { order });
  const historyBlock = jsxDEV(OrderHistory, { order });
  return /* @__PURE__ */ jsxDEV("aside", { className: "ticket", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "ticket-head", children: [
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV("h2", { children: table?.name || "Table" }, void 0, false, {
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
      seatGroups.map((group) => {
        const groupSubtotal = group.indices.reduce((s, i) => s + items[i].price * items[i].qty, 0);
        return /* @__PURE__ */ jsxDEV(Fragment, { children: [
          hasSeats && /* @__PURE__ */ jsxDEV("div", { className: "seat-group-label", children: [
            /* @__PURE__ */ jsxDEV("span", { children: seatLabel(group.seat) }, void 0, false, {}, this),
            /* @__PURE__ */ jsxDEV("span", { children: [
              "$",
              groupSubtotal.toFixed(2)
            ] }, void 0, true, {}, this)
          ] }, void 0, true, {}, this),
          group.indices.map((idx) => {
            const it = items[idx];
            return /* @__PURE__ */ jsxDEV("div", { className: "ticket-item", children: [
              /* @__PURE__ */ jsxDEV("div", { className: "ti-top", children: [
                /* @__PURE__ */ jsxDEV("span", { className: "ti-name", children: [
                  it.qty,
                  "\xD7 ",
                  it.name,
                  it.ready && jsxDEV("span", { className: "ti-ready", children: "\u2713 Listo" })
                ] }, void 0, true, {}, this),
                /* @__PURE__ */ jsxDEV("span", { className: "ti-price", children: [
                  "$",
                  (it.price * it.qty).toFixed(2)
                ] }, void 0, true, {}, this)
              ] }, void 0, true, {}, this),
              /* @__PURE__ */ jsxDEV("div", { className: "ti-controls", children: [
                /* @__PURE__ */ jsxDEV("div", { className: "qty", children: [
                  /* @__PURE__ */ jsxDEV("button", { onClick: () => setQty(dispatch, order, idx, it.qty - 1), disabled: it.qty <= 1 || !canEdit, children: /* @__PURE__ */ jsxDEV(Minus, { size: 14 }, void 0, false, {}, this) }, void 0, false, {}, this),
                  /* @__PURE__ */ jsxDEV("span", { children: it.qty }, void 0, false, {}, this),
                  /* @__PURE__ */ jsxDEV("button", { onClick: () => setQty(dispatch, order, idx, it.qty + 1), disabled: !canEdit || menuStockOf(it.menuId) <= 0, title: !canEdit ? "" : menuStockOf(it.menuId) <= 0 ? "Sin stock" : "", children: /* @__PURE__ */ jsxDEV(Plus, { size: 14 }, void 0, false, {}, this) }, void 0, false, {}, this)
                ] }, void 0, true, {}, this),
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
                  {},
                  this
                ),
                /* @__PURE__ */ jsxDEV("button", { className: "remove", title: "Eliminar (devuelve al stock)", onClick: () => removeItem(dispatch, order, idx, it), children: /* @__PURE__ */ jsxDEV(Trash2, { size: 15 }, void 0, false, {}, this) }, void 0, false, {}, this)
              ] }, void 0, true, {}, this),
              seatCount > 0 && /* @__PURE__ */ jsxDEV("label", { className: "seat-assign", children: [
                "Asiento",
                /* @__PURE__ */ jsxDEV(
                  "select",
                  {
                    value: it.seat ?? "",
                    disabled: !canEdit,
                    onChange: (e) => dispatch({
                      type: "SET_ITEM_SEAT",
                      orderId: order.id,
                      index: idx,
                      seat: e.target.value === "" ? null : Number(e.target.value)
                    }),
                    children: [
                      /* @__PURE__ */ jsxDEV("option", { value: "", children: "Compartido" }, "shared", false, {}, this),
                      Array.from({ length: seatCount }, (_, i) => i + 1).map((n) => /* @__PURE__ */ jsxDEV("option", { value: n, children: n }, n, false, {}, this))
                    ]
                  },
                  void 0,
                  true,
                  {},
                  this
                )
              ] }, void 0, true, {}, this)
            ] }, `${it.menuId}-${idx}`, true, {}, this);
          })
        ] }, group.seat === null ? "shared" : group.seat, true, {}, this);
      }),
      historyBlock
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 137,
      columnNumber: 7
    }, this),
    saleStrip,
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
function SaleStrip({ order }) {
  const { state, dispatch } = useStore();
  if (!order || order.status === "new") return null;
  const items = order.items;
  const catOfItem = (it) => state.menu.find((m) => m.id === it.menuId)?.category || "Other";
  const groups = [...state.categories, "Other"]
    .map((cat) => ({
      cat,
      indices: items.map((it, i) => (catOfItem(it) === cat ? i : -1)).filter((i) => i >= 0),
    }))
    .filter((g) => g.indices.length > 0);
  if (!groups.length) return null;
  return jsxDEV("div", {
    className: "sale-strip",
    children: [
      jsxDEV("span", { className: "sale-label", children: "Sale" }),
      ...groups.map((g) => {
        const fired = g.indices.every((i) => items[i].sale);
        return jsxDEV("button", {
          className: `sale-btn ${fired ? "sent" : ""}`,
          disabled: fired,
          title: fired ? "Cocina/barra ya fue avisada" : `Avisar que salga: ${g.cat}`,
          onClick: () => dispatch({ type: "SET_ITEMS_SALE", orderId: order.id, indices: g.indices, sale: true }),
          children: fired ? `\u2713 ${g.cat}` : g.cat
        }, g.cat);
      })
    ]
  });
}
// Earlier comandas for the same table that already went to the kitchen/bar.
// They stay visible in the cart so the waiter can still fire ("Sale") a
// category on them, e.g. after adding more items in a newer comanda.
function OrderHistory({ order }) {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState({});
  const tableOrders = state.orders
    .filter((o) => o.tableId === order.tableId && !o.paid)
    .sort((a, b) => a.createdAt - b.createdAt);
  const numberOf = (id) => tableOrders.findIndex((o) => o.id === id) + 1;
  const past = tableOrders.filter((o) => o.id !== order.id && o.status !== "new").reverse();
  if (!past.length) return null;
  return jsxDEV("div", {
    className: "order-history",
    children: [
      jsxDEV("div", { className: "history-title", children: "Comandas anteriores" }),
      ...past.map((o) => {
        const isOpen = !!open[o.id];
        const time = new Date(o.sentAt || o.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const count = o.items.reduce((s, it) => s + it.qty, 0);
        return jsxDEV("div", {
          className: "history-card",
          children: [
            jsxDEV("button", {
              className: "history-head",
              onClick: () => setOpen((s) => ({ ...s, [o.id]: !s[o.id] })),
              children: [
                jsxDEV("span", { className: "history-name", children: `Comanda ${numberOf(o.id)} \u00b7 ${time}` }),
                jsxDEV("span", { className: `kstatus ${o.status}`, children: cap(o.status) }),
                jsxDEV("span", { className: "history-count", children: `${count} \u00edtem${count === 1 ? "" : "s"}` }),
                jsxDEV(ChevronDown, { size: 16, className: isOpen ? "chev open" : "chev" })
              ]
            }),
            jsxDEV(SaleStrip, { order: o }),
            isOpen && jsxDEV("ul", {
              className: "history-items",
              children: o.items.map((it, i) =>
                jsxDEV("li", {
                  children: [
                    jsxDEV("span", { children: `${it.qty}\u00d7 ${it.name}` }),
                    it.seat != null && jsxDEV("span", { className: "history-meta", children: `Asiento ${it.seat}` }),
                    it.note && jsxDEV("span", { className: "history-meta", children: it.note }),
                    it.ready && jsxDEV("span", { className: "ti-ready", children: "\u2713 Listo" }),
                    it.sale && jsxDEV("span", { className: "k-sale", children: "SALE" }),
                    jsxDEV("button", {
                      className: "remove history-remove",
                      title: "Eliminar (devuelve al stock)",
                      onClick: () => removeItem(dispatch, o, i, it),
                      children: jsxDEV(Trash2, { size: 14 })
                    })
                  ]
                }, i)
              )
            })
          ]
        }, o.id);
      })
    ]
  });
}
function setQty(dispatch, order, index, qty) {
  dispatch({ type: "SET_QTY", orderId: order.id, index, qty: Math.max(1, qty) });
}
// Always available, even after the line already went to the kitchen/bar —
// a mistyped comanda needs to be fixable and its stock returned regardless
// of status. Confirms first once it's out of the waiter's easy "new order"
// window, since removing it also pulls it off any ticket already printed.
function removeItem(dispatch, order, index, item) {
  if (order.status !== "new") {
    const ok = window.confirm(`Quitar ${item.qty}\u00d7 ${item.name}? Ya se envi\u00f3 a cocina/barra.`);
    if (!ok) return;
  }
  dispatch({ type: "REMOVE_ITEM", orderId: order.id, index });
}
function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
export {
  RegisterView as default
};
