import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function FeaturedProducts() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h3 className="font-playfair text-4xl font-bold text-navy mb-4">Featured Pieces</h3>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Handpicked selections from our master craftsmen, featuring the finest materials and exceptional artistry.
          </p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <Skeleton className="w-full h-64" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products?.length ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-gem text-2xl text-gray-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-navy mb-2">No featured products available</h3>
            <p className="text-gray-600">We're currently updating our featured collection. Please check back soon!</p>
          </div>
        )}

        {products?.length && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-2 border-navy text-navy px-8 py-3 rounded-lg font-semibold hover:bg-navy hover:text-white transition-all duration-300"
            >
              View All Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
