import { AdminLayout } from '@/components/layout';
import { useAdminStats } from '@/hooks/useAdmin';
import { Users, ShoppingBag, DollarSign, Package, Store, UserCheck } from 'lucide-react';

export default function AdminDashboard() {
  const { data: stats } = useAdminStats();

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users },
    { label: 'Customers', value: stats?.totalCustomers || 0, icon: UserCheck },
    { label: 'Sellers', value: stats?.totalSellers || 0, icon: Store },
    { label: 'Products', value: stats?.totalProducts || 0, icon: Package },
    { label: 'Orders', value: stats?.totalOrders || 0, icon: ShoppingBag },
    { label: 'Revenue', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign },
  ];

  return (
    <AdminLayout>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
