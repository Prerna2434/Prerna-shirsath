import { describe, it, expect } from 'vitest';
import { INITIAL_DISPENSARY_STOCK, INITIAL_LIVE_ORDERS } from '../data/mockData';
import { DispensaryStockItem, DispensaryOrder } from '../types';

// Helper logic mirroring DispensaryMatrixView operations
function adjustInventory(
  items: DispensaryStockItem[],
  itemId: string,
  delta: number
): DispensaryStockItem[] {
  return items.map((item) => {
    if (item.id === itemId) {
      const updatedUnits = Math.max(0, item.inStockUnits + delta);
      return {
        ...item,
        inStockUnits: updatedUnits,
        isLowStock: updatedUnits < 50,
      };
    }
    return item;
  });
}

function matchMetroLowPrice(
  items: DispensaryStockItem[],
  itemId: string
): DispensaryStockItem[] {
  return items.map((item) => {
    if (item.id === itemId) {
      return { ...item, yourPrice: item.metroLow };
    }
    return item;
  });
}

function createPurchaseOrderReorder(
  items: DispensaryStockItem[],
  itemId: string,
  reorderUnits: number = 250
): { updatedItems: DispensaryStockItem[]; poNumber: string } {
  const poNumber = 'PO-2026-' + Math.floor(1000 + Math.random() * 9000);
  const updatedItems = items.map((i) => {
    if (i.id === itemId) {
      return { ...i, inStockUnits: i.inStockUnits + reorderUnits, isLowStock: false };
    }
    return i;
  });
  return { updatedItems, poNumber };
}

function dispatchDispensaryOrder(
  orders: DispensaryOrder[],
  orderId: string
): DispensaryOrder[] {
  return orders.map((order) => {
    if (order.id === orderId) {
      return {
        ...order,
        isDispatched: true,
        trackingId: 'TRK-' + Math.floor(100000 + Math.random() * 900000),
      };
    }
    return order;
  });
}

function filterOrders(
  orders: DispensaryOrder[],
  status: 'ALL' | 'PENDING' | 'DISPATCHED'
): DispensaryOrder[] {
  return orders.filter((o) => {
    if (status === 'PENDING') return !o.isDispatched;
    if (status === 'DISPATCHED') return !!o.isDispatched;
    return true;
  });
}

function filterStockItems(
  items: DispensaryStockItem[],
  searchTerm: string
): DispensaryStockItem[] {
  const term = searchTerm.toLowerCase();
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(term) ||
      item.genericName.toLowerCase().includes(term)
  );
}

