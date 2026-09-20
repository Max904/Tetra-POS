import { useEffect, useRef } from "react";
import { playSaleAlert } from "./notify.js";
// Rings on KITCHEN / BAR devices when a waiter presses "Sale" for a
// category (order items newly flagged `sale`). A kitchen device only reacts
// to kitchen-station items and a bar device to bar-station items; waiter
// devices never ring. One ring per order per update, even if several lines
// were flagged together. The first pass after load only records state.
const itemKey = (it) => `${it.menuId}|${it.seat ?? ""}`;

function useSaleAlerts(orders, menu, deviceRole) {
  const prevRef = useRef(null);
  useEffect(() => {
    const prev = prevRef.current;
    const next = {};
    let rings = 0;
    for (const order of orders) {
      const saleKeys = order.items.filter((it) => it.sale).map(itemKey);
      next[order.id] = saleKeys;
      if (!prev || !prev[order.id]) continue;
      const fresh = order.items.filter((it) => it.sale && !prev[order.id].includes(itemKey(it)));
      const mine = fresh.some((it) => {
        const station = menu.find((m) => m.id === it.menuId)?.station || "kitchen";
        return station === deviceRole;
      });
      if (mine) rings += 1;
    }
    prevRef.current = next;
    if (deviceRole === "waiter") return;
    for (let i = 0; i < rings; i++) {
      setTimeout(() => playSaleAlert(), i * 700);
    }
  }, [orders, menu, deviceRole]);
}
export { useSaleAlerts };
