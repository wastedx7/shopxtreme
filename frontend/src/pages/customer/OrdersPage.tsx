import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { useCustomerOrders } from '@/hooks/useOrders';
import { Package } from 'lucide-react';

export default function OrdersPage() {
  const { data: orders, isLoading } = useCustomerOrders();

  return (
    <MainLayout>
      <div className="container-main py-8">
        <div className="max-w-4xl mx-auto">
          <div className="page-header">
            <h1 className="page-title">My Orders</h1>
            <p className="page-subtitle">View and track your orders</p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/account/orders/${order.id}`}
                  className="block dashboard-card hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} items
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <OrderStatusBadge status={order.status} />
                      <p className="text-lg font-bold mt-1">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <Package className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">
                Start shopping to see your orders here.
              </p>
              <Link to="/products">
                <button className="btn-hero px-6 py-2 rounded-lg">Browse Products</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
