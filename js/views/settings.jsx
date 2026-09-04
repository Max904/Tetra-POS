import { jsxDEV } from "react/jsx-dev-runtime";
import { useState } from "react";
import { Plus, Trash2, User, Square, ChefHat, Beer, ImageOff, Upload, Loader2 } from "lucide-react";
import { useStore, LOW_STOCK } from "./../store.js";
import { supabase } from "./../supabaseClient.js";

const MENU_IMAGE_BUCKET = "menu-images";

async function uploadMenuImage(file) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error: uploadError } = await supabase.storage
    .from(MENU_IMAGE_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from(MENU_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
function SettingsView() {
  return /* @__PURE__ */ jsxDEV("div", { className: "settings", children: [
    /* @__PURE__ */ jsxDEV("div", { className: "view-head", children: /* @__PURE__ */ jsxDEV("div", { children: [
      /* @__PURE__ */ jsxDEV("h1", { children: "Admin" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 10,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("p", { className: "hint", children: "Manage menu, stock, staff and floor plan." }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 11,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 9,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 8,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "setting-tabs-grid", children: [
      /* @__PURE__ */ jsxDEV(MenuManager, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 15,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(StaffManager, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 16,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(FloorManager, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 17,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV(InventoryPanel, {}, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 18,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 14,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 7,
    columnNumber: 5
  }, this);
}
function MenuManager() {
  const { state, dispatch } = useStore();
  const [name, setName] = useState("");
  const [category, setCategory] = useState(state.categories[0]);
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [station, setStation] = useState("kitchen");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [editing, setEditing] = useState(null);
  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setUploadError("");
    try {
      const url = await uploadMenuImage(file);
      setImageUrl(url);
    } catch (err) {
      console.error("Image upload failed:", err);
      setUploadError("Upload failed. Check the bucket is set up.");
    } finally {
      setUploading(false);
    }
  };
  const submit = () => {
    if (!name.trim()) return;
    const p = Math.max(0, parseFloat(price) || 0);
    const s = Math.max(0, parseInt(stock, 10) || 0);
    const img = imageUrl.trim() || null;
    if (editing) {
      dispatch({ type: "UPDATE_ITEM", id: editing, name: name.trim(), category, price: p, stock: s, station, imageUrl: img });
    } else {
      dispatch({ type: "ADD_ITEM", name: name.trim(), category, price: p, stock: s, station, imageUrl: img });
    }
    setEditing(null);
    setName("");
    setPrice("");
    setStock("");
    setStation("kitchen");
    setImageUrl("");
    setUploadError("");
  };
  const startEdit = (item) => {
    setEditing(item.id);
    setName(item.name);
    setCategory(item.category);
    setPrice(String(item.price));
    setStock(String(item.stock));
    setStation(item.station || "kitchen");
    setImageUrl(item.image_url || "");
  };
  return /* @__PURE__ */ jsxDEV("section", { className: "panel", children: [
    /* @__PURE__ */ jsxDEV("h2", { children: "Menu" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 57,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "form", children: [
      /* @__PURE__ */ jsxDEV("input", { placeholder: "Item name", value: name, onChange: (e) => setName(e.target.value) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 59,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxDEV("select", { value: category, onChange: (e) => setCategory(e.target.value), children: state.categories.map((c) => /* @__PURE__ */ jsxDEV("option", { children: c }, c, false, {
          fileName: "<stdin>",
          lineNumber: 63,
          columnNumber: 15
        }, this)) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 61,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("input", { type: "number", min: "0", step: "0.01", placeholder: "Price", value: price, onChange: (e) => setPrice(e.target.value) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 66,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("input", { type: "number", min: "0", placeholder: "Stock", value: stock, onChange: (e) => setStock(e.target.value) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 67,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 60,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "station-label", children: "Sends to:" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 68,
          columnNumber: 9
        }, this),
        /* @__PURE__ */ jsxDEV("div", { className: "station-toggle", role: "group", "aria-label": "Station", children: [
          /* @__PURE__ */ jsxDEV("button", { type: "button", className: `station-btn ${station === "kitchen" ? "active" : ""}`, onClick: () => setStation("kitchen"), children: [
            /* @__PURE__ */ jsxDEV(ChefHat, { size: 15 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 68,
              columnNumber: 11
            }, this),
            " Kitchen"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 68,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV("button", { type: "button", className: `station-btn ${station === "bar" ? "active" : ""}`, onClick: () => setStation("bar"), children: [
            /* @__PURE__ */ jsxDEV(Beer, { size: 15 }, void 0, false, {
              fileName: "<stdin>",
              lineNumber: 68,
              columnNumber: 11
            }, this),
            " Bar"
          ] }, void 0, true, {
            fileName: "<stdin>",
            lineNumber: 68,
            columnNumber: 11
          }, this)
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 68,
          columnNumber: 9
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 68,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "form-row image-row", children: [
        imageUrl ? /* @__PURE__ */ jsxDEV("img", { src: imageUrl, alt: "", className: "image-preview", onError: (e) => {
          e.target.style.display = "none";
        } }, void 0, false, {}, this) : /* @__PURE__ */ jsxDEV("span", { className: "image-preview placeholder", children: uploading ? /* @__PURE__ */ jsxDEV(Loader2, { size: 16, className: "spin" }, void 0, false, {}, this) : /* @__PURE__ */ jsxDEV(ImageOff, { size: 16 }, void 0, false, {}, this) }, void 0, false, {}, this),
        /* @__PURE__ */ jsxDEV("input", { placeholder: "Image URL (optional)", value: imageUrl, onChange: (e) => setImageUrl(e.target.value) }, void 0, false, {}, this),
        /* @__PURE__ */ jsxDEV("label", { className: "btn ghost upload-btn", children: [
          /* @__PURE__ */ jsxDEV(Upload, { size: 15 }, void 0, false, {}, this),
          uploading ? "Uploading\u2026" : "Upload photo",
          /* @__PURE__ */ jsxDEV("input", { type: "file", accept: "image/*", onChange: handleFileChange, disabled: uploading, style: { display: "none" } }, void 0, false, {}, this)
        ] }, void 0, true, {}, this)
      ] }, void 0, true, {}, this),
      uploadError && /* @__PURE__ */ jsxDEV("p", { className: "upload-error", children: uploadError }, void 0, false, {}, this),
      /* @__PURE__ */ jsxDEV("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxDEV("button", { className: "btn primary", onClick: submit, children: [
          /* @__PURE__ */ jsxDEV(Plus, { size: 16 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 71,
            columnNumber: 13
          }, this),
          " ",
          editing ? "Update item" : "Add item"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 70,
          columnNumber: 11
        }, this),
        editing && /* @__PURE__ */ jsxDEV("button", { className: "btn ghost", onClick: () => {
          setEditing(null);
          setName("");
          setPrice("");
          setStock("");
          setStation("kitchen");
          setImageUrl("");
          setUploadError("");
        }, children: "Cancel" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 73,
          columnNumber: 23
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 69,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 58,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "panel-list", children: state.menu.map((m) => /* @__PURE__ */ jsxDEV("div", { className: "pl-row", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "pl-main", children: [
        m.image_url ? /* @__PURE__ */ jsxDEV("img", { src: m.image_url, alt: "", className: "pl-photo", onError: (e) => {
          e.target.style.display = "none";
        } }, void 0, false, {}, this) : /* @__PURE__ */ jsxDEV("span", { className: "pl-photo placeholder", children: /* @__PURE__ */ jsxDEV(ImageOff, { size: 13 }, void 0, false, {}, this) }, void 0, false, {}, this),
        /* @__PURE__ */ jsxDEV("span", { className: "pl-name", children: m.name }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 81,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "pl-cat", children: m.category }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 82,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: `pl-station ${(m.station || "kitchen") === "bar" ? "bar" : "kitchen"}`, children: [
          (m.station || "kitchen") === "bar" ? /* @__PURE__ */ jsxDEV(Beer, { size: 12 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 82,
            columnNumber: 15
          }, this) : /* @__PURE__ */ jsxDEV(ChefHat, { size: 12 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 82,
            columnNumber: 15
          }, this),
          (m.station || "kitchen") === "bar" ? "Bar" : "Kitchen"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 82,
          columnNumber: 15
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 80,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "pl-stock", "data-kind": stockBadge(m.stock), children: m.stock <= 0 ? "Out" : m.stock <= LOW_STOCK ? `Low \xB7 ${m.stock}` : `${m.stock} in stock` }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 84,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "pl-price", children: [
        "$",
        m.price.toFixed(2)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 87,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "pl-edit", onClick: () => startEdit(m), children: "Edit" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 88,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "pl-del", onClick: () => dispatch({ type: "DELETE_ITEM", id: m.id }), children: /* @__PURE__ */ jsxDEV(Trash2, { size: 15 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 90,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 89,
        columnNumber: 13
      }, this)
    ] }, m.id, true, {
      fileName: "<stdin>",
      lineNumber: 79,
      columnNumber: 11
    }, this)) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 77,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 56,
    columnNumber: 5
  }, this);
}
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
function StaffManager() {
  const { state, dispatch } = useStore();
  const [name, setName] = useState("");
  const add = () => {
    const n = name.trim();
    if (n && !state.staff.includes(n)) {
      dispatch({ type: "ADD_STAFF", name: n });
      setName("");
    }
  };
  return /* @__PURE__ */ jsxDEV("section", { className: "panel", children: [
    /* @__PURE__ */ jsxDEV("h2", { children: "Staff" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 118,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "form", onSubmit: (e) => e.preventDefault(), children: /* @__PURE__ */ jsxDEV("div", { className: "form-row", children: [
      /* @__PURE__ */ jsxDEV("input", { placeholder: "Add waitstaff name", value: name, onChange: (e) => setName(e.target.value), onKeyDown: (e) => e.key === "Enter" && add() }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 121,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "btn primary", onClick: add, children: [
        /* @__PURE__ */ jsxDEV(Plus, { size: 16 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 123,
          columnNumber: 13
        }, this),
        " Add"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 122,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 120,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 119,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "panel-list", children: state.staff.map((s) => /* @__PURE__ */ jsxDEV("div", { className: "pl-row", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "pl-main", children: [
        /* @__PURE__ */ jsxDEV(User, { size: 14 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 130,
          columnNumber: 39
        }, this),
        " ",
        /* @__PURE__ */ jsxDEV("span", { className: "pl-name", children: s }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 130,
          columnNumber: 58
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 130,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "pl-stock ok", children: s === state.currentStaff ? "Active" : "" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 131,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "pl-del", onClick: () => dispatch({ type: "REMOVE_STAFF", name: s }), children: /* @__PURE__ */ jsxDEV(Trash2, { size: 15 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 133,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 132,
        columnNumber: 13
      }, this)
    ] }, s, true, {
      fileName: "<stdin>",
      lineNumber: 129,
      columnNumber: 11
    }, this)) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 127,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 117,
    columnNumber: 5
  }, this);
}
function FloorManager() {
  const { state, dispatch } = useStore();
  const [name, setName] = useState("");
  const [zone, setZone] = useState("Main");
  const [caps, setCaps] = useState("4");
  const add = () => {
    const n = name.trim();
    if (n) {
      dispatch({ type: "ADD_TABLE", name: n, zone, capacity: parseInt(caps, 10) || 4 });
      setName("");
    }
  };
  return /* @__PURE__ */ jsxDEV("section", { className: "panel", children: [
    /* @__PURE__ */ jsxDEV("h2", { children: "Floor Plan" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 158,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "form", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxDEV("input", { placeholder: "Table name (e.g. Table 7)", value: name, onChange: (e) => setName(e.target.value) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 161,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("input", { type: "number", min: "1", value: caps, onChange: (e) => setCaps(e.target.value), title: "Seats" }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 162,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 160,
        columnNumber: 9
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "form-row", children: [
        /* @__PURE__ */ jsxDEV("select", { value: zone, onChange: (e) => setZone(e.target.value), children: ["Main", "Patio", "Bar", "Window"].map((z) => /* @__PURE__ */ jsxDEV("option", { children: z }, z, false, {
          fileName: "<stdin>",
          lineNumber: 167,
          columnNumber: 15
        }, this)) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 165,
          columnNumber: 11
        }, this),
        /* @__PURE__ */ jsxDEV("button", { className: "btn primary", onClick: add, children: [
          /* @__PURE__ */ jsxDEV(Plus, { size: 16 }, void 0, false, {
            fileName: "<stdin>",
            lineNumber: 171,
            columnNumber: 13
          }, this),
          " Add table"
        ] }, void 0, true, {
          fileName: "<stdin>",
          lineNumber: 170,
          columnNumber: 11
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 164,
        columnNumber: 9
      }, this)
    ] }, void 0, true, {
      fileName: "<stdin>",
      lineNumber: 159,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "panel-list", children: state.tables.map((t) => /* @__PURE__ */ jsxDEV("div", { className: "pl-row", children: [
      /* @__PURE__ */ jsxDEV("span", { className: "pl-main", children: [
        /* @__PURE__ */ jsxDEV(Square, { size: 14 }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 179,
          columnNumber: 39
        }, this),
        " ",
        /* @__PURE__ */ jsxDEV("span", { className: "pl-name", children: t.name }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 179,
          columnNumber: 60
        }, this)
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 179,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("span", { className: "pl-cat", children: [
        t.zone,
        " \xB7 ",
        t.capacity,
        " seats"
      ] }, void 0, true, {
        fileName: "<stdin>",
        lineNumber: 180,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "pl-edit", onClick: () => {
        const nn = prompt(`Rename ${t.name}:`, t.name);
        if (nn && nn.trim()) dispatch({ type: "RENAME_TABLE", id: t.id, name: nn.trim() });
      }, children: "Rename" }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 181,
        columnNumber: 13
      }, this),
      /* @__PURE__ */ jsxDEV("button", { className: "pl-del", onClick: () => dispatch({ type: "DELETE_TABLE", id: t.id }), children: /* @__PURE__ */ jsxDEV(Trash2, { size: 15 }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 185,
        columnNumber: 15
      }, this) }, void 0, false, {
        fileName: "<stdin>",
        lineNumber: 184,
        columnNumber: 13
      }, this)
    ] }, t.id, true, {
      fileName: "<stdin>",
      lineNumber: 178,
      columnNumber: 11
    }, this)) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 176,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 157,
    columnNumber: 5
  }, this);
}
function InventoryPanel() {
  const { state } = useStore();
  return /* @__PURE__ */ jsxDEV("section", { className: "panel", children: [
    /* @__PURE__ */ jsxDEV("h2", { children: "Inventory" }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 198,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("div", { className: "panel-list", children: state.menu.map((m) => {
      const b = stockBadgeInfo(m.stock);
      return /* @__PURE__ */ jsxDEV("div", { className: "pl-row", children: [
        /* @__PURE__ */ jsxDEV("span", { className: "pl-main", children: /* @__PURE__ */ jsxDEV("span", { className: "pl-name", children: m.name }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 204,
          columnNumber: 41
        }, this) }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 204,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: `badge ${b.cls}`, children: b.label }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 205,
          columnNumber: 15
        }, this),
        /* @__PURE__ */ jsxDEV("span", { className: "pl-stock", "data-kind": b.cls, children: m.stock }, void 0, false, {
          fileName: "<stdin>",
          lineNumber: 206,
          columnNumber: 15
        }, this)
      ] }, m.id, true, {
        fileName: "<stdin>",
        lineNumber: 203,
        columnNumber: 13
      }, this);
    }) }, void 0, false, {
      fileName: "<stdin>",
      lineNumber: 199,
      columnNumber: 7
    }, this)
  ] }, void 0, true, {
    fileName: "<stdin>",
    lineNumber: 197,
    columnNumber: 5
  }, this);
}
export {
  SettingsView as default
};
