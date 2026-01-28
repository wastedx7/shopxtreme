import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ProductGrid } from '@/components/products';
import { useWishlist } from '@/hooks/useWishlist';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();

  return (
    <MainLayout>
      <div className="container-main py-8">
        <div className="page-header">
          <h1 className="page-title">My Wishlist</h1>
          <p className="page-subtitle">Products you've saved for later</p>
        </div>

        {isLoading ? (
          <ProductGrid products={[]} loading />
        ) : wishlist && wishlist.length > 0 ? (
          <ProductGrid products={wishlist} />
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <Heart className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">
              Save products you love by clicking the heart icon.
            </p>
            <Link to="/products">
              <button className="btn-hero px-6 py-2 rounded-lg">Browse Products</button>
            </Link>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
