import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useAddToCart } from '@/hooks/useCart';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isAuthenticated, isCustomer } = useAuth();
  const { toast } = useToast();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: wishlist } = useWishlist();

  const isInWishlist = wishlist?.some(p => p.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to add items to cart',
        variant: 'destructive',
      });
      return;
    }
    addToCart.mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => {
          toast({
            title: 'Added to cart',
            description: `${product.name} has been added to your cart`,
          });
        },
        onError: () => {
          toast({
            title: 'Error',
            description: 'Failed to add item to cart',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to add items to wishlist',
        variant: 'destructive',
      });
      return;
    }

    if (isInWishlist) {
      removeFromWishlist.mutate(product.id, {
        onSuccess: () => {
          toast({ title: 'Removed from wishlist' });
        },
      });
    } else {
      addToWishlist.mutate(product.id, {
        onSuccess: () => {
          toast({ title: 'Added to wishlist' });
        },
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'h-3.5 w-3.5',
          i < Math.round(rating) ? 'fill-current rating-star' : 'text-muted-foreground/30'
        )}
      />
    ));
  };

  const primaryImage = product.images?.[0] || '/placeholder.svg';

  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="card-product">
        {/* Image */}
        <div className="aspect-square relative overflow-hidden bg-muted">
          <img
            src={primaryImage}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          {/* Wishlist button */}
          {isCustomer && (
            <button
              onClick={handleToggleWishlist}
              className={cn(
                'absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-all',
                'hover:bg-background',
                isInWishlist ? 'text-destructive' : 'text-muted-foreground'
              )}
            >
              <Heart className={cn('h-4 w-4', isInWishlist && 'fill-current')} />
            </button>
          )}
          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Category */}
          <p className="text-xs text-muted-foreground">{product.category?.name}</p>

          {/* Name */}
          <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex">{renderStars(product.avgRating)}</div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Price & Cart */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {isCustomer && product.stock > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddToCart}
                disabled={addToCart.isPending}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
