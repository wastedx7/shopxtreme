// src/pages/seller/SellerProductForm.tsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SellerLayout } from '@/components/layout';
import { useCreateProduct, useUpdateProduct } from '@/hooks/useSeller';
import { productsApi } from '@/api/products';
import { useToast } from '@/components/ui/use-toast';
// TODO: replace this with real categories fetched from backend
const categories = [
  {
    id: '123',
    name: 'Default Category',
  },
];

type ProductFormState = {
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  imageUrl: string; // single URL for now
  categoryId: string;
};

export default function SellerProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [form, setForm] = useState<ProductFormState>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    sku: '',
    imageUrl: '',
    categoryId: '',
  });

  const [loadingProduct, setLoadingProduct] = useState(false);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  // Load existing product when editing
  useEffect(() => {
    if (!isEdit || !id) return;

    setLoadingProduct(true);
    productsApi
      .getProduct(id)
      .then((product) => {
        setForm({
          name: product.name || '',
          description: product.description || '',
          price: product.price || 0,
          stock: product.stock || 0,
          sku: product.sku || '',
          imageUrl: product.images?.[0] || '',
          categoryId: product.categoryId || '',
        });
      })
      .finally(() => setLoadingProduct(false));
  }, [id, isEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'stock'
          ? value === '' ? 0 : Number(value)
          : value,
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      description: form.description,
      price: form.price,
      stock: form.stock,
      sku: form.sku,
      images: form.imageUrl ? [form.imageUrl] : [],
      categoryId: form.categoryId,
      // add categoryId or other fields if your backend requires them
    };

    if (isEdit && id) {
      updateMutation.mutate(
        { id, data: payload },
        {
          onSuccess: () => {
            toast({ title: 'Product updated' });
            navigate('/seller/products');
          },
          onError: () => {
            toast({
              title: 'Failed to update product',
              variant: 'destructive',
            });
          },
        },
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => {
          toast({ title: 'Product created' });
          navigate('/seller/products');
        },
        onError: () => {
          toast({
            title: 'Failed to create product',
            variant: 'destructive',
          });
        },
      });
    }
  };

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading;

  return (
    <SellerLayout>
      <div className="page-header mb-6 flex items-center justify-between">
        <div>
          <h1 className="page-title">
            {isEdit ? 'Edit Product' : 'Add Product'}
          </h1>
          <p className="page-subtitle">
            {isEdit
              ? 'Update information about your product'
              : 'Create a new product for your store'}
          </p>
        </div>
      </div>

      {loadingProduct ? (
        <p className="text-muted-foreground">Loading product...</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl space-y-6 bg-card p-6 rounded-lg border shadow-sm"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input"
                placeholder="iPhone 15 Pro"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">SKU</label>
              <input
                name="sku"
                value={form.sku}
                onChange={handleChange}
                className="input"
                placeholder="IPH-15-PRO-256"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input min-h-[120px]"
              placeholder="Describe your product..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price (₹)</label>
              <input
                type="number"
                min={0}
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock</label>
              <input
                type="number"
                min={0}
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select
                name="categoryId"
                value={form.categoryId}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL</label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                className="input"
                placeholder="https://..."
              />
            </div>
          </div>

          {form.imageUrl && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Preview</p>
              <img
                src={form.imageUrl}
                alt="Preview"
                className="w-32 h-32 rounded object-cover border"
              />
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/seller/products')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEdit
                  ? 'Saving...'
                  : 'Creating...'
                : isEdit
                  ? 'Save changes'
                  : 'Create product'}
            </button>
          </div>
        </form>
      )}
    </SellerLayout>
  );
}
