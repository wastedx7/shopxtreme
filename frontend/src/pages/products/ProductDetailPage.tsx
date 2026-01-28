import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { StarRating } from '@/components/products';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProduct } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { useProductReviews, useCreateReview } from '@/hooks/useReviews';
import { useAddToWishlist, useRemoveFromWishlist, useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  ShoppingCart, 
  Heart, 
  Minus, 
  Plus, 
  ChevronRight,
  Loader2,
  Store,
  Package,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isCustomer } = useAuth();
  const { toast } = useToast();

  const { data: product, isLoading: productLoading } = useProduct(id!);
  const { data: reviews } = useProductReviews(id!);
  const { data: wishlist } = useWishlist();
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const createReview = useCreateReview();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  const isInWishlist = wishlist?.some(p => p.id === product?.id);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to add items to cart',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    addToCart.mutate(
      { productId: product!.id, quantity },
      {
        onSuccess: () => {
          toast({
            title: 'Added to cart',
            description: `${product!.name} has been added to your cart`,
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

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Login required',
        description: 'Please login to add items to wishlist',
        variant: 'destructive',
      });
      return;
    }

    if (isInWishlist) {
      removeFromWishlist.mutate(product!.id);
    } else {
      addToWishlist.mutate(product!.id);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) return;

    createReview.mutate(
      { productId: product!.id, data: newReview },
      {
        onSuccess: () => {
          toast({ title: 'Review submitted!' });
          setNewReview({ rating: 5, comment: '' });
        },
        onError: (error: any) => {
          toast({
            title: 'Error',
            description: error.response?.data?.message || 'You may need to purchase this product first',
            variant: 'destructive',
          });
        },
      }
    );
  };

  if (productLoading) {
    return (
      <MainLayout>
        <div className="container-main py-8">
          <div className="animate-pulse grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-6 bg-muted rounded w-1/3" />
              <div className="h-24 bg-muted rounded" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container-main py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  const images = product.images?.length > 0 ? product.images : ['/placeholder.svg'];

  return (
    <MainLayout>
      <div className="container-main py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <ChevronRight className="h-4 w-4" />
          {product.category && (
            <>
              <Link to={`/categories/${product.category.id}`} className="hover:text-foreground">
                {product.category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    )}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category?.name}</p>
              <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <StarRating rating={product.avgRating} />
              <span className="text-sm text-muted-foreground">
                ({product.reviewsCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Seller info */}
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{product.seller?.shopName}</p>
                {product.seller?.verified && (
                  <div className="flex items-center gap-1 text-xs text-success">
                    <Check className="h-3 w-3" />
                    Verified Seller
                  </div>
                )}
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className={cn(
                'text-sm',
                product.stock > 10 ? 'text-success' : product.stock > 0 ? 'text-warning' : 'text-destructive'
              )}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
            </div>

            {/* Actions */}
            {isCustomer && product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    size="lg" 
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={addToCart.isPending}
                  >
                    {addToCart.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingCart className="mr-2 h-4 w-4" />
                    )}
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleToggleWishlist}
                    className={cn(isInWishlist && 'text-destructive border-destructive')}
                  >
                    <Heart className={cn('h-5 w-5', isInWishlist && 'fill-current')} />
                  </Button>
                </div>
              </div>
            )}

            {!isAuthenticated && (
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground mb-3">Login to add items to cart</p>
                <Link to="/login">
                  <Button>Login</Button>
                </Link>
              </div>
            )}

            {/* SKU */}
            <p className="text-sm text-muted-foreground">
              SKU: {product.sku}
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-16">
          <h2 className="section-heading mb-6">Customer Reviews</h2>
          
          {/* Review Form */}
          {isCustomer && (
            <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-muted/30 rounded-xl">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Your Rating</p>
                  <StarRating
                    rating={newReview.rating}
                    onChange={(rating) => setNewReview({ ...newReview, rating })}
                    interactive
                    size="lg"
                  />
                </div>
                <Textarea
                  placeholder="Share your experience with this product..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  rows={4}
                />
                <Button type="submit" disabled={createReview.isPending}>
                  {createReview.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          {reviews && reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {review.customer.firstName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{review.customer.firstName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                  <p className="mt-3 text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
