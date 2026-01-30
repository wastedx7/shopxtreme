// src/pages/seller/SellerProducts.tsx
import { SellerLayout } from '@/components/layout';
import { Link } from 'react-router-dom';
import { useSellerProducts, useDeleteProduct } from '@/hooks/useSeller';
import { useToast } from '@/components/ui/use-toast';

export default function SellerProducts() {
  const { data: productsData, isLoading, error } = useSellerProducts();
  const deleteMutation = useDeleteProduct();
  const { toast } = useToast();

  const products = Array.isArray(productsData) ? productsData : [];

  const handleDelete = (id: string) => {
    if (!confirm('Delete this product?')) return;
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast({ title: 'Product deleted' });
      },
      onError: () => {
        toast({
          title: 'Failed to delete product',
          variant: 'destructive',
        });
      },
    });
  };

  return (
    <SellerLayout>
      <div className="page-header mb-6 flex items-center justify-between">
        <div>
          <h1 className="page-title">Your Products</h1>
          <p className="page-subtitle">
            Manage the catalogue visible to your customers
          </p>
        </div>
        <Link to="/seller/products/new" className="btn btn-primary">
          Add Product
        </Link>
      </div>

      {isLoading && (
        <p className="text-muted-foreground">Loading products...</p>
      )}
      {error && (
        <p className="text-red-500">Failed to load products.</p>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="border rounded-lg p-6 text-center text-muted-foreground">
          <p>No products yet.</p>
          <p className="mt-1">
            Click <span className="font-medium">Add Product</span> to create
            your first listing.
          </p>
        </div>
      )}

      {products.length > 0 && (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border rounded-lg p-3 bg-card shadow-sm"
            >
              <div className="flex items-center gap-3">
                <img
                  src={product.images?.[0] || '/placeholder.svg'}
                  alt={product.name}
                  className="w-14 h-14 rounded object-cover border"
                />
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ₹{product.price} • Stock: {product.stock}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    product.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
                <Link
                  to={`/seller/products/${product.id}/edit`}
                  className="text-sm text-primary hover:underline"
                >
                  Edit
                </Link>
                <button
                  type="button"
                  className="text-sm text-red-600 hover:underline"
                  onClick={() => handleDelete(product.id)}
                  disabled={deleteMutation.isLoading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </SellerLayout>
  );
}
