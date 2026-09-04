import { useEffect, useRef, useState } from "react";
import { playReadyBell } from "./notify.js";
// Watches each order's KITCHEN and BAR sub-status independently (instead of
// the combined order.status computed in store.js, which only reads "ready"
// once BOTH stations are done). That way a ticket with only kitchen items
// rings as soon as the kitchen is ready, one with only bar items rings as
// soon as the bar is ready, and a ticket with items on both stations rings
// TWICE — once per station, whenever each one independently flips to
// "ready" — rather than waiting for whichever station is slower.
// A station's status only ever reaches "ready" if that order actually has
// items for that station (Kitchen/Bar Display only show tickets — and only
// expose the "Mark Ready" button — for stations that have items on them),
// so no applicability check is needed here: a non-applicable station's
// status just never moves off its default.
// Rings only on devices configured as "waiter" (deviceRole === "waiter").
// Kitchen and Bar Display screens pass their own deviceRole in here too, so
// this hook still tracks the list for them, it just never plays the sound.
function useReadyAlerts(orders, deviceRole) {
  const prevStatusRef = useRef({});
  const [readyOrders, setReadyOrders] = useState([]);
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    const nextStatus = {};
    let ringCount = 0;
    for (const order of orders) {
      const prevKitchen = prevStatus[order.id]?.kitchen;
      const prevBar = prevStatus[order.id]?.bar;
      nextStatus[order.id] = { kitchen: order.kitchenStatus, bar: order.barStatus };
      if (order.kitchenStatus === "ready" && prevKitchen && prevKitchen !== "ready") {
        ringCount += 1;
      }
      if (order.barStatus === "ready" && prevBar && prevBar !== "ready") {
        ringCount += 1;
      }
    }
    prevStatusRef.current = nextStatus;
    if (ringCount && deviceRole === "waiter") {
      // Stagger multiple dings (e.g. kitchen + bar on the same ticket, or two
      // separate tickets landing in the same tick) so they're heard as
      // distinct rings instead of overlapping into one muddy tone.
      for (let i = 0; i < ringCount; i++) {
        setTimeout(() => playReadyBell(), i * 650);
      }
    }
    setReadyOrders(
      orders.filter((o) => !o.paid && (o.kitchenStatus === "ready" || o.barStatus === "ready"))
    );
  }, [orders, deviceRole]);
  return readyOrders;
}
export { useReadyAlerts };
