import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  FolderTree,
  ShoppingBag,
  UserCheck,
  Settings,
  BarChart3
} from 'lucide-react';

const adminNavItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/categories', icon: FolderTree, label: 'Categories' },
  { to: '/admin/sellers/pending', icon: UserCheck, label: 'Pending Sellers' },
  { to: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <h2 className="text-lg font-semibold text-sidebar-foreground mb-1">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">Manage your platform</p>
      </div>

      <nav className="px-2 space-y-1">
        {adminNavItems.map((item) => (
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
