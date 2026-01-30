// // src/pages/seller/SellerOrders.tsx
// import { SellerLayout } from '@/components/layout';

// export default function SellerOrders() {
//   return (
//     <SellerLayout>
//       <h1 className="page-title">Orders</h1>
//       {/* later: list seller orders here */}
//     </SellerLayout>
//   );
// }
// src/pages/seller/SellerOrders.tsx
import { SellerLayout } from '@/components/layout';
import { useSellerOrders } from '@/hooks/useOrders';

export default function SellerOrders() {
  const { data: ordersData, isLoading, error } = useSellerOrders();

  // Normalize to array so we can safely map
  const orders = Array.isArray(ordersData) ? ordersData : [];

  return (
    <SellerLayout>
      <div className="page-header mb-4">
        <h1 className="page-title">Orders</h1>
        <p className="page-subtitle">Orders that include your products</p>
      </div>

      {isLoading && (
        <p className="text-muted-foreground">Loading orders...</p>
      )}

      {error && (
        <p className="text-red-500">Failed to load orders.</p>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <p className="text-muted-foreground">
          No orders yet for your products.
        </p>
      )}

      {!isLoading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <div>
                <p className="font-medium">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Status: {order.status}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  Total amount
                </p>
                <p className="font-bold">
                  ₹{Number(order.totalAmount ?? 0).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </SellerLayout>
  );
}
