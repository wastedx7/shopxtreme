// import { SellerLayout } from '@/components/layout';
// import { useSellerStats, useSellerProducts } from '@/hooks/useSeller';
// import { useSellerOrders } from '@/hooks/useOrders';
// import { Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react';

// export default function SellerDashboard() {
//   const { data: stats } = useSellerStats();
//   const { data: products } = useSellerProducts();
//   // const { data: orders } = useSellerOrders();
//   const { data: ordersData } = useSellerOrders();
//   const orders = Array.isArray(ordersData) ? ordersData : [];


//   const statCards = [
//     { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'bg-blue-500/10 text-blue-600' },
//     { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingBag, color: 'bg-primary/10 text-primary' },
//     { label: 'Total Revenue', value: `$${(stats?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'bg-success/10 text-success' },
//   ];

//   return (
//     <SellerLayout>
//       <div className="page-header">
//         <h1 className="page-title">Seller Dashboard</h1>
//         <p className="page-subtitle">Overview of your store performance</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         {statCards.map((stat, i) => (
//           <div key={i} className="stat-card">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground">{stat.label}</p>
//                 <p className="text-2xl font-bold mt-1">{stat.value}</p>
//               </div>
//               <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
//                 <stat.icon className="h-6 w-6" />
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         <div className="dashboard-card">
//           <h3 className="font-semibold mb-4">Recent Products</h3>
//           {products?.slice(0, 5).map((product) => (
//             <div key={product.id} className="flex items-center gap-3 py-2 border-b last:border-0">
//               <img src={product.images?.[0] || '/placeholder.svg'} alt="" className="w-10 h-10 rounded object-cover" />
//               <div className="flex-1 min-w-0">
//                 <p className="font-medium truncate">{product.name}</p>
//                 <p className="text-sm text-muted-foreground">${product.price}</p>
//               </div>
//             </div>
//           )) || <p className="text-muted-foreground">No products yet</p>}
//         </div>

//         <div className="dashboard-card">
//           <h3 className="font-semibold mb-4">Recent Orders</h3>
//           {orders?.slice(0, 5).map((order) => (
//             <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
//               <div>
//                 <p className="font-medium">#{order.id.slice(0, 8)}</p>
//                 <p className="text-sm text-muted-foreground">{order.status}</p>
//               </div>
//               <p className="font-bold">${order.totalAmount.toFixed(2)}</p>
//             </div>
//           )) || <p className="text-muted-foreground">No orders yet</p>}
//         </div>
//       </div>
//     </SellerLayout>
//   );
// }
import { SellerLayout } from '@/components/layout';
import { useSellerStats, useSellerProducts } from '@/hooks/useSeller';
import { useSellerOrders } from '@/hooks/useOrders';
import { Package, ShoppingBag, DollarSign } from 'lucide-react';

export default function SellerDashboard() {
  const { data: stats } = useSellerStats();
  const { data: productsData } = useSellerProducts();
  const { data: ordersData } = useSellerOrders();

  // Normalize to arrays so we never call .slice on non-arrays
  const products = Array.isArray(productsData) ? productsData : [];
  const orders = Array.isArray(ordersData) ? ordersData : [];

  const statCards = [
    {
      label: 'Total Products',
      value: stats?.totalProducts ?? 0,
      icon: Package,
      color: 'bg-blue-500/10 text-blue-600',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Total Revenue',
      value: `₹${Number(stats?.totalRevenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-success/10 text-success',
    },
  ];

  return (
    <SellerLayout>
      <div className="page-header">
        <h1 className="page-title">Seller Dashboard</h1>
        <p className="page-subtitle">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h3 className="font-semibold mb-4">Recent Products</h3>
          {products.length > 0 ? (
            products.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 py-2 border-b last:border-0"
              >
                <img
                  src={product.images?.[0] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{product.price}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No products yet</p>
          )}
        </div>

        <div className="dashboard-card">
          <h3 className="font-semibold mb-4">Recent Orders</h3>
          {orders.length > 0 ? (
            orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="font-medium">#{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.status}
                  </p>
                </div>
                <p className="font-bold">
                  ₹{Number(order.totalAmount ?? 0).toFixed(2)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No orders yet</p>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}
