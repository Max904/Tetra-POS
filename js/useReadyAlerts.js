import { useEffect, useRef, useState } from "react";
import { playReadyBell } from "./notify.js";

// Watches every order's overall status (computed in store.js as the worst of
// its kitchen/bar sub-statuses) for the moment it FIRST becomes "ready" —
// meaning every station that had items on the ticket is done and the whole
// order is ready to be carried to the table. That transition rings the bell,
// but only on devices configured as "waiter" (deviceRole === "waiter").
// Kitchen and Bar Display screens pass their own deviceRole in here too, so
// this hook still tracks the list for them, it just never plays the sound.
function useReadyAlerts(orders, deviceRole) {
  const prevStatusRef = useRef({});
  const [readyOrders, setReadyOrders] = useState([]);

  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    const nextStatus = {};
    let justBecameReady = false;

    for (const order of orders) {
      nextStatus[order.id] = order.status;
      const wasReady = prevStatus[order.id] === "ready";
      if (order.status === "ready" && prevStatus[order.id] && !wasReady) {
        justBecameReady = true;
      }
    }
    prevStatusRef.current = nextStatus;

    if (justBecameReady && deviceRole === "waiter") {
      playReadyBell();
    }

    setReadyOrders(orders.filter((o) => o.status === "ready" && !o.paid));
  }, [orders, deviceRole]);

  return readyOrders;
}

export { useReadyAlerts };
