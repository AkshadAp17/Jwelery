import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import RatesDisplay from "@/components/RatesDisplay";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import CallButton from "@/components/CallButton";
import ProductCard from "@/components/ProductCard";
import { Product } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryPageProps {
  category: string;
}

const categoryTitles: Record<string, string> = {
  necklaces: "Necklaces",
  haras: "Haras",
  mangalsutra: "Mangalsutra",
  rings: "Rings",
  earrings: "Earrings",
  bracelets: "Bracelets",
};

export default function CategoryPage({ category }: CategoryPageProps) {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/category", category],
  });

  const title = categoryTitles[category] || "Products";

  return (
    <div className="min-h-screen bg-cream text-charcoal">
      <Header />
      <RatesDisplay />
      
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-playfair text-4xl lg:text-5xl font-bold text-navy mb-4">
              {title} Collection
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our exquisite {title.toLowerCase()} featuring traditional artistry and modern designs.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <Skeleton className="w-full h-64" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-8 w-1/2" />
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
              <h3 className="text-xl font-semibold text-navy mb-2">No products found</h3>
              <p className="text-gray-600">We're currently updating our {title.toLowerCase()} collection. Please check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <ChatWidget />
      <CallButton />
    </div>
  );
}
