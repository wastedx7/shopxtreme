import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  BarChart3,
  Plus,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const sellerNavItems = [
  { to: '/seller', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/seller/products', icon: Package, label: 'Products' },
  { to: '/seller/products/new', icon: Plus, label: 'Add Product' },
  { to: '/seller/orders', icon: ShoppingBag, label: 'Orders' },
  { to: '/seller/analytics', icon: BarChart3, label: 'Analytics' },
];


export function SellerSidebar() {
  const location = useLocation();
  const { user } = useAuth();
  const isVerified = user?.verified !== false;

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-sidebar-foreground mb-1">Seller Dashboard</h2>
        <p className="text-sm text-muted-foreground">Manage your store</p>
      </div>

      {!isVerified && (
        <div className="mx-4 mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-warning-foreground">Pending Verification</p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Your products may not be visible until verified.
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="px-2 space-y-1">
        {sellerNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
