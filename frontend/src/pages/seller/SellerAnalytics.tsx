// src/pages/seller/SellerAnalytics.tsx
import { SellerLayout } from '@/components/layout';
import { useSellerStats } from '@/hooks/useSeller';
import { TrendingUp, ShoppingBag, Package, DollarSign } from 'lucide-react';

export default function SellerAnalytics() {
  const { data: stats, isLoading, error } = useSellerStats();

  return (
    <SellerLayout>
      <div className="page-header mb-6 flex items-center justify-between">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">
            High-level view of your store performance
          </p>
        </div>
      </div>

      {isLoading && (
        <p className="text-muted-foreground">Loading analytics...</p>
      )}
      {error && (
        <p className="text-red-500">Failed to load analytics.</p>
      )}

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">
                  ₹{Number(stats.totalRevenue ?? 0).toFixed(2)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold mt-1">
                  {stats.totalOrders}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="text-2xl font-bold mt-1">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Package className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && !stats && (
        <p className="text-muted-foreground">No analytics data yet.</p>
      )}
    </SellerLayout>
  );
}