describe('Dispensary Inventory & Pharmacy Matrix Engine', () => {
  describe('Stock Item Thresholds and Inventory Adjustments', () => {
    it('accurately increments and decrements in-stock units', () => {
      const initial = [...INITIAL_DISPENSARY_STOCK];
      const targetId = 'stock-1';
      const initialUnits = initial.find((i) => i.id === targetId)!.inStockUnits;

      const incremented = adjustInventory(initial, targetId, 50);
      expect(incremented.find((i) => i.id === targetId)!.inStockUnits).toBe(
        initialUnits + 50
      );

      const decremented = adjustInventory(incremented, targetId, -30);
      expect(decremented.find((i) => i.id === targetId)!.inStockUnits).toBe(
        initialUnits + 20
      );
    });

    it('prevents stock units from dropping below zero', () => {
      const initial = [...INITIAL_DISPENSARY_STOCK];
      const targetId = 'stock-4'; // Amoxicillin with 14 units

      const result = adjustInventory(initial, targetId, -100);
      const item = result.find((i) => i.id === targetId)!;
      expect(item.inStockUnits).toBe(0);
      expect(item.isLowStock).toBe(true);
    });

    it('automatically flags low-stock alert when count is strictly below 50 units', () => {
      const initial = [...INITIAL_DISPENSARY_STOCK];
      const targetId = 'stock-2'; // 185 units

      // Reduce to 49 units
      const currentUnits = initial.find((i) => i.id === targetId)!.inStockUnits;
      const result = adjustInventory(initial, targetId, -(currentUnits - 49));
      const item = result.find((i) => i.id === targetId)!;

      expect(item.inStockUnits).toBe(49);
      expect(item.isLowStock).toBe(true);

      // Increase above threshold (55 units)
      const restocked = adjustInventory(result, targetId, 6);
      expect(restocked.find((i) => i.id === targetId)!.isLowStock).toBe(false);
    });
  });

  describe('Metro Lowest Generic Price Matching', () => {
    it('matches yourPrice to metroLow price for competitive pharmacy routing', () => {
      const initial = [...INITIAL_DISPENSARY_STOCK];
      const targetId = 'stock-2'; // Metformin with yourPrice 8.90, metroLow 8.40

      const updated = matchMetroLowPrice(initial, targetId);
      const matchedItem = updated.find((i) => i.id === targetId)!;

      expect(matchedItem.yourPrice).toBe(matchedItem.metroLow);
      expect(matchedItem.yourPrice).toBe(8.40);
    });
  });

  describe('Wholesale Purchase Order Reorder Logic', () => {
    it('generates valid PO number and restocks 250 units clearing low-stock flag', () => {
      const initial = [...INITIAL_DISPENSARY_STOCK];
      const targetId = 'stock-4'; // Amoxicillin (low stock: 14 units)

      const { updatedItems, poNumber } = createPurchaseOrderReorder(initial, targetId, 250);
      const reorderedItem = updatedItems.find((i) => i.id === targetId)!;

      expect(poNumber).toMatch(/^PO-2026-\d{4}$/);
      expect(reorderedItem.inStockUnits).toBe(14 + 250);
      expect(reorderedItem.isLowStock).toBe(false);
    });
  });

  describe('Live Prescription Order Dispatch & Tracking', () => {
    it('dispatches pending order and assigns valid TRK- courier tracking number', () => {
      const orders = [...INITIAL_LIVE_ORDERS];
      const orderId = 'ord-9082';

      expect(orders.find((o) => o.id === orderId)!.isDispatched).toBeFalsy();

      const dispatchedOrders = dispatchDispensaryOrder(orders, orderId);
      const targetOrder = dispatchedOrders.find((o) => o.id === orderId)!;

      expect(targetOrder.isDispatched).toBe(true);
      expect(targetOrder.trackingId).toMatch(/^TRK-\d{6}$/);
    });

    it('filters orders correctly between ALL, PENDING, and DISPATCHED', () => {
      let orders = [...INITIAL_LIVE_ORDERS];
      expect(filterOrders(orders, 'ALL').length).toBe(orders.length);
      expect(filterOrders(orders, 'PENDING').length).toBe(orders.length);
      expect(filterOrders(orders, 'DISPATCHED').length).toBe(0);

      // Dispatch 1 order
      orders = dispatchDispensaryOrder(orders, 'ord-9082');
      expect(filterOrders(orders, 'PENDING').length).toBe(orders.length - 1);
      expect(filterOrders(orders, 'DISPATCHED').length).toBe(1);
    });
  });

  describe('Dispensary Formulary Search Filtering', () => {
    it('finds items by brand trade name or generic active molecule', () => {
      const items = INITIAL_DISPENSARY_STOCK;

      const statinResults = filterStockItems(items, 'Atorvastatin');
      expect(statinResults.length).toBeGreaterThanOrEqual(1);
      expect(statinResults[0].id).toBe('stock-1');

      const equivalentResults = filterStockItems(items, 'Lipitor');
      expect(equivalentResults.length).toBeGreaterThanOrEqual(1);

      const antibioticResults = filterStockItems(items, 'Amoxicillin');
      expect(antibioticResults.length).toBe(1);
      expect(antibioticResults[0].id).toBe('stock-4');

      const noResults = filterStockItems(items, 'NonExistentDrug12345');
      expect(noResults.length).toBe(0);
    });
  });
});
