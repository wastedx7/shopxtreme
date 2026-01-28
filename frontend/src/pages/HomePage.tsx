import { Link } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { ProductGrid } from '@/components/products';
import { Button } from '@/components/ui/button';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { ArrowRight, ShoppingBag, Truck, Shield, HeadphonesIcon } from 'lucide-react';

export default function HomePage() {
  const { data: productsData, isLoading: productsLoading } = useProducts({ size: 8 });
  const { data: categories } = useCategories();

  const features = [
    {
      icon: ShoppingBag,
      title: 'Wide Selection',
      description: 'Thousands of products from verified sellers',
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping options',
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Your data and payments are protected',
    },
    {
      icon: HeadphonesIcon,
      title: '24/7 Support',
      description: 'We\'re here to help anytime',
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative gradient-hero text-primary-foreground">
        <div className="container-main py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Discover Products You'll Love
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">
              Shop from thousands of products from trusted sellers. Quality items, competitive prices, and excellent service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="btn-accent font-semibold">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/register/seller">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  Become a Seller
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Decorative element */}
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5 mix-blend-overlay" />
      </section>

      {/* Categories */}
      {categories && categories.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container-main">
            <h2 className="section-heading mb-6">Shop by Category</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}`}
                  className="flex-shrink-0 px-6 py-3 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-colors font-medium"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-16">
        <div className="container-main">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-heading">Featured Products</h2>
            <Link to="/products" className="text-primary hover:underline font-medium flex items-center gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid 
            products={productsData?.content || []} 
            loading={productsLoading}
          />
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-muted/30">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container-main">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-primary-foreground text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Selling?</h2>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Join our community of sellers and reach thousands of customers. Easy setup, powerful tools, and dedicated support.
            </p>
            <Link to="/register/seller">
              <Button size="lg" variant="secondary" className="btn-accent font-semibold">
                Start Selling Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
