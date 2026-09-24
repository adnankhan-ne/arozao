import { Order } from "@/types";
import { getSessionUser } from "@/lib/auth";

const STORAGE_KEY = "arozaoOrders";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getOrderById(id: string): Order | undefined {
  const orders = getOrders();
  return orders.find((order) => order.id === id);
}

export function getCustomerOrders(): Order[] {
  const user = getSessionUser();
  if (!user) return [];

  return getOrders().filter((order) => order.customerId === user.id || order.customerEmail === user.email);
}

export function saveOrder(order: Order): void {
  if (typeof window === "undefined") return;
  try {
    const user = getSessionUser();
    const hydratedOrder: Order = {
      ...order,
      customerId: order.customerId || user?.id,
      customerEmail: order.customerEmail || user?.email,
    };

    const existing = getOrders();
    const updated = [hydratedOrder, ...existing.filter((o) => o.id !== hydratedOrder.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save order to localStorage:", error);
  }
}
