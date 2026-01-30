import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import CustomerRegisterPage from "./pages/auth/CustomerRegisterPage";
import SellerRegisterPage from "./pages/auth/SellerRegisterPage";
import ProductsPage from "./pages/products/ProductsPage";
import ProductDetailPage from "./pages/products/ProductDetailPage";
import CategoryPage from "./pages/products/CategoryPage";
import CartPage from "./pages/customer/CartPage";
import AccountPage from "./pages/customer/AccountPage";
import OrdersPage from "./pages/customer/OrdersPage";
import OrderDetailPage from "./pages/customer/OrderDetailPage";
import WishlistPage from "./pages/customer/WishlistPage";
// import SellerDashboard from "./pages/seller/SellerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/NotFound";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerProducts from "./pages/seller/SellerProducts";
import SellerProductForm from "./pages/seller/SellerProductForm";
import SellerAnalytics from "./pages/seller/SellerAnalytics";
import SellerOrders from "./pages/seller/SellerOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register/customer" element={<CustomerRegisterPage />} />
            <Route path="/register/seller" element={<SellerRegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/categories/:id" element={<CategoryPage />} />

            {/* Customer Routes */}
            <Route path="/cart" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}><CartPage /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}><AccountPage /></ProtectedRoute>} />
            <Route path="/account/orders" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}><OrdersPage /></ProtectedRoute>} />
            <Route path="/account/orders/:id" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/account/wishlist" element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']}><WishlistPage /></ProtectedRoute>} />

            {/* Seller Routes */}
            <Route path="/seller" element={<ProtectedRoute allowedRoles={['ROLE_SELLER']}><SellerDashboard /></ProtectedRoute>} />
            <Route
              path="/seller/products"
              element={
                <ProtectedRoute allowedRoles={['ROLE_SELLER']}>
                  <SellerProducts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/products/new"
              element={
                <ProtectedRoute allowedRoles={['ROLE_SELLER']}>
                  <SellerProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/products/:id/edit"
              element={
                <ProtectedRoute allowedRoles={['ROLE_SELLER']}>
                  <SellerProductForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/analytics"
              element={
                <ProtectedRoute allowedRoles={['ROLE_SELLER']}>
                  <SellerAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seller/orders"
              element={
                <ProtectedRoute allowedRoles={['ROLE_SELLER']}>
                  <SellerOrders />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}><AdminDashboard /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
