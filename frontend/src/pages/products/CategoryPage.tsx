import { useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ProductGrid } from '@/components/products';
import { useCategoryProducts, useCategories } from '@/hooks/useProducts';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const { data: productsData, isLoading } = useCategoryProducts(id!);
  const { data: categories } = useCategories();

  const category = categories?.find(c => c.id === id) || 
    categories?.flatMap(c => c.children).find(c => c?.id === id);

  return (
    <MainLayout>
      <div className="container-main py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{category?.name || 'Category'}</span>
        </nav>

        <div className="page-header">
          <h1 className="page-title">{category?.name || 'Category'}</h1>
          {category?.description && (
            <p className="page-subtitle">{category.description}</p>
          )}
        </div>

        <ProductGrid 
          products={productsData?.content || []} 
          loading={isLoading}
        />
      </div>
    </MainLayout>
  );
}
